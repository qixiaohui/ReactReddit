import React, {Component, View, StyleSheet, ScrollView, Image, Text} from 'react-native'
import {Button} from 'react-native-material-design'
import Spinner from 'react-native-loading-spinner-overlay'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TextField from 'react-native-md-textinput'
import tinycolor from 'tinycolor2'
import toast from '../modules/Toast'
import url from '../http/url'
import ajax from '../http/ajax'

export default class Submit extends Component{
    static contextTypes = {
        navigator: React.PropTypes.object.isRequired,
    };

	constructor(props){
		super(props);
		this.state = {
			primary: props.primary,
			theme: props.theme,
			token: props.token,
			captcha: null,
			captchaText: null,
			inverse: tinycolor(props.theme).complement().toHexString(),
			title: null,
			text: null,
			url: null,
			sr: null,
			captcha: null,
			captchaUrl: null,
			visible: false,
			error: null,
		};
		this.checkCaptcha();
	}

	checkCaptcha = () => {
		let promise = new Promise((resolve, reject) => {
			ajax.checkCaptcha(resolve, reject);
		});
		promise.then((val) => {
			if(val === 'true'){
				this.getNewCaptcha();
			}
		}).catch(function(e){
			toast.showToast(JSON.stringify(e), 3000);
		});
	};

	getNewCaptcha = () => {
		let promise = new Promise((resolve, reject) => {
			ajax.newCaptcha(resolve, reject);
		});
		promise.then((val) => {
			setTimeout(() => {
				this.setState({
					captcha: val,
					captchaUrl: 'http://www.reddit.com/captcha/'+val+'.png',
				});
			}, 50);
		}).catch(function(e){
			toast.showToast(JSON.stringify(e), 3000);
		});
	};

	submit = (kind) => {
		const { navigator } = this.context;
		this.setState({
			visible: true,
		});
		let obj = null;
		if(kind === 'url'){
			if(this.state.title && this.state.url && this.state.sr && ((!this.state.captcha) || this.state.captchaText)){
				obj = {
					title: this.state.title,
					url: this.state.url,
					sr: this.state.sr,
					iden: this.state.captcha,
					captchaText: this.state.captchaText
				};
			}
		}else if(kind === 'text'){
			if(this.state.title && this.state.text && this.state.sr && ((!this.state.captcha) || this.state.captchaText)){
				obj = {
					title: this.state.title,
					text: this.state.text,
					sr: this.state.sr,
					iden: this.state.captcha,
					captchaText: this.state.captchaText
				};
			}
		}
		let promise = new Promise((resolve, reject) => {
			ajax.submitPost(resolve, reject, kind, obj);
		});

		promise.then((val) => {
			this.setState({
				visible: false,
			});
			navigator.to('mainpage.content', null, {url: val});
		}).catch((e) => {
			if(e.captcha){
				this.setState({
					captcha: e.captcha,
					captchaUrl: 'http://www.reddit.com/captcha/'+e.captcha+'.png',					
				});
				this.clearText();
			}else{
				toast.showToast(JSON.stringify(e), 3000);
			}
			this.setState({
				visible: false,
				error: "care to try again?",
			});
			this.clearText();
		});

	};

	clearText = () => {
		if(this.state.captcha){
			this.refs.captchatext.refs.input.clear();
			this.refs.captchaurl.refs.input.clear();
		}
	};

	render(){
		return(<View style={{flex: 1}}>
				<ScrollableTabView tabBarBackgroundColor={this.state.theme} tabBarUnderlineColor={this.state.inverse} tabBarActiveTextColor={this.state.inverse} tabBarInactiveTextColor={"#ffffff"}>
					<ScrollView tabLabel="post">
		        		<TextField ref={"titletext"} dense={true} label={'title'} onChangeText={(text) => this.setState({title: text})} highlightColor={this.state.theme} />	
		        		<TextField ref={"texttext"} dense={true} label={'text'} multiline={true} onChangeText={(text) => this.setState({text: text})} highlightColor={this.state.theme} />		
			        	<TextField ref={"srtext"} dense={true} label={'subreddit'} onChangeText={(text) => this.setState({sr: text})} highlightColor={this.state.theme} />		
			        	{(() => {
			        		if(this.state.captchaUrl){
			        			return(
				        			<View style={{flex: 1, flexDirection: 'column'}}>
				        				<View style={{flex: 1, flexDirection: 'row'}}>
				        					<Image style={{height: 50, width: 120}} source={{uri:this.state.captchaUrl}} />
				        					<Text style={{color: '#e65953', marginLeft: 10}}>{this.state.error}</Text>
				        				</View>
				        				<TextField ref={"captchatext"} dense={true} label={'captcha'} onChangeText={(text) => this.setState({captchaText: text})} highlightColor={this.state.theme} />	
				        			</View>
			        			);
			        		}
		        		})()
			        	}
     		        	<Button text={"Submit"} onPress={()=>{this.submit('text')}} primary={this.state.primary} theme="dark" raised={true} />
		        		<Button text={"Cancel"} primary={'paperPink'} onPress={()=>{}} theme="dark" raised={true} />	
					</ScrollView>
					<ScrollView tabLabel="url">
		        		<TextField ref={"titleurl"} dense={true} label={'title'} onChangeText={(text) => this.setState({title: text})} highlightColor={this.state.theme} />	
						<TextField ref={"texturl"} dense={true} label={'url'} onChangeText={(text) => this.setState({url: text})} highlightColor={this.state.theme} />	
			        	<TextField ref={"srurl"} dense={true} label={'subreddit'} onChangeText={(text) => this.setState({sr: text})} highlightColor={this.state.theme} />	
  			        	{(() => {
			        		if(this.state.captchaUrl){
			        			return(
				        			<View style={{flex: 1, flexDirection: 'column'}}>
				        				<View style={{flex: 1, flexDirection: 'row'}}>
				        					<Image style={{height: 50, width: 120}} source={{uri:this.state.captchaUrl}} />
				        					<Text style={{color: '#e65953', marginLeft:10}}>{this.state.error}</Text>
				        				</View>
				        				<TextField ref={"captchaurl"} dense={true} label={'captcha'} onChangeText={(text) => this.setState({captchaText: text})} highlightColor={this.state.theme} />	
				        			</View>
			        			);
			        		}
		        		})()
			        	}	
     		        	<Button text={"Submit"} onPress={()=>{this.submit('url')}} primary={this.state.primary} theme="dark" raised={true} />
		        		<Button text={"Cancel"} primary={'paperPink'} onPress={()=>{}}  theme="dark" raised={true} />	
					</ScrollView>
				</ScrollableTabView>
				<Spinner visible={this.state.visible} />
			</View>);
	}
}
