import axios from 'axios'
import store from '../store'
import { Message } from 'view-design';
import { showLoding, hideLoading } from '@/utils/loading';


// 创建一个axios实例
const service = axios.create({
        baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
        timeout: 30000, // 请求超时时间 默认30秒
        headers: {
            'Content-Type': 'application/json'
        }

    })
    // 请求拦截器
service.interceptors.request.use(config => {
        const token = sessionStorage.getItem('userToken');
        const userId = sessionStorage.getItem('userId');
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        if (token && userId) {
            config.headers['token'] = token
            config.headers['userId'] = userId

        }
        if (config.loading) {
            showLoding()
        }
        return config
    },
    error => {
        hideLoading()
        console.log(error)
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        hideLoading()
        const res = response.data
        if (res.code !== 0) {
            if ("Invalid token" == res.msg) {
                store.dispatch('user/logout')
                return
            }
            Message.warning(res.msg || 'Error')
            return Promise.reject(new Error(res.msg || 'Error'))
        } else {
            return res
        }
    },
    error => {
        hideLoading()
        console.log('err' + error)
        return Promise.reject(error)
    }
)

export default service