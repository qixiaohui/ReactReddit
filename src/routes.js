export default {
    mainpage: {
        initialRoute: true,
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