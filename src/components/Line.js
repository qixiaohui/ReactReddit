'use strict';

var React = require('react-native');

var {
  StyleSheet,
  View,
} = React;

var Line = React.createClass ({
    render(){
        return(
            <View style={styles.line}></View>
        );
    }
});

var styles = StyleSheet.create({
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#BEBEBE',
        marginLeft: 10,
        marginRight: 10,
        marginTop:5,
        marginBottom: 5,
    }
});

module.exports = Line;