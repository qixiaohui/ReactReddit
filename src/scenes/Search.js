import React, {Component, View, StyleSheet, Text, TextInput, Image, ListView} from 'react-native';

export default class Search extends Component{
    constructor(props){
        super(props);
		this.state = {
			subs: null,
		};
    }
    
    render(){
		if(this.state.subs){
			return(
					<View style={styles.container}>
						<View style={styles.row}>
							<View style = {{flex: 3}}>
								<TextInput style={styles.textInput} />
							</View>
							<View style = {{flex: 1}}>
								<Image style={styles.image} source={require('../img/search.png')} />
							</View>
						</View>
						  <ListView
							dataSource={this.state.dataSource}
							renderRow={this.renderSub}
							onEndReached={this.fetchMore}
						  />
					</View>
			);
		}else{
			return(
				<View style={styles.container}>
					<View style={styles.row}>
						<View style = {{flex: 3}}>
							<TextInput style={styles.textInput} />
						</View>
						<View style = {{flex: 1}}>
							<Image style={styles.image} source={require('../img/search.png')} />
						</View>
					</View>
				</View>
			);
		}
    }
    
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		marginTop: 15,
		marginLeft: 40,
		marginRight: 40,
	},
	row: {
		borderBottomWidth: 3,
		borderRightWidth: 3,
		borderLeftWidth: 1,
		borderTopWidth: 1,
		backgroundColor: '#fdfdfd',
		borderColor: "#eeeeee",
		flexDirection: 'row',
	},
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 19,
        flex: 1,
    },
	image: {
		marginLeft: 10,
		marginTop: 10,
		height: 40,
		width:40,
	},
	textInput: {
		height: 50,
		borderColor: 'grey',
		borderWidth: 1,
		marginLeft: 15,
	},
});