import React, { Component, StyleSheet, WebView, TouchableHighlight, PropTypes, View, ProgressBarAndroid, Text, Image } from 'react-native';

export default class Content extends Component{
    constructor(props){
        super(props);
        this.state = {
            url: props.url,
            status: 'No Page loaded',
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            loading: true,
            scalesPageToFit: true,
            webView: null,
        };
		console.log(this.state.url);
    }
    
    setWebView = (webView) => {
      this.setState({
          webView
      });  
    };
    
    render(){
		return(
			<View style={styles.container}>
				<WebView  ref={(webView)=>{!this.state.webView?this.setWebView(webView):null}}
				automaticallyAdjustContentInsets = {false}   
				source={{uri: this.state.url}}
				javaScriptEnabled = {true}
				domStorageEnabled = {true}
				decekerationRate = "normal"
				startInLoadingState={true}
				/>
			</View>
		);
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
});