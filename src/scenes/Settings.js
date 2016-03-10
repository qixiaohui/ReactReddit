import React,{Component, StyleSheet, View, Text, ProgressBarAndroid} from 'react-native';
import { Subheader, Divider, Checkbox, Icon, COLOR, List } from 'react-native-material-design';
import Line from '../components/Line'
import storage from '../storage/storage'

export default class Settings extends Component {
	constructor(props){
		super(props);
		this.state = {
			configObj: null
		};
		this.checkLogin();
	}

	checkLogin = () => {
		storage.queryStorage('COOKIE').then(
			(value) => {
				if(value){
					this.setState({
						configObj: {
							accountSetting: [
								{path: 'logout', icon: 'lock-open'},
								{path: 'friends', icon: 'people'},
								{path: 'block', icon: 'delete'},
								{path: 'password', icon: 'lock'}
							],
							preference: [
								{path: 'theme', icon: 'adb'}
							]
						}
					});
				}else{
					this.setState({
						configObj: {
							accountSetting: [
								{path: 'login', icon: 'account-circle'},
							],
							preference: [
								{path: 'theme',icon: 'adb'}
							]
						}
					});
				}
		}).done();
	};

	render(){
		if(this.state.configObj){
			return(
	            	// <Subheader text="Account Setting" primaryColor={COLOR.googleGreen}/>
	            	<View>
	            	<List  primaryText = "login" />
	            	</View>
	            	// {this.state.configObj.accountSetting.map((list) => {
	            	// 	return(<List
	            	// 	leftIcon = {
	            	// 		<Icon name = {list.icon} size = {24} />
	            	// 	}
	            	// 	 primaryText = {list.path} />);
	            	// })}            	
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
	}
});