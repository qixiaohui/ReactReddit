var {PropTypes, View, requireNativeComponent} = require('react-native');

var iface = {
    name: 'BobView',
    propTypes: {
        ...View.propTypes,
    }
}

module.exports = requireNativeComponent('BobView', iface);