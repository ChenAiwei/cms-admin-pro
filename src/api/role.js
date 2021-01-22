import request from './request'

/* 获取角色 */
export function getRoles() {
    return request({
        url: '/role/roleNameInfo',
        method: 'GET'
    })
}