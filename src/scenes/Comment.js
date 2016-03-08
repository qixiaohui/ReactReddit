import React, {Component, ScrollView, StyleSheet, Image, ProgressBarAndroid, View, Text} from 'react-native';
import CommentCard from '../components/CommentCard'
import moment from 'moment'
import Line from '../components/Line'
import _ from 'underscore'
import url from '../http/url'
import toast from '../modules/Toast'
export default class Comment extends Component{
	constructor(props) {
		super(props);
		this.state = {
			sub: props.sub,
			id: props.id,
			comments: null,
			commentArr: []
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
				indent: indent
			});

			if(comment.data.replies){
				this.renderComments(comment.data.replies.data.children, indent++);
			}
		}.bind(this));
	};
	
	render() {
		if(this.state.comments){
			return(
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
								return (<CommentCard data={comment} />);
							}
						})}
					</View>
				</ScrollView>
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
		width: 60,
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
	}
});