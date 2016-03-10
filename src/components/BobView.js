var {PropTypes, View, requireNativeComponent} = require('react-native');

var iface = {
    name: 'BobView',
    propTypes: {
        ...View.propTypes,
        bobInfo: PropTypes.object,
    }
};

module.exports = requireNativeComponent('BobView', iface);