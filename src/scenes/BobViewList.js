import React, { Component, StyleSheet, ListView, TouchableNativeFeedback, PropTypes, View, Text, ProgressBarAndroid, Image, DeviceEventEmitter } from 'react-native';
import FloatingActionButton from '../components/FloatingActionButton'
import toast from "../modules/Toast"
import BobView from '../components/BobView'
export default class BobViewList extends Component{
	constructor(props){
		super(props);
		this.state = {
//			dataSource: new ListView.DataSource({
//			rowHasChanged: (row1, row2) => row1 !== row2,   
//			}),
            row: null
		};

		this.fetchData();
	}

	fetchData = () => {
		var API_KEY = '7waqfqbprs7pajbz28mqf6vz';
		var API_URL = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json';
		var PAGE_SIZE = 25;
		var PARAMS = '?apikey=' + API_KEY + '&page_limit=' + PAGE_SIZE;
		var REQUEST_URL = API_URL + PARAMS;
		fetch(REQUEST_URL)
		  .then((response) => response.json())
		  .then((responseData) => {
            this.setState({row: responseData.movies[0]});
//			this.setState({
//				dataSource: this.state.dataSource.cloneWithRows(responseData.movies),
//			});		  	
		  });
	};

	renderRow = (row) => {
		var map = {
			poster: row.posters.thumbnail,
			title: row.title,
			year: row.year,
			rating: row.ratings.critics_score,
			actor: row.abridged_cast[0].name 
		};
		console.log(JSON.stringify(map));
		return(<View><BobView  bobInfo = {map} /></View>);
	};

	render() {
//			return (<View style={{flex: 1}}>
//					<ListView
//					dataSource={this.state.dataSource}
//					renderRow={this.renderRow.bind(this)}
//					style={styles.listView}
//					 />
//				</View>);
		if(this.state.row){
			console.log("*&&&&"+JSON.stringify(this.state.row));
           var map = {
               poster: this.state.row.posters.thumbnail,
               title: this.state.row.title,
               year: this.state.row.year,
               rating: this.state.row.ratings.critics_score,
               actor: this.state.row.abridged_cast[0].name 
           };
           console.log("%&&"+JSON.stringify(map));
            console.log("bobview"+BobView);
            console.log(<BobView />);
            return(<View style={{flex: 1}}>
                   <BobView bobInfo={this.map} style={{width: 2000, height: 2000}}  />
            	</View>);
        }else{
        	return(<View></View>);
        }
	}
}
var styles = StyleSheet.create({
  listView: {
    paddingTop: 5,
    backgroundColor: '#F5FCFF',
  },
   floatingButton: {
      width: 56,
      height: 56, 
  },
});