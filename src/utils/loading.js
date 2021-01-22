import Vue from 'vue'
import loadingComponent from '@/components/loading/loading'

const LoadingConstructor = Vue.extend(loadingComponent)
const instance = new LoadingConstructor({
    el: document.createElement('div')
})

instance.show = false // 默认隐藏

export const showLoding = () => {
    instance.show = true
    document.body.appendChild(instance.$el)
}

export const hideLoading = () => {
    instance.show = false
}