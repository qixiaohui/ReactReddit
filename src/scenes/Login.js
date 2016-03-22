import React, {Component, StyleSheet, View, DeviceEventEmitter} from 'react-native'
import Dimensions from 'Dimensions'
import storage from '../storage/storage'
import OauthWebView from '../components/OauthWebView'
import url from "../http/url"

export default class Login extends Component{
    static contextTypes = {
        navigator: React.PropTypes.object.isRequired,
        width: Dimensions.get('window').width,
    };

    constructor(props){
        super(props);
        this.state = {
        	url: url.oauthBase
        };
    }

    componentWillMount() {
        const { navigator } = this.context;
        DeviceEventEmitter.addListener('OverrideUrl', function(e: Event){
        	if(e.indexOf("code=") > -1){
        		storage.setStorage("ACCESS_TOKEN", e.slice(e.lastIndexOf("code=")+1));
        		navigator.to('settings');
        	}
        }.bind(this));
    }
    
    render()  {
        return(
        	<View style={{flex: 1}}>
        		<OauthWebView 
        			source={this.state.url}
        			style={{width: this.state.width, height: 400}}
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