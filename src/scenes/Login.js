import React, {Component, StyleSheet, ScrollView, View, Text, TextInput} from 'react-native'
import {Checkbox, Button, COLOR, TYPO } from 'react-native-material-design';


export default class Login extends Component{
    render()  {
        return(
			<ScrollView>
				<View style={styles.container}>
					<View style={styles.rowContainer}>
						<Text style = {[styles.text, COLOR.paperBlueGrey]}>Username:</Text>
						<View style={styles.textInput}>
							<TextInput  />
						</View>
					</View>
					<View style={styles.rowContainer}> 
						<Text style = {[styles.text, COLOR.paperBlueGrey]}>Password:</Text>
						<View style={styles.textInput}>
							<TextInput  />
						</View>
					</View>
				</View>
				<View style={{marginLeft: 30}}>
					<Checkbox onCheck={()=>{}} primary={'googleGreen'} value="true" label="show password" />
				</View>
				<View style={{marginLeft: 40, marginRight: 40}}>
					<Button text="Login" primary={'googleGreen'} theme="dark" raised={true}/>
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