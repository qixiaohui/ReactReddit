import React, { Component, TouchableHighlight, View, Text, ScrollView } from 'react-native';
import { Subheader, COLOR, PRIMARY_COLORS } from 'react-native-material-design';


export default class Themes extends Component {

    render() {
        return (
			<ScrollView>
            <View>
                <Subheader text="Select a theme"/>
                <View style={styles.container}>
                    {PRIMARY_COLORS.map((color) => {
                        return (
                            <TouchableHighlight key={color} onPress={() => { this.changeTheme(color) }}>
                                <View  style={[styles.item, { backgroundColor: COLOR[`${color}500`].color }]}>
                                    <Text style={styles.text}>{color}</Text>
                                </View>
                            </TouchableHighlight>
                        );
                    })}
                </View>
            </View>
			</ScrollView>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    item: {
        width: 120,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#ffffff'
    }
};