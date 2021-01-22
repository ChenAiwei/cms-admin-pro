import request from './request'

/**
 * 用户登录
 */
export function login(data) {
    return request({
        url: '/login/v2',
        method: 'post',
        data
    })
}

/**
 * 用户密码编辑
 */
export function editPwd(data) {
    return request({
        url: '/api/account/password/modify',
        method: 'post',
        data
    })
}

/**
 * 用户列表
 */
export function listUser(data) {
    return request({
        url: '/user/listUser',
        method: 'GET',
        params: data
    })
}

/* 批量更改用户状态 */
export function batchChangeUserStatus(data) {
    return request({
        url: '/user/userStatus',
        method: 'post',
        loading: true,
        data
    })
}

/**
 * 获取用户信息
 */
export function queryByUserId(uid) {
    return request({
        url: '/user/queryByUserId/' + uid,
        method: 'get',
        loading: true
    })
}

/**
 * 添加用户
 */
export function addUser(data) {
    return request({
        url: '/user/addUser',
        method: 'post',
        loading: true,
        data
    })
}

/**
 * 编辑用户
 */
export function editUser(data) {
    return request({
        url: '/user/editUser',
        method: 'post',
        loading: true,
        data
    })
}

/**
 * 删除用户
 */
export function delUser(data) {
    return request({
        url: '/user/delUser',
        method: 'post',
        loading: true,
        data
    })
}