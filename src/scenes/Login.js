import React, {Component, StyleSheet, ScrollView, View, Text, TextInput} from 'react-native'
import {Checkbox, Button, COLOR, TYPO } from 'react-native-material-design';
import toast from '../modules/Toast'
import url from '../http/url'
import storage from '../storage/storage'
import TextField from 'react-native-md-textinput'

export default class Login extends Component{
    static contextTypes = {
        navigator: React.PropTypes.object.isRequired,
    };

    constructor(props){
        super(props);
        this.state = {
            userName: null,
            passWord: null,
            mask: true,
        };
    }
    
    onLogin = () => {
		const { navigator } = this.context;
        this.fetchLogin()
			.then((response) => {
				if(response.status === 200){
					return response.json()
				}else{
					return null; 
		  		}
			})
			.then((responseData) => {
				if(!responseData){
					toast.showToast("login failed", 3000);
				}else{
					storage.setStorage("COOKIE", responseData.json.data);
					toast.showToast("login success", 3000);
					navigator.to("mainpage");
				}
			})
			.done();
    };
    
    fetchLogin = () => {
        var obj = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
				'Accept': "application/json",
            }
        }; 
		
		// ** normal json stringify body doesnt work 
		obj.body = "user="+this.state.userName+
			"&passwd="+this.state.passWord+
			"&api_type=json";
		
        return fetch(url.login, obj);
    };
    
    render()  {
        return(
			<ScrollView>
				<TextField dense={true} label={'UserName'} highlightColor={this.state.theme} onChangeText={(text) => this.setState({userName: text})} />
				<TextField dense={true} label={'Password'} secureTextEntry={this.state.mask} highlightColor={this.state.theme} onChangeText={(text) => this.setState({passWord: text})} />
				<View style={{marginLeft: 30}}>
					<Checkbox checked={(!this.state.mask)} onCheck={()=>{this.setState({mask: !this.state.mask})}} primary={'googleGreen'} label="show password" />
				</View>
				<View>
					<Button text="Login" primary={'googleGreen'} onPress={this.onLogin} theme="dark" raised={true}/>
				</View>
		   </ScrollView>
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