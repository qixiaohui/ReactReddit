import React, { AppRegistry, Component, Navigator, DrawerLayoutAndroid, ScrollView, View, Text, DeviceEventEmitter } from 'react-native';

import Navigate from './src/utils/Navigate';
import Navigation from './src/scenes/Navigation';
import Toolbar from './src/components/Toolbar';
import toast from './src/modules/Toast'

class ReactReddit extends Component {

	static childContextTypes = {
		drawer: React.PropTypes.object,
		navigator: React.PropTypes.object
	};

	constructor(props) {
		super(props);
		this.state = {
			drawer: null,
			navigator: null,
            drawerOpen: false,
		};
	}

    handleKey = (key) => {
        switch(key){
            case "0":
                break;
            case "1":
                break;
            case "2":
                if(this.state.drawerOpen){
                    this.state.drawer.closeDrawer();
                    this.setState({drawerOpen: false});                   
                }
                break;
            case "3":
                break;
            case "4":
                if(!this.state.drawerOpen){
                    this.state.drawer.openDrawer();
                    this.setState({drawerOpen: true});
                }
                break;       
        }
    };

    componentWillMount() {
        DeviceEventEmitter.addListener('keyDown', function(e: Event){
            this.handleKey(e.code);
        }.bind(this));
    }

	getChildContext = () => {
		return {
			drawer: this.state.drawer,
			navigator: this.state.navigator
		}
	};

	setDrawer = (drawer) => {
		this.setState({
			drawer
		});
	};

	setNavigator = (navigator) => {
		this.setState({
			navigator: new Navigate(navigator)
		});
	};

	render() {
		const { drawer, navigator } = this.state;
		const navView = React.createElement(Navigation);

		return (
            
			<DrawerLayoutAndroid
				drawerWidth={300}
				drawerPosition={DrawerLayoutAndroid.positions.Left}
				renderNavigationView={() => {
                    if (drawer && navigator) {
                        return navView;
                    }
                    return null;
                }}
				ref={(drawer) => { !this.state.drawer ? this.setDrawer(drawer) : null }}>
				{drawer &&
				<Navigator
					initialRoute={Navigate.getInitialRoute()} 
					navigationBar={<Toolbar onIconPress={drawer.openDrawer} />}
					configureScene={() => {
                            return Navigator.SceneConfigs.FadeAndroid;
                        }}
					ref={(navigator) => { !this.state.navigator ? this.setNavigator(navigator) : null }}
					renderScene={(route) => {
                    	if(this.state.navigator && route){
                    		return(
                                <View
                                    style={styles.scene}
                                    showsVerticalScrollIndicator={false}>
                                    <route.component title={route.title} path={route.path} {...route.props} />
                                </View>
                            );
                    	}
                    }}
				/>
				}
			</DrawerLayoutAndroid>
		);
	}
}

AppRegistry.registerComponent('ReactReddit', () => ReactReddit);

const styles = {
	scene: {
		flex: 1,
		marginTop: 56
	}
};