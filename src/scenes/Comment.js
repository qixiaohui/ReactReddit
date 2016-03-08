import React, {Component, ScrollView, StyleSheet, Image, ProgressBarAndroid, View, Text} from 'react-native';
import url from '../http/url'
export default class Comment extends Component{
	constructor(props) {
		super(props);
		this.state = {
			sub: props.sub,
			id: props.id,
			comments: null
		};
		
		this.fetchComments();
	}
	
	fetchComments = () => {
		fetch(url.baseSubreddit+this.state.sub+"/"+this.state.id+".json")
		  .then((response) => response.json())
		  .then((responseData) => {
				this.setState({
					comments: responseData
				});
		  })
		  .done();
	};
	
	render() {
		if(this.state.comments){
			return(
				<ScrollView>
					<View style={styles.headerContainer}>
						<View style={{flex: 1}}>
							<Image style = {styles.thumbnail} source={{uri:this.state.comments[0].data.children[0].data.thumbnail}} />
						</View>
						<View style={{flex: 3}}>
							<Text>{this.state.comments[0].data.children[0].data.title}</Text>
						</View>
					</View>
				</ScrollView>
			);
		}else{
			return (
				<View style={styles.loadingContainer}>
					<ProgressBarAndroid style={styles.spinner} />
				</View>
			);	
		}
	}
}

var styles = StyleSheet.create({
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
    },
	loadingContainer: {
	  flex: 1,
	  justifyContent: 'center',
	  alignItems: 'center',
	},
	spinner: {
		width: 60,
		height: 60,
	},
	thumbnail: {
		width: 50,
		height: 40,
	}
});