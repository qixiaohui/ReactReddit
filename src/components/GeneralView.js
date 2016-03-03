var {PropTypes, View, requireNativeComponent} = require('react-native');

var iface = {
    name: 'GeneralView',
    propTypes: {
        ...View.propTypes,
    }
}

module.exports = requireNativeComponent('GeneralView', iface);