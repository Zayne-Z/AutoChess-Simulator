<script>
import store from './store.js'
export default {
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */
    let logs
    if (mpvuePlatform === 'my') {
      logs = mpvue.getStorageSync({ key: 'logs' }).data || []
      logs.unshift(Date.now())
      mpvue.setStorageSync({
        key: 'logs',
        data: logs
      })
    } else {
      logs = mpvue.getStorageSync('logs') || []
      logs.unshift(Date.now())
      mpvue.setStorageSync('logs', logs)
    }
    wx.cloud.init({
      env: 'zayne-autochess-nj0726',
      traceUser: true
    })
    const db = wx.cloud.database({ env: 'zayne-autochess-nj0726' })
    db.collection('AutoChessDB').get({
      success (res) {
        res.data.forEach(resData => {
          switch (resData._id) {
            case 'races_cloud':
              store.dispatch('setRaces', resData.result)
              break
            case 'effect_cloud':
              store.dispatch('setEffect', resData.result)
              break
            case 'heros_cloud':
              store.dispatch('setHeros', resData.result)
              break
            default:
              store.dispatch('setBattles', resData.result)
              break
          }
        })
      }
    })
    // 本地调试
    // store.dispatch('setRaces', require('../static/datas/races.json'))
    // store.dispatch('setHeros', require('../static/datas/heros.json'))
    // store.dispatch('setEffect', require('../static/datas/effect.json'))
    // store.dispatch('setBattles', require('../static/datas/battles.json'))
  },
  log () {
    // console.log(`log at:${Date.now()}`)
  }
}
</script>

<style>
@import "../static/iconfont/iconfont.css";
</style>
