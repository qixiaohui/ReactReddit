import React, {Component, StyleSheet, View, Text, WebView} from 'react-native'
import url from "../http/url"

export default class Login extends Component{
    static contextTypes = {
        navigator: React.PropTypes.object.isRequired,
    };

    constructor(props){
        super(props);
        this.state = {
        	url: url.oauthBase
        };
    }
    
    render()  {
        return(
        	<View style={{flex: 1}}>
        		<WebView 
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
        flexDirection: 'column',
		alignItems: 'center',
		flex: 1,
		marginTop: 50,
		marginLeft: 50,
		marginRight: 50,
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 19,
        flex: 1,
    },
});