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
    }
    
    setWebView = (webView) => {
      this.setState({
          webView
      });  
    };
	
	loadFinish = () => {
		this.setState({loadFinish: true});
		console.log("set state");
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
				onLoad = {this.loadFinish}
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
	loadingContainer: {
	  flex: 1,
	  justifyContent: 'center',
	  alignItems: 'center',
	},
	spinner: {
	  width: 60,
	  height: 60,
	},
});