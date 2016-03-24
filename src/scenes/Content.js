import React, { Component, StyleSheet, WebView, TouchableHighlight, PropTypes, View, ProgressBarAndroid, Text, Image } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay'

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
            visible: true,
        };
    }
    
    setWebView = (webView) => {
      this.setState({
          webView
      });  
    };

    onNavigationStateChange = (event) => {
        if(event.loading) {
          this.setState({
            visible: true,
          });
        } else {
          this.setState({
            visible: false,
          });
        }
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
                onNavigationStateChange={this.onNavigationStateChange}
				startInLoadingState={true}

				/>
                <Spinner visible={this.state.visible} />
			</View>
		);
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});