import React, {Component, StyleSheet, View, ProgressBarAndroid, TouchableHighlight, Text, ScrollView} from 'react-native'
import { Icon } from 'react-native-material-design'
import _ from 'underscore'
import ajax from '../http/ajax'
import Line from '../components/Line'
import toast from '../modules/Toast'
export default class Friends extends Component{
	constructor(props){
		super(props);
		this.state = {
			token: props.token,
			tokenTimeStamp: props.timeStamp,
			data: null,
			loading: true,
		};
		this.fetchFriends();
	}

    componentDidMount() {
        this.setState({
            data: []
        });
    }

	fetchFriends = () => {
		let promise = new Promise((resolve, reject) => {ajax.getFriends(
		 resolve,
		 reject)});

		//** can't use listview because of weird resolve issue
		Promise.all([promise]).then(function(value){

			let val = JSON.parse(value);
			this.setState({
				data: val,
			});
			setTimeout(() => {
				this.setState({
					loading: false
				});
			}, 100);
		}.bind(this)).catch(function(e){
			toast.showToast(JSON.stringify(e), 3000);
		});
	};

	render() {
		if(!this.state.loading){
			return (
				<ScrollView style={{flex: 1, paddingTop: 10}}>
					{(() => {if(this.state.data.length > 0){
						return(
						_.map(this.state.data, function(friend) {
						return (
			            <View style={styles.rowContainer} key={friend.id}>
			                <TouchableHighlight onPress = {() => {}}>
			                    <View style={styles.subRow}>
			                        <Text style={styles.text}>{friend.name}</Text>
			                    </View>
			                </TouchableHighlight>
			                <Line></Line>
			            </View>
				    	);
					}));} else{
							return(
								<View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
									<Text>You don't have any friend right now :-(</Text>
								</View>
							);
						}
					})()}
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
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	spinner: {
		width: 60,
		height: 60,
	},  
	rowContainer: {
	    paddingLeft: 10,
	    paddingRight: 10,
	},
	subRow: {
	    flex: 1,
	    flexDirection: 'row',
	},
	text: {
	    marginLeft: 20,
	    textAlign: 'left',
	    fontWeight: 'bold',
	    color: 'grey',
	    fontSize: 19,
	    flex: 4,
	},
});