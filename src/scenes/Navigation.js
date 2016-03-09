import React, { Component, PropTypes, View, Text, Image } from 'react-native';

import { Avatar, Drawer, Divider, COLOR, TYPO } from 'react-native-material-design';
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
		
		storage.queryStorage('COOKIE').then(
			(value) => {
				var route = this.state.route;
				
				if(!value){
					this.setState({items: [{
                        icon: 'face',
                        value: 'Login',
                        active: route === 'login',
                        onPress: () => this.changeScene('login'),
                        onLongPress: () => this.changeScene('login')
                    }, {
                        icon: 'search',
                        value: 'SearchTopic',
                        active: route === 'search',
                        onPress: () => this.changeScene('search'),
                        onLongPress: () => this.changeScene('search')
                    }]});
				}else{
					this.setState({items: [{
                        icon: 'face',
                        value: 'Logout',
                        active: route === 'logout',
                        onPress: () => this.changeScene('logout'),
                        onLongPress: () => this.changeScene('logout')
                    }, {
                        icon: 'search',
                        value: 'SearchTopic',
                        active: route === 'search',
                        onPress: () => this.changeScene('search'),
                        onLongPress: () => this.changeScene('search')
                    }]});
				}
			}
		).done();
    }

    changeScene = (path, name) => {
        const { drawer, navigator } = this.context;

        this.setState({
            route: path
        });

        navigator.to(path, name);
        drawer.closeDrawer();
    };

    render() {
        const { route } = this.state;

        return (
            <Drawer theme='light'>
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

                <Drawer.Section
                    title="Activities"
                    items={this.state.items}
                />
                <Divider style={{ marginTop: 8 }} />
                <Drawer.Section
                    title="Settings"
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