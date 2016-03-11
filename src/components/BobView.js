var {PropTypes, View, requireNativeComponent} = require('react-native');

var iface = {
    name: 'BobView',
    propTypes: {
        ...View.propTypes,
        bobInfo: PropTypes.object,
        title: PropTypes.string,
    }
};

module.exports = requireNativeComponent('BobView', iface);