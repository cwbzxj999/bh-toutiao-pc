// 这里是自己注册的组件
import MyBread from '@/components/mybread'
import MyChannel from '@/components/mychannel'
import MyImage from '@/components/myimage'
export default {
  install (Vue) {
    // Vue是一个构造函数
    Vue.component('my-bread', MyBread)
    Vue.component('my-channel', MyChannel)
    Vue.component('my-image', MyImage)
  }
}
