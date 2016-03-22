import React, {Component, View, StyleSheet, ScrollView} from 'react-native'
import {Button} from 'react-native-material-design'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TextField from 'react-native-md-textinput'
import tinycolor from 'tinycolor2'

export default class Submit extends Component{
	constructor(props){
		super(props);
		this.state = {
			primary: props.primary,
			theme: props.theme,
			inverse: tinycolor(props.theme).complement().toHexString(),
			title: null,
			text: null,
			url: null,
			sr: null
		};
	}

	render(){
		return(<View style={{flex: 1}}>
				<ScrollableTabView tabBarBackgroundColor={this.state.theme} tabBarUnderlineColor={this.state.inverse} tabBarActiveTextColor={this.state.inverse} tabBarInactiveTextColor={"#ffffff"}>
					<ScrollView tabLabel="post">
		        		<TextField dense={true} label={'title'} onChangeText={(text) => this.setState({title: text})} highlightColor={this.state.theme} />	
		        		<TextField dense={true} label={'text'} multiline={true} onChangeText={(text) => this.setState({text: text})} highlightColor={this.state.theme} />		
			        	<TextField dense={true} label={'subreddit'} onChangeText={(text) => this.setState({sr: text})} highlightColor={this.state.theme} />		
     		        	<Button text={"Submit"} primary={this.state.primary} theme="dark" raised={true} />
		        		<Button text={"Cancel"} primary={'paperPink'} onPress={()=>{}} theme="dark" raised={true} />	
					</ScrollView>
					<ScrollView tabLabel="url">
		        		<TextField dense={true} label={'title'} onChangeText={(text) => this.setState({title: text})} highlightColor={this.state.theme} />	
						<TextField dense={true} label={'url'} onChangeText={(text) => this.setState({url: text})} highlightColor={this.state.theme} />	
			        	<TextField dense={true} label={'subreddit'} onChangeText={(text) => this.setState({sr: text})} highlightColor={this.state.theme} />		
     		        	<Button text={"Submit"} primary={this.state.primary} theme="dark" raised={true} />
		        		<Button text={"Cancel"} primary={'paperPink'} onPress={()=>{}} theme="dark" raised={true} />	
					</ScrollView>
				</ScrollableTabView>
			</View>);
	}
}
