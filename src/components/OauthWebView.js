var {PropTypes, View, requireNativeComponent} = require('react-native');

var iface = {
    name: 'FloatingActionButton',
    propTypes: {
        ...View.propTypes,
        source: PropTypes.string,
    }
}

module.exports = requireNativeComponent('OauthWebView', iface);