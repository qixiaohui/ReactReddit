import React, {Component, StyleSheet, View, DeviceEventEmitter} from 'react-native'
import Dimensions from 'Dimensions'
import moment from 'moment'
import storage from '../storage/storage'
import OauthWebView from '../components/OauthWebView'
import url from "../http/url"
import ajax from '../http/ajax'

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
        	if(e.indexOf("access_token=") > -1){
                var token = {timeStamp: moment().add(60, 'minutes'), token:e.substring(e.indexOf("=")+1, e.indexOf("&"))};
        		storage.setStorage("ACCESS_TOKEN", token);
                ajax.getAccountInfo(token.token);
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