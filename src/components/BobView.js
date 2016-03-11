var {PropTypes, View, requireNativeComponent} = require('react-native');

var iface = {
    name: 'BobView',
    propTypes: {
        bobInfo: PropTypes.object,
        ...View.propTypes,
    }
};

module.exports = requireNativeComponent('BobView', iface);