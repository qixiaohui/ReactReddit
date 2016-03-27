import React, { Component, PropTypes, Text, View } from 'react-native';
import { Toolbar as MaterialToolbar } from 'react-native-material-design';
import Events from 'react-native-simple-events';
import storage from '../storage/storage'

export default class Toolbar extends Component {

    static contextTypes = {
        navigator: PropTypes.object
    };

    static propTypes = {
        onIconPress: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            theme: 'googleGreen',
        };
        this.checkTheme();
    }

    checkTheme = () => {
        storage.queryStorage("THEME").then(
            (value) => {
                if(value){
                    this.setState({
                        theme: value
                    });
                }
            }
        ).done();
    };

    onChangeTheme = (data) => {
        this.setState({
            theme: data.theme
        });
        this.setTheme(data.theme);
    };

    setTheme = (theme) => {
        storage.setStorage("THEME", theme);
    };

    componentDidMount = () => {
        Events.on('CHANGE_THEME', 'THEME_LISTENER', this.onChangeTheme);
    };

    componentWillUnmount() {
        Events.rm('CHANGE_THEME', 'THEME_LISTENER');
    }

    render() {
        const { navigator } = this.context;
        const { onIconPress } = this.props;
        return (
            <MaterialToolbar
                title={navigator && navigator.currentRoute ? navigator.currentRoute.title : 'Popular'}
				primary={this.state.theme}
                icon={navigator && navigator.isChild ? 'keyboard-backspace' : 'menu'}
                onIconPress={() => navigator && navigator.isChild ? navigator.back() : onIconPress()}
                actions={[{
                    icon: 'refresh',
                    badge: { animate: true },
                }]}
                rightIconStyle={{
                    margin: 10
                }}
            />
        );
    }
}