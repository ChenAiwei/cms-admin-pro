import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import Main from "@/components/main/main";

/**
 meta: {
    hide: false, 是否在左侧菜单显示 不显示请设为 true
    title: "列表页面", 菜单标题
    icon: "md-grid", 图标
    roleId: 1 菜单权限id 不填写等同于不需要权限校验
    singlePage: true 单页 非嵌套栏目显示
}
 */

// 不需要权限校验的静态路由
export const constantRoutes = [{
        path: "/login",
        name: "login",
        meta: {
            hide: true,
            title: "登录"
        },
        component: () =>
            import ("@/views/login/login")
    },
    {
        path: "/",
        name: "Dashboard",
        redirect: '/workplace',
        component: Main,
        meta: {
            hide: false,
            title: "Dashboard",
            icon: "md-speedometer",
        },
        children: [{
            path: "/workplace",
            name: "workplace",
            meta: {
                hide: false,
                title: "工作台"
            },
            component: () =>
                import ("@/views/Dashboard/workplace")
        }, ]
    },
    {
        path: "/form",
        name: "form",
        redirect: '/form/basic_form',
        component: Main,
        meta: {
            hide: false,
            title: "表单页面",
            icon: "md-cube",
        },
        children: [{
                path: "/form/basic_form",
                name: "basic-form",
                meta: {
                    hide: false,
                    title: "基础表单",
                },
                component: () =>
                    import ("@/views/form/basic_form")
            },
            {
                path: "/form/advanced_form",
                name: "advanced_form",
                meta: {
                    hide: false,
                    title: "高级表单",
                },
                component: () =>
                    import ("@/views/form/advanced_form")
            },
        ]
    },
    {
        path: "/list",
        name: "list",
        redirect: '/list/user_list',
        component: Main,
        meta: {
            hide: false,
            title: "列表页面",
            icon: "md-grid",
        },
        children: [{
                path: "/list/user_list",
                name: "user_list",
                meta: {
                    hide: false,
                    title: "用户列表",
                },
                component: () =>
                    import ("@/views/list/user_list")
            },
            {
                path: "/list/goods_list",
                name: "goods_list",
                meta: {
                    hide: false,
                    title: "商品列表",
                },
                component: () =>
                    import ("@/views/list/goods_list")
            }
        ]
    },

    {
        path: "/editor",
        name: "editor",
        redirect: '/editor/wangEditor',
        component: Main,
        meta: {
            hide: false,
            title: "编辑器",
            icon: "ios-create-outline",
        },
        children: [{
            path: "/editor/wangEditor",
            name: "editor_wangEditor",
            meta: {
                hide: false,
                title: "wangEditor",
                icon: 'ios-create-outline'
            },
            component: () =>
                import ("@/views/editor/wangEditor")
        }]
    }
]


// 需要权限校验的异步路由
export const asyncRoutes = [{
        path: "/permission",
        name: "permission",
        redirect: '/permission-index',
        component: Main,
        meta: {
            hide: false,
            title: "权限测试",
            icon: "ios-switch-outline",
            roleId: "8",
            singlePage: true
        },
        children: [{
            path: "/permission-index",
            name: "permission-index",
            meta: {
                hide: false,
                title: "权限测试",
                roleId: "8"
            },
            component: () =>
                import ("@/views/permission")
        }, ]
    },

    {
        path: "/system",
        name: "system",
        redirect: '/system/user',
        component: Main,
        meta: {
            hide: false,
            title: "系统页面",
            icon: "md-search",
            roleId: "1"
        },
        children: [{
                path: "/system/user",
                name: "system_user",
                meta: {
                    hide: false,
                    title: "用户列表",
                    roleId: "1-1"
                },
                component: () =>
                    import ("@/views/system/user")
            },
            {
                path: "/system/role",
                name: "system_role",
                meta: {
                    hide: false,
                    title: "角色列表",
                    roleId: "1-2"
                },
                component: () =>
                    import ("@/views/system/role")
            },
            {
                path: "/system/authority",
                name: "system_authority",
                meta: {
                    hide: false,
                    title: "权限列表",
                    roleId: "1-5"
                },
                component: () =>
                    import ("@/views/system/authority")
            },
            {
                path: "/system/log",
                name: "system_log",
                meta: {
                    hide: false,
                    title: "日志列表",
                    roleId: "1-4"
                },
                component: () =>
                    import ("@/views/system/log")
            }
        ]
    }

]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})
const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}
// 解决跳转同一个路由报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

router.selfaddRoutes = function(params) {
    resetRouter()
    router.addRoutes(params)
}


export default router