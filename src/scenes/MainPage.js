import React, { Component, StyleSheet, ListView, TouchableHighlight, PropTypes, View, Text, Image } from 'react-native';
import { Card, Button, COLOR, TYPO } from 'react-native-material-design';
import url from '../http/url'
import Line from '../components/Line'
import moment from 'moment'
export default class MainPage extends Component {
	constructor(props) {
        super(props);
        this.state = {
			list: null,
			before: null,
			endReached: false,
			dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,        
			}),
        };
		this.fetchPosts();
    }
	fetchPosts = () => {
		if(this.state.endReached){
			return;
		}
		
		if(this.state.before){
			url.new = url.new + "?beforer=" + this.state.before;
		}
		
		fetch(url.new)
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
		  })
		  .done();
	};
	render() {
		if(this.state.dataSource._dataBlob){
			return (
				<View style={{flex: 1}}>
				  <ListView
					dataSource={this.state.dataSource}
					renderRow={this.renderRow}
					style={styles.listView}
					onEndReached={this.fetchPosts}
				  />
				</View>
			);
		} else {
			return (
				<View>
				</View>
			);
		}
	}
    
	renderRow = (row)=> {
		if(row.data.media){
			return(
				<View>
					<Line></Line>
					<Card>
						<Card.Media
							image={<Image source={{uri:row.data.media.oembed.thumbnail_url}} />}
							overlay
						>
							<Text style={[styles.imageHeader, COLOR.paperGrey50]}>
								{row.data.media.oembed.title}
							</Text>
							<Text style={[TYPO.paperSubhead, COLOR.paperGrey50]}>
								submitted by {row.data.author} {moment.unix(row.data.created_utc).fromNow()} r/{row.data.subreddit}
							</Text>
						</Card.Media>
						<Card.Body>
							<Text style={styles.subtitle}>Provided by {row.data.media.oembed.provider_name}</Text>
							<Text style={styles.commentNum}>{row.data.num_comments} comments</Text>
						</Card.Body>
						<Card.Actions position="right">
							<Button value="ACTION" />
						</Card.Actions>
					</Card>
				</View>				
			);
		}else{
			return (
				<View style={{flex: 1}}>
					<Line></Line>
					<TouchableHighlight>
					  <View style={styles.container}>
						<View style={styles.rightContainer}>
						  <Text style={styles.title}>{row.data.title}</Text>
						  <Text style={styles.subtitle}>submitted by {row.data.author} {moment.unix(row.data.created_utc).fromNow()} r/{row.data.subreddit}</Text>
						  <Text style={styles.commentNum}>{row.data.num_comments} comments</Text>
						</View>
					  </View>
					</TouchableHighlight>
				</View>
			);
		}
	};
}

var styles = StyleSheet.create({
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
});