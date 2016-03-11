import React, { Component, StyleSheet, ListView, TouchableNativeFeedback, PropTypes, View, Text, ProgressBarAndroid, Image, DeviceEventEmitter } from 'react-native';
import FloatingActionButton from '../components/FloatingActionButton'
import toast from "../modules/Toast"
import BobView from '../components/BobView'
export default class BobViewList extends Component{
	constructor(props){
		super(props);
		this.state = {
			index: 0,
			title: '',
			focusDrawer: false,
			dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1['highlight'] !== row2['highlight'],   
			}),
		};

		this.fetchData();
	}

    handleKey = (key) => {
    	const { navigator } = this.context;
        switch(key){
            case "0":
                break;
            case "1":
            	if(this.state.index>0 && !this.state.focusDrawer){
            		this.state.index--;
                    this.state.dataSource._dataBlob.s1[this.state.index].highlight = 
                    this.state.index;
                    this.state.title=this.state.dataSource._dataBlob.s1[this.state.index].title;
                    this.forceUpdate();
            	}
                break;
            case "2":
            	this.setState({
            		focusDrawer: false,
            	});
                break;
            case "3":
            	if(this.state.index<this.state.dataSource._dataBlob.s1.length &&
            	 !this.state.focusDrawer){
            		this.state.index++;
                    console.log("==="+this.state.title);
                    this.state.dataSource._dataBlob.s1[this.state.index].highlight = 
                    this.state.index;
                    this.state.title=this.state.dataSource._dataBlob.s1[this.state.index].title;
                    this.forceUpdate();
            	}
                break;
            case "4":
            	this.setState({
            		focusDrawer: true,
            	});
                break;       
        }
    };

	fetchData = () => {
		fetch("http://10.143.28.63:3000/movies")
		  .then((response) => response.json())
		  .then((responseData) => {
		  	console.log(JSON.stringify(responseData));
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseData.upcomming.movies),
			});		  	
		  }).done();
	};

    componentWillMount() {
        DeviceEventEmitter.addListener('keyDown', function(e: Event){
            this.handleKey(e.code);
        }.bind(this));
    }

	renderRow = (row) => {
		var map = {
			poster: row.posters.thumbnail,
			title: row.title,
			year: row.year,
			rating: row.ratings.critics_score,
			actor: row.abridged_cast[0].name,
			description: row.synopsis,
            highlight: "",
		};

		return(<TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#888888", false)}>
			<View>
			<BobView title={this.state.title} bobInfo={map}  style={{width: 300, height: 200}}/>
			</View>
			</TouchableNativeFeedback>);
	};

	render() {
		if(this.state.dataSource._dataBlob){
            console.log("rerender");
            return(<View style={{flex: 1}}>
   				  <ListView
					dataSource={this.state.dataSource}
					renderRow={this.renderRow.bind(this)}
					style={styles.listView}
				  />
            	</View>);
        }else{
        	return(<View></View>);
        }
	}
}
var styles = StyleSheet.create({
  listView: {
    paddingTop: 5,
    backgroundColor: '#343434',
  },
   floatingButton: {
      width: 56,
      height: 56, 
  },
});