import React, { Component, StyleSheet, ListView, TouchableHighlight, TouchableNativeFeedback, PropTypes, View, Text, ProgressBarAndroid, Image } from 'react-native';
import { Card, Button, COLOR, TYPO, Icon, List } from 'react-native-material-design';
import url from '../http/url'
import Line from '../components/Line'
import moment from 'moment'
import FloatingActionButton from '../components/FloatingActionButton'
import toast from '../modules/Toast'
import storage from '../storage/storage'
    
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
			dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,        
			}),
        };
        this.checkPosts();
        this.checkTheme();
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

	fetchPosts = () => {
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
			});
            storage.setStorage( "POSTS", this.state.dataSource);
		  })
		  .done();
	};
	render() {
		toast.showToast(this.state.theme, 3000);
		if(this.state.dataSource._dataBlob){
			return (
				<View style={{flex: 1}}>
				  <ListView
					dataSource={this.state.dataSource}
					renderRow={this.renderRow.bind(this)}
					style={styles.listView}
					onEndReached={this.fetchPosts}
				  />
                <TouchableHighlight style = {styles.fabContainer} onPress={()=>{toast.showToast("Please login first", 2000)}}>
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
                        <TouchableNativeFeedback onPress={()=>{navigator.forward('content', null, {url: row.data.url});}}>
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
});