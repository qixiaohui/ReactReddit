import React, { AppRegistry, Component, Navigator, DrawerLayoutAndroid, ScrollView, View, Text, StatusBar } from 'react-native';
import { COLOR } from 'react-native-material-design';
import Navigate from './src/utils/Navigate';
import Navigation from './src/scenes/Navigation';
import Toolbar from './src/components/Toolbar';
import storage from './src/storage/storage';
import Events from 'react-native-simple-events';

class ReactReddit extends Component {

	static childContextTypes = {
		drawer: React.PropTypes.object,
		navigator: React.PropTypes.object
	};

	constructor(props) {
		super(props);
		this.state = {
			theme: COLOR[`googleGreen500`].color,
			drawer: null,
			navigator: null
		};
		this.checkTheme();
	}

	checkTheme = () => {
        storage.queryStorage("THEME").then(
        	(value) => {
        		if(value){
        			this.setState({
        				theme: COLOR[`${value}500`].color
        			});
        		}
        	}
    	).done();
	};

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

    onChangeColor = (data) => {
        this.setState({
            theme: data.color
        });
    };

    componentDidMount = () => {
        Events.on('CHANGE_COLOR', 'COLOR_LISTENER', this.onChangeColor);
    };

    componentWillUnmount() {
        Events.rm('CHANGE_COLOR', 'COLOR_LISTENER');
    }

	setNavigator = (navigator) => {
		this.setState({
			navigator: new Navigate(navigator)
		});
	};

	render() {
		const { drawer, navigator } = this.state;
		const navView = React.createElement(Navigation);

		return (
			<View style={{flex: 1}}>
				<StatusBar
					animated={true}
					hidden={false}
				    backgroundColor={this.state.theme}
				    translucent={false}
				/>
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
			</View>
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