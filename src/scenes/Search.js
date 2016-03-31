import React, {Component, View, StyleSheet, TouchableHighlight, Text, TextInput, Image, ListView, ScrollView} from 'react-native';
import { Icon, List, COLOR } from 'react-native-material-design'
import Line from '../components/Line'
import url from '../http/url'
import storage from '../storage/storage'
import TextField from 'react-native-md-textinput'

export default class Search extends Component{
    constructor(props){
        super(props);
		this.state = {
            theme: COLOR[`googleGreen500`].color,
            dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,        
            }),
		};
        this.checkTheme();
    }

    checkTheme = () => {
        storage.queryStorage("THEME").then(
            (value) => {
                if(value){
                    this.setState({
                        primary: value,
                        theme: COLOR[`${value}500`].color
                    });
                }
            }
        ).done();
    };
    
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
		  }).catch((e) => {
            console.error(e);
          }).done();
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
                    </View>
                </TouchableHighlight>
            </View>
        );
    };

    loadSub = (row) => {
        const {navigator} = this.context;
        navigator.forward('subReddit', row.name, {name: row.name});
    };
    
    render(){
        return(
            <View style={{flex: 1}}>
                <View style={styles.container}>
                    <TextField autoFocus={true} dense={true} label={'Search'} highlightColor={this.state.theme} onChangeText={(text) => this.fetchPosts(text)} />
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
		marginLeft: 20,
		marginRight: 20,
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