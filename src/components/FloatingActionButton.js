var {PropTypes, View, requireNativeComponent} = require('react-native');

var iface = {
    name: 'FloatingActionButton',
    propTypes: {
        ...View.propTypes,
        theme: PropTypes.string,
    }
}

module.exports = requireNativeComponent('FloatingActionButton', iface);