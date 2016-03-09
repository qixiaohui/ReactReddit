export default {
    bobView: {
        title: 'BobView',
       initialRoute: true, 
       component: require('./scenes/BobViewList').default,
    },
    mainpage: {
        title: 'Popular',
        component: require('./scenes/MainPage').default,
        children: {
            content: {
                component: require('./scenes/Content').default,
            }
        },
    },
    login: {
        title: 'Login',
        component: require('./scenes/Login').default,
    },
}