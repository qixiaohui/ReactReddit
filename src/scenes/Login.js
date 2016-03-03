import React, {Component, StyleSheet, View, Text, TextInput} from 'react-native'
import { COLOR, TYPO } from 'react-native-material-design';


export default class Login extends Component{
    render()  {
        return(
            <View style = {styles.container}>
                <View style = {styles.subContainer}>
                   <View style = {styles.rowContainer}>
                        <Text style = {[styles.text, COLOR.paperBlueGrey]}>Username:</Text>
                        <TextInput style={styles.textInput}></TextInput>
                    </View>
                    <View style = {styles.rowContainer}>
                        <Text style = {[styles.text, COLOR.paperBlueGrey]}>Password:</Text>
                        <TextInput style = {styles.textInput}></TextInput>
                    </View>
                </View>
           </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subContainer: {
        flex: 1,
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 19,
        flex: 1,
    },
    textInput: {
        flex: 2,
    }
});