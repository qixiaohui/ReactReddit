import React, {Component, StyleSheet, View} from 'react-native'
import OauthWebView from '../components/OauthWebView'
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
        		<OauthWebView 
        			source={this.state.url}
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