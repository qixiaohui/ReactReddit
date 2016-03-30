import React, { Component, PropTypes, View, Text, Image } from 'react-native';

import { Avatar, Drawer, Divider, COLOR, TYPO } from 'react-native-material-design';
import Events from 'react-native-simple-events';
import storage from '../storage/storage'

export default class Navigation extends Component {

    static contextTypes = {
        drawer: PropTypes.object.isRequired,
        navigator: PropTypes.object.isRequired,
    };

    constructor(props) {
		
        super(props);
		
        this.state = {
            route: null,
			items: [],
			headline: 'Hello redditor!'
        }
		
    }

    componentWillUnmount() {
        Events.rm('UPDATE_INFO', 'INFO_LISTENER');
    }

    componentDidMount () {
        storage.queryStorage("ME").then((value) => {
            if(value){
                var obj = JSON.parse(value);
                this.setState({
                    headline: obj.name
                })
            }
        }).done();

        Events.on('UPDATE_INFO', 'INFO_LISTENER', this.onUpdateName);
    }

    onUpdateName = (data) => {
        this.setState({
            headline: data.name
        });
    };

    changeScene = (path, name) => {
        const { drawer, navigator } = this.context;

        this.setState({
            route: path
        });

        if(path === 'settings'){
            navigator.to(path, name, {name: this.state.headline});
        }else{
            navigator.to(path, name);
        }
        drawer.closeDrawer();
    };

    render() {
        const { route } = this.state;

        return (
            <Drawer theme='light' >
                <Drawer.Header image={<Image source={require('./../img/nav.png')} />}>
                    <View style={styles.header}>
                        <Avatar size={80} image={<Image source={require('../img/avatar.png')}/>} />
                        <Text style={[styles.text, COLOR.paperGrey50, TYPO.paperFontSubhead]}>{this.state.headline}</Text>
                    </View>
                </Drawer.Header>

                <Drawer.Section
                    items={[{
                        icon: 'home',
                        value: 'home',
                        active: !route || route === 'mainpage',
                        onPress: () => this.changeScene('mainpage'),
                        onLongPress: () => this.changeScene('mainpage')
                    }]}
                />
                <Divider style={{ marginTop: 8 }} />
                <Drawer.Section
					title="Activity"
                    items={[{
                        icon: 'search',
                        value: 'SearchTopic',
                        active: route === 'search',
                        onPress: () => this.changeScene('search'),
                        onLongPress: () => this.changeScene('search')
                    }]}
                />
                <Divider style={{ marginTop: 8 }} />
                <Drawer.Section
					title="Setting"
                    items={[{
                        icon: 'settings',
                        value: 'settings',
                        active: route === 'settings',
                        onPress: () => this.changeScene('settings'),
                        onLongPress: () => this.changeScene('settings')
                    }]}
                />

            </Drawer>
        );
    }
}

const styles = {
    header: {
        paddingTop: 16
    },
    text: {
        marginTop: 20
    }
};