export default {
    mainpage: {
        initialRoute: true,
        title: 'Popular',
        component: require('./scenes/MainPage').default,
        children: {
            content: {
                component: require('./scenes/Content').default,
            },
			comments: {
				component: require('./scenes/Comment').default,
			},
            subReddit: {
                component: require('./scenes/SubReddit').default,
                children: {
                    content: {
                        component: require('./scenes/Content').default,
                    },
					comments: {
						component: require('./scenes/Comment').default,
					}
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
    settings: {
        title: 'settings', 
        component: require('./scenes/Settings').default,
    },
}