import React, { Component, StyleSheet, ListView, TextInput, TouchableHighlight, TouchableNativeFeedback, PropTypes, View, Text, ProgressBarAndroid, Image, Slider, PanResponder, ScrollView} from 'react-native';
import { Card, Button, COLOR, TYPO, Icon, List, Subheader } from 'react-native-material-design';
import Modal from 'react-native-modalbox'
import PTRView from 'react-native-pull-to-refresh'
import url from '../http/url'
import Line from '../components/Line'
import moment from 'moment'
import FloatingActionButton from '../components/FloatingActionButton'
import toast from '../modules/Toast'
import storage from '../storage/storage'
import Dimensions from 'Dimensions'
import TextField from 'react-native-md-textinput'
import ActionButton from 'react-native-action-button'
    
export default class MainPage extends Component {
    static contextTypes = {
        navigator: React.PropTypes.object.isRequired,
    };
	constructor(props) {
        super(props);
        this.state = {
        	theme: COLOR[`googleGreen500`].color,
        	primary: 'googleGreen',
            uri: url.base+url.hot,
			list: null,
			before: null,
			endReached: false,
			refreshing: false,
			swipeToClose: true,
			selectedTab: 'link',
			postType: null,
			modhash: null,
			submit: {title: null, url: null, sr: null, text: null},
			width: Dimensions.get('window').width/2,
			dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,        
			}),
        };
        this.checkTheme();
        this.checkPosts();
    }

    componentWillMount() {
    }

    checkPosts = () => {
        storage.queryStorage("POSTS").then(
            (value) => {
                if(value){
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(JSON.parse(value)._dataBlob.s1),
                    });                    
                }else{
                    this.fetchPosts();
                }
            }
        ).done();
    };

    checkTheme = () => {
        storage.queryStorage("THEME").then(
        	(value) => {
        		if(value){
        			this.setState({
        				primary: value,
        				theme: COLOR[`${value}500`].color
        			});
        		}
        	}
    	).done();
    };

	fetchPosts = (resolve) => {
		if(this.state.endReached){
			return;
		}
		
		if(this.state.before){
			this.state,uri= this.state.uri + "?beforer=" + this.state.before;
		}
		
		fetch(this.state.uri)
		  .then((response) => response.json())
		  .then((responseData) => {
			if(this.state.before === responseData.data.after){
				return;
			}else if(!responseData.data.after){
				this.state.endReached = true;
			}
			
			if(this.state.before){
				responseData.data.children =
					this.state.dataSource._dataBlob.s1.concat(responseData.data.children);
			}

			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseData.data.children),
				before: responseData.data.after,
				refreshing: false,
			});
            storage.setStorage( "POSTS", this.state.dataSource);
            //resolve drag promise
            if(typeof resolve === 'function'){
            	resolve();
            }
		  })
		  .done();
	};

	onRefresh = () => {
		if(!this.state.refreshing){
			this.setState({
				refreshing: true,
				endReached: false,
				before: null,
				uri: url.base+url.hot,
			});
			return new Promise((resolve) => {
				this.fetchPosts(resolve);
			});
		} else {
			return new Promise((resolve) => {
				resolve();
			});
		}
	};

	checkAccount = (type) => {
		storage.queryStorage('COOKIE').then(
			(value) => {
				if(value){
					if(type === 'post'){
						this.setState({
							postType: 'post',
						});
					}else if(type === 'url'){
						this.setState({
							postType: 'url',
						});
					}
					this.setState({
						modhash: JSON.parse(value).json.data.modhash,
					});
					this.refs.modal.open();
				} else {
					toast.showToast("Please login first", 3000);
				}
		}).done();
	};

	submitPost = () => {
        var obj = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
				'Accept': "application/json",
            }
        }; 
		if(this.state.postType === 'post'){
			// ** normal json stringify body doesnt work 
			obj.body = "title="+this.state.submit.title+
				"&text="+this.state.submit.text+
				"&sr="+this.state.submit.sr+
				"&kind=self"+
				"&uh="+this.state.modhash;	
        }else if(this.state.postType === 'url'){
			// ** normal json stringify body doesnt work 
			obj.body = "title="+this.state.submit.title+
				"&url="+this.state.submit.url+
				"&sr="+this.state.submit.sr+
				"&kind=link"+
				"&uh="+this.state.modhash;
        }	

        fetch(url.submit, obj)
        	.then((response) => response.json())
		    .then((responseData) => {
		    	if(responseData.jquery[0][3] === 'refresh'){
		    		toast.showToast("wrong crednetial", 3000);
		    	}else if(responseData.jquery[18][3][0] === '.error.RATELIMIT.field-ratelimit'){
					toast.showToast("rate limit", 3000);
		    	}else if(responseData.jquery[18][3][0] === '.error.BAD_CAPTCHA.field-captcha'){
		    		toast.showToast("not enough karma", 3000);
		    	}else{
		    		toast.showToast("submit success", 3000);
		    	}
		    	this.refs.modal.close();
		    }).done();
	};

	render() {
		if(this.state.dataSource._dataBlob){
			return (
				<View style={{flex: 1}}>
				<PTRView onRefresh={this.onRefresh} colors={['#ff0000', '#00ff00', '#0000ff']} progressBackgroundColor={this.state.theme}>
					<View style={{flex: 1}}>
					  <ListView
						dataSource={this.state.dataSource}
						renderRow={this.renderRow.bind(this)}
						style={styles.listView}
						onEndReached={this.fetchPosts}
					  />
					</View>
				</PTRView>
		        <Modal style={styles.modalContainer} ref={"modal"} swipeToClose={this.state.swipeToClose}>
		        <ScrollView >
		        	<TextField dense={true} label={'title'} onChangeText={(text) => this.setState({submit: {title: text}})} highlightColor={this.state.theme} />
		        	{(() => {
		        		if(this.state.postType === 'post'){
			        			return(<TextField dense={true} label={'text'} multiline={true} onChangeText={(text) => this.setState({submit: {text: text}})} numberOfLines={4} highlightColor={this.state.theme} />);
			        		}else if(this.state.postType === 'url'){
			        			return(<TextField dense={true} label={'url'} onChangeText={(text) => this.setState({submit: {url: text}})} highlightColor={this.state.theme} />);
			        		}
	        			})()
		        	}
		        	<TextField dense={true} label={'subreddit'} onChangeText={(text) => this.setState({submit: {sr: text}})} highlightColor={this.state.theme} />
		        	<Button text={"Submit"} primary={this.state.primary} theme="dark" raised={true} />
		        	<Button text={"Cancel"} primary={'paperPink'} onPress={()=>{this.refs.modal.close()}} theme="dark" raised={true} />
		        </ScrollView>
		        </Modal>
	         	<ActionButton buttonColor={this.state.theme} position={'right'}>
	          		<ActionButton.Item buttonColor={COLOR[`googleGreen500`].color} title="Submit new post" onPress={() => {this.checkAccount('post')}}>
	            		<Icon name={'share'} style = {styles.actionButtonIcon} />
	          		</ActionButton.Item>
            		<ActionButton.Item buttonColor={COLOR[`googleBlue500`].color} title="Submit new url" onPress={() => {this.checkAccount('url')}}>
	            		<Icon name={'domain'} style = {styles.actionButtonIcon} />
	          		</ActionButton.Item>
	        	</ActionButton>
				</View>
			);
		} else {
			return (
				<View style={styles.loadingContainer}>
					<ProgressBarAndroid style={styles.spinner} />
				</View>
			);
		}
	}
    
	renderRow = (row)=> {
        const { navigator } = this.context;
		if(row.data.media){
			return(
				<View>
					<Line></Line>
					<Card>
                        <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={()=>{navigator.forward('content', null, {url: row.data.url});}}>
                        <View>
                            <Card.Media
                                image={<Image source={{uri:row.data.media.oembed.thumbnail_url}} />}
                                overlay
                            >
                                <Text style={[styles.imageHeader, COLOR.paperGrey50]}>
                                    {row.data.media.oembed.title}
                                </Text>
                                <Text style={[TYPO.paperSubhead, COLOR.paperGrey50]}>
                                    submitted by {row.data.author} {moment.unix(row.data.created_utc).fromNow()}r/{row.data.subreddit}
                                </Text>
                            </Card.Media>
                        </View>
                        </TouchableNativeFeedback>
						<Card.Body>
							<Text style={styles.subtitle}>Provided by {row.data.media.oembed.provider_name}</Text>
							<TouchableHighlight onPress={()=>{navigator.forward('comments', null, {sub: row.data.subreddit, id: row.data.id})}}>
								<Text style={styles.commentNum}>{row.data.num_comments} comments </Text>
							</TouchableHighlight>
						</Card.Body>
						<Card.Actions position="right">
							<Button text="check this sub" value="Check this sub" onPress={()=>{navigator.forward('subReddit', row.data.subreddit, {name: row.data.subreddit});}} />
						</Card.Actions>
					</Card>
				</View>				
			);
		}else{
			return (
				<View style={{flex: 1}}>
					<Line></Line>
					  <View style={styles.container}>
						<View style={styles.rightContainer}>
                        <TouchableNativeFeedback onPress={()=>{navigator.forward('content', null, {url: row.data.url});}}>
                          <View>
						      <Text style={styles.title}>{row.data.title}</Text>
						      <Text style={styles.subtitle}>submitted by {row.data.author} {moment.unix(row.data.created_utc).fromNow()}r/{row.data.subreddit}</Text>
                          </View>
                        </TouchableNativeFeedback>
						<TouchableHighlight onPress={()=>{navigator.forward('comments', null, {sub: row.data.subreddit, id: row.data.id});}}>
						  <Text style={styles.commentNum}>{row.data.num_comments} comments</Text>
						</TouchableHighlight>
						<Card.Actions position="right">
							<Button text="check this sub" value="Check this sub" onPress={()=>{navigator.forward('subReddit', row.data.subreddit, {name: row.data.subreddit});}} />
						</Card.Actions>
						</View>
					  </View>
				</View>
			);
		}
	};
}

var styles = StyleSheet.create({
  loadingContainer: {
	  flex: 1,
	  justifyContent: 'center',
	  alignItems: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  imageHeader: {
	  fontWeight: 'bold',
	  fontSize: 17,
	  textAlign: 'left',
	  color: '#ffffff'
  },
  title: {
	 marginLeft:10,
	 marginRight:10,
	 fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 8,
    textAlign: 'left',
      flex: 3,
  },
  subtitle: {
	  marginLeft: 10,
	  marginRight: 10,
  },
  commentNum: {
	  marginLeft: 10,
	  fontWeight: 'bold',
	  fontSize: 12,
  },
  listView: {
    paddingTop: 5,
    backgroundColor: '#F5FCFF',
  },
  spinner: {
	  width: 60,
	  height: 60,
  },
   modalContainer: {
   	position: 'absolute',
   	top: 0,
   	left: 0,
   	bottom: 0,
   	right: 0,
  },
  textRow: {
  	borderTopWidth: 1,
  	borderBottomWidth: 1,
  	borderColor: 'grey',
  	backgroundColor: '#cee3f8',
  },
  text: {
  	marginLeft: 20,
  	marginRight: 20,
  	backgroundColor: '#ffffff'
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});