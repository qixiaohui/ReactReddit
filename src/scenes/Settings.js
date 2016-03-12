import React,{Component, StyleSheet, View, Text, ProgressBarAndroid, ListView, TouchableNativeFeedback} from 'react-native';
import { Subheader, Icon, COLOR, Divider } from 'react-native-material-design';
import Line from '../components/Line'
import storage from '../storage/storage'
import _ from 'underscore'
import Events from 'react-native-simple-events';

export default class Settings extends Component {
    static contextTypes = {
        navigator: React.PropTypes.object.isRequired,
    };
	
	constructor(props){
		super(props);
		this.state = {
			configObj: null,
			theme: 'googleGreen'
		};
		this.checkLogin();
		this.checkTheme();
	}

    checkTheme = () => {
        storage.queryStorage("THEME").then(
        	(value) => {
        		if(value){
        			this.setState({
        				theme: value
        			});
        		}
        	}
    	).done();
    };

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
		const { navigator } = this.context;
		if(this.state.configObj){
			return(
				<View>
					<View>
						<Subheader text="Acount Setting" color="googleGreen"  />
					</View>
					{_.map(this.state.configObj.accountSetting, function(setting) {
						return(
							<TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={()=>{navigator.forward(setting.path, null, null)}}>
							<View>
								<View style={styles.row}>
									<View style={styles.icon}>
										<Icon color={this.state.theme} name={setting.icon} />
									</View>
									<View style={styles.options}>
										<Text style={styles.optionText}>{setting.path}</Text>
									</View>
								</View>
								<Divider inset />
							</View>
							</TouchableNativeFeedback>
						);
					}.bind(this))}
					<View>
						<Subheader text="Preference" color="googleGreen"  />
					</View>
					{_.map(this.state.configObj.preference, function(setting) {
						return(
							<TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={()=>{navigator.forward(setting.path, null, null)}}>
							<View>
								<View style={styles.row}>
									<View style={styles.icon}>
										<Icon color={this.state.theme} name={setting.icon} />
									</View>
									<View style={styles.options}>
										<Text style={styles.optionText}>{setting.path}</Text>
									</View>
								</View>
								<Divider inset />
							</View>
							</TouchableNativeFeedback>
						);
					}.bind(this))}
				</View>          	
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
	row: {
		flex: 1,
		flexDirection: 'row'
	},
	icon: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 15,
	},
	options: {
		flex: 4,
		alignItems: 'flex-start',
		justifyContent: 'center'
	},
	optionText: {
		color: '#000000',
		fontSize: 16,
		marginBottom: 20,
		marginTop: 20,
	}
});