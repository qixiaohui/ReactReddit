import React, {Component, View, StyleSheet, ScrollView} from 'react-native'
import {Button} from 'react-native-material-design'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TextField from 'react-native-md-textinput'
import tinycolor from 'tinycolor2'
import toast from '../modules/Toast'
import url from '../http/url'

export default class Submit extends Component{
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
			sr: null
		};
		this.checkCaptcha();
	}

	checkCaptcha = () => {
		
	};

	submit = (kind) => {

		let post = function(post){
			if(kind === 'post'){
				let obj = {
					method: 'POST',
					headers: {
						Authorization: "bearer "+this.state.token,
					}
				};
			}else if(kind === 'url'){
				let obj = {
					method: 'POST',
					headers: {
						Authorization: "bearer "+this.state.token,
					}
				}
			}
		};
	};

	componentDidMount() {
        let obj = {
            method: 'GET',
            headers: {
				'Authorization': "bearer "+this.state.token,
            }
        }; 

		fetch(url.captcha, obj)
		.then((response) => response.json())
		.then((responseData) => {
			if(responseData){
				fetchCaptcha();
			}
		}).done();

		let fetchCaptcha = function(){

		}
	}

	render(){
		return(<View style={{flex: 1}}>
				<ScrollableTabView tabBarBackgroundColor={this.state.theme} tabBarUnderlineColor={this.state.inverse} tabBarActiveTextColor={this.state.inverse} tabBarInactiveTextColor={"#ffffff"}>
					<ScrollView tabLabel="post">
		        		<TextField dense={true} label={'title'} onChangeText={(text) => this.setState({title: text})} highlightColor={this.state.theme} />	
		        		<TextField dense={true} label={'text'} multiline={true} onChangeText={(text) => this.setState({text: text})} highlightColor={this.state.theme} />		
			        	<TextField dense={true} label={'subreddit'} onChangeText={(text) => this.setState({sr: text})} highlightColor={this.state.theme} />		
			        	{(() => {
			        		if(this.state.captcha){
			        			<View style={{flex: 1, flexDirection: 'row'}}>
			        				<img style={{width: 100, flex: 1}} source={this.state.captcha} />
			        				<TextField dense={true} label={'captcha'} onChangeText={(text) => this.setState({captchText: text})} highlightColor={this.state.theme} />	
			        			</View>
			        		}
		        		})()
			        	}
     		        	<Button text={"Submit"} onPress={()=>{this.submit('post')}} primary={this.state.primary} theme="dark" raised={true} />
		        		<Button text={"Cancel"} primary={'paperPink'} onPress={()=>{}} theme="dark" raised={true} />	
					</ScrollView>
					<ScrollView tabLabel="url">
		        		<TextField dense={true} label={'title'} onChangeText={(text) => this.setState({title: text})} highlightColor={this.state.theme} />	
						<TextField dense={true} label={'url'} onChangeText={(text) => this.setState({url: text})} highlightColor={this.state.theme} />	
			        	<TextField dense={true} label={'subreddit'} onChangeText={(text) => this.setState({sr: text})} highlightColor={this.state.theme} />	
  			        	{(() => {
			        		if(this.state.captcha){
			        			<View style={{flex: 1, flexDirection: 'row'}}>
			        				<img style={{width: 100, flex: 1}} source={this.state.captcha} />
			        				<TextField dense={true} label={'captcha'} onChangeText={(text) => this.setState({captchText: text})} highlightColor={this.state.theme} />	
			        			</View>
			        		}
		        		})()
			        	}	
     		        	<Button text={"Submit"} onPress={()=>{this.submit('url')}} primary={this.state.primary} theme="dark" raised={true} />
		        		<Button text={"Cancel"} primary={'paperPink'} onPress={()=>{}}  theme="dark" raised={true} />	
					</ScrollView>
				</ScrollableTabView>
			</View>);
	}
}
