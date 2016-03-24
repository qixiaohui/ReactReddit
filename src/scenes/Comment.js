import React, {Component, ScrollView, StyleSheet, Image, ProgressBarAndroid, View, Text, TextInput, TouchableHighlight, TouchableNativeFeedback} from 'react-native';
import {Button} from 'react-native-material-design'
import TextField from 'react-native-md-textinput'
import storage from '../storage/storage'
import CommentCard from '../components/CommentCard'
import moment from 'moment'
import Line from '../components/Line'
import _ from 'underscore'
import url from '../http/url'
import toast from '../modules/Toast'
import Modal from 'react-native-modalbox'
import ajax from '../http/ajax'

export default class Comment extends Component{
	constructor(props) {
		super(props);
		this.state = {
			sub: props.sub,
			id: props.id,
			token: props.token,
			tokenTimeStamp: props.timeStamp,
			text: null,
			primary: props.primary,
			theme: props.theme,
			comments: null,
			commentArr: [],
			thingId: null,
			checkLogin: false,
		};
		
		this.fetchComments();
	}
	
	fetchComments = () => {
		fetch(url.baseSubreddit+this.state.sub+"/"+this.state.id+".json")
		  .then((response) => response.json())
		  .then((responseData) => {
				this.setState({
					comments: responseData
				});
				this.renderComments(this.state.comments[1].data.children, 0);
				this.forceUpdate();
		  })
	};

	renderComments = (data, indent) => {
		_.each(data, function(comment) {
			this.state.commentArr.push({
				author: comment.data.author,
				body: comment.data.body,
				created: comment.data.created,
				score: comment.data.score,
				indent: indent,
				thingId: comment.data.name,
			});

			if(comment.data.replies){
				let value = indent+1;
				this.renderComments(comment.data.replies.data.children, value);
			}
			return;
		}.bind(this));
	};

	setNativeProps = (props) => {
		this.refs["CommentCard"].setNativeProps(props);
	};

	comment = () => {
		if(this.state.checkLogin){
			if(this.state.text){
				let promise = new Promise((resolve, reject) => {
					ajax.postComment(
					resolve,
					reject,
					"t3_"+this.state.id,
					this.state.text,
					this.state.comments[0].data.children[0].data.subreddit,
					this.state.thingId);
				});
				Promise.all([promise]).then(function(value){
					let val = JSON.parse(value);
					if(this.state.thingId){
						setTimeout(() => {
							this.fetchComments();
						}, 100);
					}else{
						this.state.commentArr.push({
							author: val.data.author,
							body: val.data.body,
							created: val.data.created,
							score: val.data.score,
							indent: 0,
							thingId: val.data.name,
						});
					}
					this.setState({thingId: null});
					this.refs.modal.close();
					this.forceUpdate();
				}.bind(this)).catch(function(e){
					this.setState({thingId: null});
					toast.showToast(JSON.stringify(e), 300)
					this.refs.modal.close();
				}.bind(this));
			}else{
				toast.showToast("Please fill in comment first", 3000);
			}
		}else{
			toast.showToast("Please login first", 3000);
		}
	};

	modalOpen = () => {
		storage.queryStorage("ACCESS_TOKEN").then((value) => {
			if(!value){
				toast.showToast("Please login first", 3000);
			}else{
				this.setState({
					checkLogin: true,
				});
			}
		}).done();
	};
	
	render() {
		if(this.state.comments){
			return(
				<View style={{flex: 1}}>
					<ScrollView>
						<View style={styles.headerContainer}>
							<View style={{flex: 1.5}}>
								<Image style = {styles.thumbnail} source={{uri:this.state.comments[0].data.children[0].data.thumbnail}} />
							</View>
							<View style={{flex: 3}}>
								<Text style={styles.headerTitle}>{this.state.comments[0].data.children[0].data.title}</Text>
								<Text style={styles.headerInfo}>submitted {moment.unix(this.state.comments[0].data.children[0].data.created_utc).fromNow()} ago by {this.state.comments[0].data.children[0].data.author}</Text>
							</View>
						</View>
						<View>
							<Text style={styles.headerInfo}>({this.state.comments[0].data.children[0].data.domain}) {this.state.comments[0].data.children[0].data.num_comments} comments</Text>
						</View>
						<Line></Line>
						<View>
							{_.map(this.state.commentArr, function(comment) {
								if(comment.score){
									return (
							 	<TouchableHighlight onPress={() => {this.refs.modal.open(); this.setState({thingId: comment.thingId});}}>
							 		<View>
							 			<CommentCard ref={"CommentCard"} data={comment} />
							 		</View>
								</TouchableHighlight>
							 );
								}
							}.bind(this))}
						</View>
					</ScrollView>
					<TouchableNativeFeedback onPress={() => {this.refs.modal.open();}}>
						<View style={[styles.button,{backgroundColor: this.state.theme}]}>
							<Text style={{color: '#ffffff'}}>Submit</Text>
						</View>
					</TouchableNativeFeedback>						
					<View>
					</View>
					<Modal ref={"modal"} onOpened={this.modalOpen}> 
						<TextInput 
							autoFocus={true}
							multiline={true}
							numberOfLines={5}
							placeholder={"Comment"}
							underlineColorAndroid={this.state.theme}
							sectionColor={this.state.theme}
							style={{borderColor: 'grey', borderWidth: 1, padding: 5, marginTop: 30}}
							onChangeText={(text) => {this.setState({text: text})}}
							value={this.state.text}
						/>
						<Button onPress={() => {this.comment();}} text={"Submit"} primary={this.state.primary} theme="dark" raised={true} />
					</Modal>
				</View>
			);
		}else{
			return (
				<View style={styles.loadingContainer}>
					<ProgressBarAndroid style={styles.spinner} />
				</View>
			);	
		}
	}
}

var styles = StyleSheet.create({
    headerContainer: {
    	marginTop: 10,
        flex: 1,
        flexDirection: 'row',
    },
	loadingContainer: {
	  flex: 1,
	  justifyContent: 'center',
	  alignItems: 'center',
	},
	spinner: {
		width: 70,
		height: 60,
	},
	thumbnail: {
		marginLeft:10,
		marginTop:5,
		width: 60,
		height: 60,
	},
	headerTitle: {
		fontSize: 17,
		color: '#551a8b',
	},
	headerInfo: {
		marginLeft:10,
		fontSize: 12,
		color: '#888888'
	},
	commentBox: {
		marginTop: 40,
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 40,
		margin: 4,
		borderRadius: 1,
	}
});