import React, { Component, StyleSheet, ListView, TextInput, TouchableHighlight, TouchableNativeFeedback, PropTypes, View, Text, ProgressBarAndroid, Image, Slider, PanResponder, ScrollView} from 'react-native';
import { Card, Button, COLOR, TYPO, Icon, List, Subheader } from 'react-native-material-design';
import Modal from 'react-native-modalbox'
import PTRView from 'react-native-pull-to-refresh'
import url from '../http/url'
import Line from '../components/Line'
import Time from '../utils/Time'
import moment from 'moment'
import FloatingActionButton from '../components/FloatingActionButton'
import toast from '../modules/Toast'
import storage from '../storage/storage'
import Dimensions from 'Dimensions'
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
			after: null,
			endReached: false,
			refreshing: false,
			accessToken: null,
			tokenTimeStamp: null,
			dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,        
			}),
        };
        this.checkTheme();
        this.checkPosts();
        this.checkLogin();
    }

    componentWillMount() {
    }

    componentDidMount() {
    	this.checkLogin();
    }

    checkLogin = () => {
    	storage.queryStorage("ACCESS_TOKEN").then(
    		(value) => {
    			if(value){
    				this.setState({
    					accessToken: JSON.parse(value).token,
    					tokenTimeStamp: JSON.parse(value).timeStamp,
    				});
    			}
    		}
		).done();
    };

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
		var url = this.state.uri;
		if(this.state.endReached){
			return;
		}
		
		if(this.state.after){
			url= this.state.uri + "?after=" + this.state.after;
		}
		
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

			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseData.data.children),
				after: responseData.data.after,
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
				after: null,
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

	checkAccount = () => {
		const { navigator }  = this.context;	

		if(this.state.accessToken){
			Time.checkTokenExpire(this.state.tokenTimeStamp, this.state.accessToken);
			navigator.forward('submit', null, {theme: this.state.theme, primary: this.state.primary, token: this.state.accessToken});
		}else{
			toast.showToast("Please login first", 3000);
		}
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
    			<TouchableHighlight style = {styles.fabContainer} onPress={()=>{this.checkAccount()}}>
                    <View>
                        <FloatingActionButton style = {styles.floatingButton} theme={this.state.theme} />
                    </View>
                </TouchableHighlight>
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
							<TouchableHighlight onPress={()=>{navigator.forward('comments', null, {sub: row.data.subreddit, id: row.data.id, token: this.state.accessToken, timeStamp: this.state.tokenTimeStamp, primary: this.state.primary, theme: this.state.theme})}}>
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
						<TouchableHighlight onPress={()=>{navigator.forward('comments', null, {sub: row.data.subreddit, id: row.data.id, token: this.state.accessToken, timeStamp: this.state.tokenTimeStamp, primary: this.state.primary, theme: this.state.theme});}}>
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
  fabContainer: {
      position: 'absolute',
      bottom: 25,
      right: 25,     
  },
  floatingButton: {
      width: 56,
      height: 56, 
  },
});