export default {
    mainpage: {
        initialRoute: true,
        title: 'Popular',
        component: require('./scenes/MainPage').default,
        children: {
            content: {
                title: 'Content',
                component: require('./scenes/Content').default,
            },
			comments: {
                title: 'Comments',
				component: require('./scenes/Comment').default,
			},
            subReddit: {
                title: 'SubReddit',
                component: require('./scenes/SubReddit').default,
                children: {
                    content: {
                        title: 'Content',
                        component: require('./scenes/Content').default,
                    },
					comments: {
                        title: 'Comments',
						component: require('./scenes/Comment').default,
					}
                }
            },
            submit: {
                title: 'Submit',
                component: require('./scenes/Submit').default,
            }
        },
    },
    search: {
        title: 'Search',
        component: require('./scenes/Search').default,
    },
    settings: {
        title: 'Settings', 
        component: require('./scenes/Settings').default,
        children: {
            login: {
                title: 'Login',
                component: require('./scenes/Login').default
            },
             theme: {
                title: 'Theme',
                 component: require('./scenes/Themes').default
             },
             friends: {
                title: 'Friends',
                component: require('./scenes/Friends').default
            },
            // logout: {
            //     component: require('./scenes/Logout').default
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