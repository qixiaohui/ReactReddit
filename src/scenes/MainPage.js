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
    
export default class MainPage extends Component {
    static contextTypes = {
        navigator: React.PropTypes.object.isRequired,
    };
	constructor(props) {
        super(props);
        this.state = {
        	theme: COLOR[`googleBlue500`].color,
            uri: url.base+url.hot,
			list: null,
			before: null,
			endReached: false,
			refreshing: false,
			swipeToClose: true,
			selectedTab: 'link',
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

	checkAccount = () => {
		storage.queryStorage('COOKIE').then(
			(value) => {
				if(value){
					this.refs.modal.open();
				} else {
					toast.showToast("Please login first", 3000);
				}
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
		        <View >
		        	<Subheader text="Title" color={this.state.theme}  />
		        	<View style={styles.textRow}>
		        		<TextInput style={styles.text} />
		        	</View>
		        </View>
		        </Modal>
                <TouchableHighlight background={TouchableNativeFeedback.SelectableBackground()} style = {styles.fabContainer} onPress={()=>{this.checkAccount()}}>
                    <View>
                        <FloatingActionButton theme={this.state.theme} style = {styles.floatingButton} />
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
  fabContainer: {
      position: 'absolute',
      bottom: 25,
      right: 25,     
  },
  floatingButton: {
      width: 56,
      height: 56, 
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
  }
});