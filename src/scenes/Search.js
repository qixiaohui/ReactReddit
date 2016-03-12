import React, {Component, View, StyleSheet, TouchableHighlight, Text, TextInput, Image, ListView, ScrollView} from 'react-native';
import { Icon, List } from 'react-native-material-design';
import Line from '../components/Line'
import url from '../http/url';

export default class Search extends Component{
    constructor(props){
        super(props);
		this.state = {
            dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,        
            }),
		};
    }
    
    static contextTypes = {
        navigator: React.PropTypes.object.isRequired,
    };
    
    componentDidMount() {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows([]),
        });
    }
    
    fetchPosts = (input) => {
		fetch(url.search+input)
		  .then((response) => response.json())
		  .then((responseData) => {
            
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseData),
			});
		  })
		  .done();
    };
    
    renderRow = (row) => {
        if(!row){
            row = {name: ''}
        }
        return (
            <View style={styles.rowContainer}>
                <Line></Line>
                <TouchableHighlight onPress = {() => {this.loadSub(row)}}>
                    <View style={styles.subRow}>
                        <Text style={styles.text}>{row.name}</Text>
                        <Icon style={styles.icon} name="add-circle" />
                    </View>
                </TouchableHighlight>
            </View>
        );
    };

    loadSub = (row) => {
        const {navigator} = this.context;
        navigator.to('mainpage.subReddit', row.name, {name: row.name});
    };
    
    render(){
        return(
            <View style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.row}>
                        <View style = {{flex: 3}}>
                            <TextInput onChangeText={(text) => {this.fetchPosts(text);}} style={styles.textInput} />
                        </View>
                        <View style = {{flex: 1}}>
                            <Icon name="search" style = {styles.image} />
                        </View>
                    </View>
                </View>
                <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                onEndReached={this.fetchMore}
                />
            </View>                                                    
        );
    }
    
}

var styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		marginTop: 15,
		marginLeft: 40,
		marginRight: 40,
	},
	row: {
		borderBottomWidth: 3,
		borderRightWidth: 3,
		borderLeftWidth: 1,
		borderTopWidth: 1,
		backgroundColor: '#fdfdfd',
		borderColor: "#eeeeee",
		flexDirection: 'row',
	},
    rowContainer: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    subRow: {
        flex: 1,
        flexDirection: 'row',
    },
    text: {
        marginLeft: 20,
        textAlign: 'left',
        fontWeight: 'bold',
        color: 'grey',
        fontSize: 19,
        flex: 4,
    },
    icon:{
        flex: 1,
        alignSelf: 'flex-end',
    },
	image: {
		marginLeft: 10,
		marginTop: 10,
		height: 40,
		width:40,
	},
	textInput: {
		height: 50,
		borderColor: 'grey',
		borderWidth: 1,
		marginLeft: 15,
	},
});