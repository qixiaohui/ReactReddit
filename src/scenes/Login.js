import React, {Component, StyleSheet, View, DeviceEventEmitter} from 'react-native'
import Dimensions from 'Dimensions'
import Spinner from 'react-native-loading-spinner-overlay'
import moment from 'moment'
import storage from '../storage/storage'
import OauthWebView from '../components/OauthWebView'
import url from "../http/url"
import ajax from '../http/ajax'

export default class Login extends Component{
    static contextTypes = {
        navigator: React.PropTypes.object.isRequired,
    };

    constructor(props){
        super(props);
        this.state = {
        	url: url.oauthBase,
            visible: true,
            width: Dimensions.get('window').width,
        };
    }

    componentWillMount() {
        const { navigator } = this.context;
        DeviceEventEmitter.addListener('OverrideUrl', function(e: Event){
        	if(e.indexOf("code=") > -1){
                var code = e.slice(e.indexOf("code=")+5);
                let promise = new Promise((resolve) => {
                    ajax.getAuthorizationToken(resolve, code);
                });
                promise.then(function(val){
                    let value = JSON.parse(val);
                    let token={timeStamp: moment().add(60, 'minutes'),
                    token: value.access_token,
                    refreshToken: value.refresh_token};
                    storage.setStorage("ACCESS_TOKEN", token);
                    ajax.getAccountInfo(token.token);
                    navigator.to('settings');

                }.bind(this));
        	}else if(e.indexOf("error=") > -1){
                navigator.to('settings');
            }
        }.bind(this));

        DeviceEventEmitter.addListener('LoadingFinish', function(e: Event){
            this.setState({
                visible: false,
            });
        }.bind(this));
    }
    
    render()  {
        return(
        	<View style={{flex: 1}}>
        		<OauthWebView 
        			source={this.state.url}
        			style={{width: this.state.width, height: 400}}
				/>
                <Spinner visible={this.state.visible} />
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