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
                    }, {
                        icon: 'check-box',
                        value: 'Checkboxes',
                        label: '10',
                        active: route === 'checkboxes',
                        onPress: () => this.changeScene('checkboxes'),
                        onLongPress: () => this.changeScene('checkboxes')
                    }, {
                        icon: 'label',
                        value: 'Dividers',
                        label: '10',
                        active: route === 'dividers',
                        onPress: () => this.changeScene('dividers'),
                        onLongPress: () => this.changeScene('dividers')
                    }, {
                        icon: 'label',
                        value: 'Icon Toggles',
                        label: 'NEW',
                        active: route === 'icon-toggles',
                        onPress: () => this.changeScene('icon-toggles'),
                        onLongPress: () => this.changeScene('icon-toggles')
                    }, {
                        icon: 'radio-button-checked',
                        value: 'Radio Buttons',
                        label: '8',
                        active: route === 'radio-buttons',
                        onPress: () => this.changeScene('radio-buttons'),
                        onLongPress: () => this.changeScene('radio-buttons')
                    },
                    {
                        icon: 'label',
                        value: 'Subheaders',
                        label: '4',
                        active: route === 'subheaders',
                        onPress: () => this.changeScene('subheaders'),
                        onLongPress: () => this.changeScene('subheaders')
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
                    }, {
                        icon: 'check-box',
                        value: 'Checkboxes',
                        label: '10',
                        active: route === 'checkboxes',
                        onPress: () => this.changeScene('checkboxes'),
                        onLongPress: () => this.changeScene('checkboxes')
                    }, {
                        icon: 'label',
                        value: 'Dividers',
                        label: '10',
                        active: route === 'dividers',
                        onPress: () => this.changeScene('dividers'),
                        onLongPress: () => this.changeScene('dividers')
                    }, {
                        icon: 'label',
                        value: 'Icon Toggles',
                        label: 'NEW',
                        active: route === 'icon-toggles',
                        onPress: () => this.changeScene('icon-toggles'),
                        onLongPress: () => this.changeScene('icon-toggles')
                    }, {
                        icon: 'radio-button-checked',
                        value: 'Radio Buttons',
                        label: '8',
                        active: route === 'radio-buttons',
                        onPress: () => this.changeScene('radio-buttons'),
                        onLongPress: () => this.changeScene('radio-buttons')
                    },
                    {
                        icon: 'label',
                        value: 'Subheaders',
                        label: '4',
                        active: route === 'subheaders',
                        onPress: () => this.changeScene('subheaders'),
                        onLongPress: () => this.changeScene('subheaders')
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
                    title="Config"
                    items={[{
                        icon: 'invert-colors',
                        value: 'Change Theme',
                        label: '24',
                        active: route === 'themes',
                        onPress: () => this.changeScene('themes'),
                        onLongPress: () => this.changeScene('themes')
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