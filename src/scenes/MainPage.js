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
import ScrollableTabView from 'react-native-scrollable-tab-view'
import tinycolor from 'tinycolor2'
    
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
			after: null,
			endReached: false,
			refreshing: false,
			swipeToClose: true,
			selectedTab: 'link',
			postType: null,
			modhash: null,
			genre: 'HOT',
			loaded: false,
			title: null,
			url: null,
			text: null,
			sr: null,
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

    componentDidMount() {
    	this.checkLogin();
    }

    checkLogin = () => {
    	storage.queryStorage("COOKIE").then(
    		(value) => {
    			if(value){
    				this.setState({
    					modhash: JSON.parse(value).modhash,
    				});
    			}
    		}
		).done();
    };

    checkPosts = () => {
        storage.queryStorage("POSTS_"+this.state.genre).then(
            (value) => {
                if(value){
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(JSON.parse(value).data._dataBlob.s1),
                        after: JSON.parse(value).after,
                        loaded: true,
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
		var url = this.state.uri;
		if(this.state.endReached){
			return;
		}
		
		if(this.state.after){
			url = this.state.uri + "?after=" + this.state.after;
		}
		console.log(url);
		fetch(url)
		  .then((response) => response.json())
		  .then((responseData) => {
			if(this.state.after === responseData.data.after){
				return;
			}else if(!responseData.data.after){
				this.state.endReached = true;
			}
			
			if(this.state.after){
				responseData.data.children =
					this.state.dataSource._dataBlob.s1.concat(responseData.data.children);
			}

			if(typeof this.setState === 'function'){
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(responseData.data.children),
					after: responseData.data.after,
					refreshing: false,
					loaded: true,
				});
			}

			if(Array.isArray(this.state.dataSource._dataBlob.s1) && this.state.dataSource._dataBlob.s1.length<60){
            	storage.setStorage( "POSTS_"+this.state.genre, {after: this.state.after, data: this.state.dataSource});
        	}
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
				after: null,
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
		if(this.state.modhash){
			this.refs.modal.open();
			if(type === 'post'){
				this.setState({
					postType: 'post',
				});
			}else if(type === 'url'){
				this.setState({
					postType: 'url',
				});
			}
		}else{
			toast.showToast("Please login first", 3000);
		}
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
			obj.body = "title="+this.state.title+
				"&text="+this.state.text+
				"&sr="+this.state.sr+
				"&kind=self"+
				"&uh="+this.state.modhash;	
        }else if(this.state.postType === 'url'){
			// ** normal json stringify body doesnt work 
			obj.body = "title="+this.state.title+
				"&url="+this.state.url+
				"&sr="+this.state.sr+
				"&kind=link"+
				"&uh="+this.state.modhash;
        }	

        fetch(url.submit, obj)
        	.then((response) => {console.log(JSON.stringify(response.json())+"****");response.json()})
		    .then((responseData) => {
		    	console.log(JSON.stringify(responseData));
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

	changeTab = (data) => {
		if(['HOT','NEW','RISING'].indexOf(this.state.genre) != data.i){
			if(data.i === 0){
				this.setState({
					uri: url.base+url.hot,
					genre: 'HOT',
					loaded: false,
					after: null,
				});
			}else if(data.i===1){
				this.setState({
					uri: url.base+url.new,
					genre: 'NEW',
					loaded: false,
					after: null,
				});
			}else if(data.i === 2){
				this.setState({
					uri: url.base+url.rising,
					genre: 'RISING',
					loaded: false,
					after: null,
				});
			}

			this.checkPosts();
		}
	};

	render() {
		return (
			<View style={{flex: 1}}>
			<ScrollableTabView onChangeTab={(i) => {this.changeTab(i);}} tabBarBackgroundColor={this.state.theme} tabBarUnderlineColor={tinycolor(this.state.theme).complement().toHexString()} tabBarActiveTextColor={tinycolor(this.state.theme).complement().toHexString()} tabBarInactiveTextColor={"#ffffff"}>
			{(() => {
				if(this.state.genre === 'HOT' && this.state.loaded){
					return(
						<PTRView tabLabel='Hot' onRefresh={this.onRefresh} colors={['#ff0000', '#00ff00', '#0000ff']} progressBackgroundColor={this.state.theme}>
							<ScrollView style={{flex: 1}}>
							  <ListView
								dataSource={this.state.dataSource}
								renderRow={this.renderRow.bind(this)}
								style={styles.listView}
								onEndReached={this.fetchPosts}
							  />
							</ScrollView>
						</PTRView>
					);
				}else{
					return (<View tabLabel='Hot' style={styles.loadingContainer}>
						<ProgressBarAndroid style={styles.spinner} />
					</View>);
				}})()
			}
			{(() => {
				 if(this.state.genre === 'NEW' && this.state.loaded){
					return(
						<PTRView tabLabel='New' onRefresh={this.onRefresh} colors={['#ff0000', '#00ff00', '#0000ff']} progressBackgroundColor={this.state.theme}>
							<ScrollView style={{flex: 1}}>
							  <ListView
								dataSource={this.state.dataSource}
								renderRow={this.renderRow.bind(this)}
								style={styles.listView}
								onEndReached={this.fetchPosts}
							  />
							</ScrollView>
						</PTRView>
					);
				}else{
					return (<View tabLabel='New' style={styles.loadingContainer}>
						<ProgressBarAndroid style={styles.spinner} />
					</View>);
				}})()
			}
			{(() => {
				 if(this.state.genre === 'RISING' && this.state.loaded){
					return(
						<PTRView tabLabel='Rising' onRefresh={this.onRefresh} colors={['#ff0000', '#00ff00', '#0000ff']} progressBackgroundColor={this.state.theme}>
							<ScrollView style={{flex: 1}}>
							  <ListView
								dataSource={this.state.dataSource}
								renderRow={this.renderRow.bind(this)}
								style={styles.listView}
								onEndReached={this.fetchPosts}
							  />
							</ScrollView>
						</PTRView>
					);
				}else{
					return (<View tabLabel='Rising' style={styles.loadingContainer}>
						<ProgressBarAndroid style={styles.spinner} />
					</View>);
				}})()
			}
			</ScrollableTabView>
	        <Modal style={styles.modalContainer} ref={"modal"} swipeToClose={this.state.swipeToClose}>
	        <ScrollView >
	        	<TextField dense={true} label={'title'} onChangeText={(text) => this.setState({title: text})} highlightColor={this.state.theme} />
	        	{(() => {
	        		if(this.state.postType === 'post'){
		        			return(<TextField dense={true} label={'text'} multiline={true} onChangeText={(text) => this.setState({text: text})} numberOfLines={4} highlightColor={this.state.theme} />);
		        		}else if(this.state.postType === 'url'){
		        			return(<TextField dense={true} label={'url'} onChangeText={(text) => this.setState({url: text})} highlightColor={this.state.theme} />);
		        		}
        			})()
	        	}
	        	<TextField dense={true} label={'subreddit'} onChangeText={(text) => this.setState({sr: text})} highlightColor={this.state.theme} />
	        	<Button text={"Submit"} primary={this.state.primary} onPress={() => {this.submitPost()}} theme="dark" raised={true} />
	        	<Button text={"Cancel"} primary={'paperPink'} onPress={()=>{this.refs.modal.close()}} theme="dark" raised={true} />
	        </ScrollView>
	        </Modal>
         	<ActionButton bgColor={'transparent'} buttonColor={this.state.theme} position={'right'}>
          		<ActionButton.Item buttonColor={COLOR[`googleGreen500`].color} title="Submit new post" onPress={() => {this.checkAccount('post')}}>
            		<Icon name={'share'} style = {styles.actionButtonIcon} />
          		</ActionButton.Item>
        		<ActionButton.Item buttonColor={COLOR[`googleBlue500`].color} title="Submit new url" onPress={() => {this.checkAccount('url')}}>
            		<Icon name={'domain'} style = {styles.actionButtonIcon} />
          		</ActionButton.Item>
        	</ActionButton>
			</View>
		);
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