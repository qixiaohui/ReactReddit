import React, { Component, StyleSheet, ListView, TouchableHighlight, TouchableNativeFeedback, PropTypes, View, Text, ProgressBarAndroid, Image } from 'react-native';
import { Card, Button, COLOR, TYPO } from 'react-native-material-design';
import PTRView from 'react-native-pull-to-refresh'
import url from '../http/url'
import Line from '../components/Line'
import moment from 'moment'
import toast from '../modules/Toast'
import storage from '../storage/storage'
    
export default class SubReddit extends Component {
    static contextTypes = {
        navigator: React.PropTypes.object.isRequired,
    };
	constructor(props) {
        super(props);
        this.state = {
        	theme: COLOR[`googleGreen500`].color,
        	primary: 'googleGreen',
          name: props.name,
          subName: props.name,
          uri: url.baseSubreddit+props.name+"/"+url.hot,
    			list: null,
    			after: null,
    			endReached: false,
    			accessToken: null,
    			tokenTimeStamp: null,
          endReached: false,
          refreshing: false,
    			dataSource: new ListView.DataSource({
    			rowHasChanged: (row1, row2) => row1 !== row2,        
			}),
        };
        
        // in case there is no prop url when come back from content
        if(!this.state.name){
            storage.queryStorage("CURRENT_SUB").then((value) => {
                this.setState({
                    name: value,
                    uri: url.baseSubreddit + value + "/" + url.hot,
                });
                this.checkCache();
            }).done();
        }else{
            storage.setStorage("CURRENT_SUB",this.state.name);    
            this.checkCache();
        }

		this.checkTheme();
        this.checkLogin();     
    }
    
    checkCache = () => {
        storage.queryStorage(this.state.name).then(
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
		
		if(this.state.after){
			this.state.uri = this.state.uri + "?after=" + this.state.after;
		}
		
		fetch(this.state.uri)
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
      if(this.state.dataSource._dataBlob.s1.length > 250){
        this.setState({
          endReached: true
        });
      }
      storage.setStorage( this.state.name, this.state.dataSource);

      //resolve drag promise
      if(typeof resolve === 'function'){
        resolve();
      }
		  }).catch((e) => {
        console.error(e);
      }).done();
	};

  onRefresh = () => {
    if(!this.state.refreshing){
      this.setState({
        refreshing: true,
        endReached: false,
        after: null,
        uri: url.baseSubreddit+this.state.subName+"/"+url.hot,
      });
      return new Promise((resolve) => {
        this.fetchPosts(resolve);
        setTimeout(() => {
          if(this.state.refreshing){
            resolve();
            this.setState({
              refreshing: false,
            });
          }
        }, 3000);
      });
    } else {
      return new Promise((resolve) => {
        resolve();
      });
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
                        <TouchableNativeFeedback onPress={()=>{navigator.forward(null, null, {url: row.data.url});}}>
                        <View>
                            <Card.Media
                                image={<Image source={{uri:row.data.media.oembed.thumbnail_url}} />}
                                overlay
                            >
                                <Text style={[styles.imageHeader, COLOR.paperGrey50]}>
                                    {row.data.media.oembed.title}
                                </Text>
                                <Text style={[TYPO.paperSubhead, COLOR.paperGrey50]}>
                                    submitted by {row.data.author} {moment.unix(row.data.created_utc).fromNow()}
                                </Text>
                            </Card.Media>
                        </View>
                        </TouchableNativeFeedback>
						<Card.Body>
							<Text style={styles.subtitle}>Provided by {row.data.media.oembed.provider_name}</Text>
							<TouchableHighlight onPress={()=>{navigator.forward('comments', null, {sub: row.data.subreddit, id: row.data.id, token: this.state.accessToken, timeStamp: this.state.tokenTimeStamp, primary: this.state.primary, theme: this.state.theme})}}>
								<Text style={styles.commentNum}>{row.data.num_comments} comments</Text>
							</TouchableHighlight>
						</Card.Body>
					</Card>
				</View>				
			);
		}else{
			return (
				<View style={{flex: 1}}>
					<Line></Line>
					  <View style={styles.container}>
						<View style={styles.rightContainer}>
                        <TouchableNativeFeedback onPress={()=>{navigator.forward(null, null, {url: row.data.url});}}>
                          <View>
						      <Text style={styles.title}>{row.data.title}</Text>
						      <Text style={styles.subtitle}>submitted by {row.data.author} {moment.unix(row.data.created_utc).fromNow()}</Text>
                          </View>
                        </TouchableNativeFeedback>
						<TouchableHighlight onPress={()=>{navigator.forward('comments', null, {sub: row.data.subreddit, id: row.data.id, token: this.state.accessToken, timeStamp: this.state.tokenTimeStamp, primary: this.state.primary, theme: this.state.theme})}}>
						  <Text style={styles.commentNum}>{row.data.num_comments} comments</Text>
						</TouchableHighlight>
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
  commentIcon: {
	  marginTop: 10,
  }
});