export default {
    mainpage: {
        initialRoute: true,
        title: 'Popular',
        component: require('./scenes/MainPage').default,
        children: {
            content: {
                component: require('./scenes/Content').default,
            },
            subReddit: {
                component: require('./scenes/SubReddit').default,
                children: {
                    content: {
                        component: require('./scenes/Content').default,
                    },
                }
            }
        },
    },
    login: {
        title: 'Login',
        component: require('./scenes/Login').default,
    },
    search: {
        title: 'search',
        component: require('./scenes/Search').default,
    },
    theme: {
        title: 'theme', 
        component: require('./scenes/Theme').default,
    },
}