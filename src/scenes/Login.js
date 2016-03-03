import React, {Component, StyleSheet, ScrollView, View, Text, TextInput} from 'react-native'
import {Checkbox, Button, COLOR, TYPO } from 'react-native-material-design';
import toast from '../modules/Toast'
import url from '../http/url'

export default class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            userName: null,
            passWord: null,
        };
    }
    
    onLogin = () => {
        this.fetchLogin().then(
            function(data){
                toast.showToast(JSON.stringify(data), 3000);
            }
        ).then(
            function(e){
                toast.showToast(e, 3000);
            }
        );
    };
    
    fetchLogin = () => {
        var obj = {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                user: this.state.userName,
                passwd: this.state.passWord,
                api_type: 'json',
            })
        }; 
        return fetch(url.login, obj);
    };
    
    render()  {
        return(
			<ScrollView>
				<View style={styles.container}>
					<View style={styles.rowContainer}>
						<Text style = {[styles.text, COLOR.paperBlueGrey]}>Username:</Text>
						<View style={styles.textInput}>
							<TextInput onEndEditing = {(text) => {this.setState({userName: text})}} />
						</View>
					</View>
					<View style={styles.rowContainer}> 
						<Text style = {[styles.text, COLOR.paperBlueGrey]}>Password:</Text>
						<View style={styles.textInput}>
							<TextInput onEndEditing = {(text) => {this.setState({passWord: text})}} />
						</View>
					</View>
				</View>
				<View style={{marginLeft: 30}}>
					<Checkbox onCheck={()=>{}} primary={'googleGreen'} value="true" label="show password" />
				</View>
				<View style={{marginLeft: 40, marginRight: 40}}>
					<Button text="Login" primary={'googleGreen'} onPress={this.fetchLogin} theme="dark" raised={true}/>
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
    rowContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 19,
        flex: 1,
    },
    textInput: {
        flex: 2,
		borderColor: 'grey',
    }
});