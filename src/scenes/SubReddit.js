import React, { Component, StyleSheet, ListView, TouchableHighlight, TouchableNativeFeedback, PropTypes, View, Text, ProgressBarAndroid, Image } from 'react-native';
import { Card, Button, COLOR, TYPO } from 'react-native-material-design';
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
        console.log("props"+props.name);
        this.state = {
            name: props.name,
            uri: url.base+props.name+"/"+url.hot,
			list: null,
			before: null,
			endReached: false,
			dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,        
			}),
        };
        
        // in case there is no prop url when come back from content
        if(!this.state.name){
            storage.queryStorage("CURRENT_SUB").then((value) => {
                this.setState({
                    name: value,
                    uri: url.base + value + "/" + url.hot,
                });
                this.checkCache();
            }).done();
        }else{
            storage.setStorage("CURRENT_SUB",this.state.name);    
            this.checkCache();
        }        
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
    
	fetchPosts = () => {
		if(this.state.endReached){
			return;
		}
		
		if(this.state.before){
			this.state.uri = this.state.uri + "?beforer=" + this.state.before;
		}
		
		fetch(this.state.uri)
		  .then((response) => response.json())
		  .then((responseData) => {
//			OFFSET+=20;
//			var data = this.state.dataSource._dataBlob.s1.concat(responseData.businesses);
//			this.setState({
//			  dataSource: this.state.dataSource.cloneWithRows(data),
//			});
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
            storage.setStorage( this.state.name, this.state.dataSource);
		  })
		  .done();
	};
	render() {
		if(this.state.dataSource._dataBlob){
			return (
				<View style={{flex: 1}}>
				  <ListView
					dataSource={this.state.dataSource}
					renderRow={this.renderRow.bind(this)}
					style={styles.listView}
					onEndReached={this.fetchPosts}
				  />
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
							<Text style={styles.commentNum}>{row.data.num_comments} comments</Text>
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
						  <Text style={styles.commentNum}>{row.data.num_comments} comments</Text>
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