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
		fetch("http://10.143.28.63:3000/movies")
		  .then((response) => response.json())
		  .then((responseData) => {
		  	console.log(JSON.stringify(responseData));
            this.setState({row: responseData.boxOffice.movies[0]});
//			this.setState({
//				dataSource: this.state.dataSource.cloneWithRows(responseData.movies),
//			});		  	
		  }).done();
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
                   <BobView bobInfo={map} style={{width: 200, height: 200}}  />
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