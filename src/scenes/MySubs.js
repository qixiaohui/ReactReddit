import React, {Component, StyleSheet, View, Image, ProgressBarAndroid, TouchableHighlight, Text, ScrollView} from 'react-native'
import { Avatar } from 'react-native-material-design'
import _ from 'underscore'
import ajax from '../http/ajax'
import toast from '../modules/Toast'
import Line from '../components/Line'

export default class MySubs extends Component{
    static contextTypes = {
        navigator: React.PropTypes.object.isRequired,
    };

    constructor(props){
    	super(props);
    	this.state = {
			data: null,
			loading: true,
    	};
    	this.fetchSubs();
    }

    fetchSubs = () => {
		let promise = new Promise((resolve, reject) => {ajax.fetchMySub(
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
    	const { navigator } = this.context;
		if(!this.state.loading){
			return (
				<ScrollView style={{flex: 1, paddingTop: 10}}>
					{(() => {if(this.state.data.length > 0){
						return(
						_.map(this.state.data, function(sub) {
						return (
			            <View style={styles.rowContainer} key={sub.data.id}>
			                <TouchableHighlight onPress = {() => {navigator.forward('subReddit', sub.data.title, {name: sub.data.display_name});}}>
			                    <View style={styles.subRow}>
			                    	<View style={{flex: 1}}>
			                    		<Avatar image={<Image source={{uri: sub.data.header_img}} />} />
			                    	</View>
			                    	<View style={{flex: 3, flexDirection: 'column'}}>
			                    		<View style={{flex: 2}}>
											<Text style={styles.text}>{sub.data.display_name}</Text>
			                    		</View>
			                    		<View style={{flex: 3}}>
											<Text style={styles.textSub}>{sub.data.public_description}</Text>
			                    		</View>
			                    	</View>
			                    </View>
			                </TouchableHighlight>
			                <Line></Line>
			            </View>
				    	);
					}));} else{
							return(
								<View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
									<Text>You haven't subscribed any subreddit :-(</Text>
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
	    fontSize: 18,
	},
	textSub: {
		marginLeft: 20,
		textAlign: 'left',
		color: '#a8c7f2',
		fontSize: 12,
	}
});