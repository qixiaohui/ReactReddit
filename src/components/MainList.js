import React, { Component, ListView, PropTypes, View, Text, Image } from 'react-native';

export default class MainList extends Component {
	getInitialState() {
	  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
	  return {
	    dataSource: ds.cloneWithRows(['row 1', 'row 2']),
	  };
	}
	
	render() {
		return(
		    <ListView
		      dataSource={this.state.dataSource}
		      renderRow={(rowData) => <Text>{rowData}</Text>}
		    />
		);
	}
}