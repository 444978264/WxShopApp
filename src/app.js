//app.js
import { login, setToken, recmd, $Location } from 'libs/api'
import { setItemSync, getItemSync, alert } from 'utils/util'
import router from 'utils/route'
App({
  onLaunch: function (res) {
    console.log('this is launch', res)
    let { query } = res;
    this.globalData.page = query;
  },
  // 获取 定位
  getLocation({ success, fail, always }) {
    $Location.info((res) => {
      let { result } = res.originalData;
      this.globalData.location = result;
      success && success();
      always && always();
      console.log(res, '百度地址')
    }, (err) => {
      alert('定位失败', "warn")
      console.log(err)
      fail && fail();
      always && always();
    })
  },
  login(fn) {
    this.checkLogin((code, { encryptedData, iv }) => {
      let params = {
        code: code,
        encryptedData,
        iv,
      };
      //更新数据
      login(params).then(res => {
        setToken(res.token);
        setItemSync("userid", res.userid);
        setItemSync("token", res.token);
        fn && fn(res);
        let { recmd_userid } = this.globalData.page;
      });
    })
  },
  checkLogin: function (cb) {
    var that = this;
    let token = getItemSync('token');
    if (token) {
      // token存在就直接跳转index页面
      router.redirect('index')
    } else {
      //调用登录接口
      wx.getSetting({
        success: (config) => {
          console.log(config)
          wx.login({
            success: data => {
              // console.log(data.code) // 登陆凭证获取openid
              this.getUserInfo(data, cb);
            },
            fail: err => {
              console.log(err, 66)
            }
          })
        },
        fail: err => {
          console.log(err, 55)
        }
      })
    }
  },
  getUserInfo(data, cb) {
    wx.getUserInfo({
      success: res => {
        this.globalData.userInfo = res.userInfo;
        setItemSync('userInfo', res.userInfo)
        typeof cb == "function" && cb(data.code, res)
      },
      fail: err => {
        console.log(err, 77)
        console.log(router.loading)
        router.redirect('404', {
          from: 'login',
          prop: 'info'
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    page: null,
    location: null
  },
})