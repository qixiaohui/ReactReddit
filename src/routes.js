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
    search: {
        title: 'search',
        component: require('./scenes/Search').default,
    },
    settings: {
        title: 'settings', 
        component: require('./scenes/Settings').default,
        children: {
            login: {
                component: require('./scenes/Login').default
            },
            // logout: {
            //     component: require('./scenes/Logout').default
            // },
            // theme: {
            //     component: require('./scenes/Theme').default
            // },
            // friends: {
            //     component: require('./scenes/Friends').default
            // },
            // password: {
            //     component: require('./scenes/Password').default
            // },
            // block: {
            //     component: require('./scenes/Block').default
            // }
        }
    },
}