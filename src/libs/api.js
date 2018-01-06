import bmap from './bmap-wx.min.js';
import { $loading, removeItemSync, getItemSync, setItemSync } from '../utils/util';
import Factory from './promise_factory';
import config from '../config/config';
import dev from '../is_develop';
export let TOKEN = getItemSync('token');

const INFO = getItemSync('localInfo') || {};
const host = dev ? config.local : config.host;
/* 新建百度地图对象 */
  export const BMap = new bmap.BMapWX({
    ak: config.secret
  });
/* 获取位置--百度地图 */
  export const $Location = {
    el: BMap,
    info(success, fail) {
      this.el.regeocoding({
        fail: fail,
        success: success,
        // iconPath: '../../img/marker_red.png',
        // iconTapPath: '../../img/marker_red.png'
      });
    }
  }
/*设置全局token*/
  export const setToken = token => TOKEN = token;
/*新的fetch---Promise封装2017-12-25*/
  let collections = [];
  let lock = false;
  const ajax = (url, params, config) => {
    console.log(url)
    let promise = Factory((resolve, reject) => {
      let result = Object.assign({
        url: url,
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          token: TOKEN,
          sxs_id:'c1',
          ...params
        },
        success: res => {
          $loading.done();
          if (lock) return
          // 从队列中删除这次请求
          collections.splice(task.idx, 1);
          if (res.data.code <= -9999||res.data.code <= -98) {
            lock = true;
            removeItemSync('token');
            removeItemSync('userInfo');
            /***请求队列处理***/
            // 防止一个页面 多个请求 token失效 同时打开login页面 引起的错误  
            collections.forEach(function (t) {
              // 取消后面的所有请求
              t.abort();
            })
            collections = [];
            /**********************/
            wx.navigateTo({
              url: '/pages/login/login',
              success: function (data) {
                lock = false;
              },
              fail: function (err) {
                console.log(err)
              }
            })
            return false
          }
          resolve(res.data)
        },
        fail: err => reject(err)
      }, config);
      //显示loading
      $loading.start();
      let task = wx.request(result);
      // 请求队列
      collections.push(task);
      //设置对应的队列下标
      task.idx = collections.length - 1;
    });
    return promise.then(res => {
      if (res.code < 0) {
        wx.showToast({
          title: res.msg,
          icon: 'loading',
          image: '/img/tip.svg',
          duration: 2000
        })
        return false
      }
      if (res.simple_client && typeof res.result == 'object') {
        res.result.g_info = res.simple_client;
      }
      return res.result
    }).catch(err => console.log(err, url, 'fail'))
  }
/*获取接口地址*/
  export const getUrl = (c, a) => {
    return `${host}/index.php/${c}/${a}`
  }
/* 获取图片地址 */
  export const getImg = path => {
    return `${host}/static/red/${path}`
  }
/*上传文件地址&方法*/
  let uploadUrl = getUrl('index', 'ai_do');

  let uploadImg = getUrl('index', 'upload');
  // 文件上传---(暂时不用)
  const upload = function (url, tempFilePath, data) {
    Factory(function (resolve, reject) {
        wx.uploadFile({
            url: url,
            filePath: tempFilePath,
            name: 'file',
            formData: {
                ...data,
                token: TOKEN
            },
            success: res => {
                let result = JSON.parse(res.data);
                console.log(result)
                if (result.code <= -9999) {
                    removeItemSync('token');
                    wx.navigateTo({
                        url: '/pages/login/login',
                    })
                    return
                }
                resolve(result);
            },
            fail: err => {
                console.log(err)
            }
        })
    })
  }
/* 所有api 接口 */
  // 登录
  export const login = (params, config) => ajax(getUrl('iwx', 'auth_from_xcx'), params, config);
  // formid
  export const formid = (params, config) => ajax(getUrl('index', 'notify_queue'), params, config);
  // 商品列表
  export const goodsLst = (params,config)=>ajax(getUrl("igoods","lst"), params, config)
  // 商品列表
  export const getGoodsDetail = (params,config)=>ajax(getUrl("igoods","get_one"), params, config)
  // 商品活动
  export const getPromotions = (params,config)=>ajax(getUrl("igoods","get_promotions"), params, config)
  // 加入购物车
  export const joinCart = (params,config)=>ajax(getUrl("icart","join"), params, config)
  // 创建订单
  export const wait2pay = (params,config)=>ajax(getUrl("icart","wait2pay"), params, config)
  // 支付方式
  export const payments = (params,config)=>ajax(getUrl("icart","lst_payment"), params, config)
  // 地址列表
  export const addressLst = (params,config)=>ajax(getUrl("iaddress","lst"), params, config)
  // 地址编辑
  export const addressUpdate = (params,config)=>ajax(getUrl("iaddress","update"), params, config)
  // 地址添加
  export const addressAdd = (params,config)=>ajax(getUrl("iaddress","add"), params, config)
  // 地址删除
  export const addressDel = (params,config)=>ajax(getUrl("iaddress","del"), params, config)
  // 代金券列表
  export const tickets = (params,config)=>ajax(getUrl("icashcoupon","lst"), params, config)
  // 微页面
  export const iad = (params,config)=>ajax(getUrl("iad","get_fld"), params, config)
  // 分类
  export const category = (params,config)=>ajax(getUrl("icategory","lst"), params, config)
  //提交订单
  export const toPay = (params,config)=>ajax(getUrl("iorder","create_order"), params, config)
  //订单详情
  export const ordDetail = (params,config)=>ajax(getUrl("iorder","get_one"), params, config)
  //申请退款
  export const refund = (params,config)=>ajax(getUrl("irefund","submit"), params, config)
  // 发起小程序微信支付
  export const pay = (params,config)=>ajax(getUrl("iorder","pay"), params, config)
  // 支付状态检查
  export const payCbk = (params,config)=>ajax(getUrl("iorder","pay_callback"), params, config)
  //改变支付方式
  export const payUpdate = (params,config)=>ajax(getUrl("iorder","update_payment"), params, config)
  // 退款申请列表
  export const refundLst = (params,config)=>ajax(getUrl("irefund","lst"), params, config)
  // 取消退款申请
  export const cancelRef = (params,config)=>ajax(getUrl("irefund","cancel_by_user"), params, config)
  // 退货地址
  export const refundAddress = (params,config)=>ajax(getUrl("iexpress","address_lst"), params, config)
  // 购物车数量
  export const countOfCart = (params,config)=>ajax(getUrl("icart","count"), params, config)
  // 购物车数量
  export const balance = (params,config)=>ajax(getUrl("iwx","get_userinfo"), params, config)
  // 订单列表
  export const orderLst = (params,config)=>ajax(getUrl("iorder","lst"), params, config)
  // 确定收货
  export const confirmOrder = (params,config)=>ajax(getUrl("iorder","confirm"), params, config)
  // 取消订单
  export const cancelOrder = (params,config)=>ajax(getUrl("iorder","cancel"), params, config)
  // 通过id
  export const getById = (params,config)=>ajax(getUrl("igoods","get_by_ids"), params, config)
  // 通过分类
  export const getByCategory = (params,config)=>ajax(getUrl("igoods","get_by_category"), params, config)
  // 代金券
  export const chits = (params,config)=>ajax(getUrl("icashcoupon","lst"), params, config)
  // 代金券
  export const getMobileFromWx = (params,config)=>ajax(getUrl("iwx","decrypt_from_xcx"), params, config)

/* export default */
  export default {
    TOKEN,
    getById,
    getByCategory,
    setToken,
    uploadUrl,
    uploadImg,
    goodsLst,
    getImg,
    formid,
    $Location,
    getGoodsDetail,
    getPromotions,
    joinCart,
    wait2pay,
    payments,
    addressLst,
    tickets,
    iad,
    toPay,
    pay,
    payCbk,
    ordDetail,
    category,
    refund,
    refundLst,
    cancelRef,
    refundAddress,
    countOfCart,
    balance,
    orderLst,
    confirmOrder,
    cancelOrder,
    addressUpdate,
    addressAdd,
    addressDel,
    payUpdate,
    chits,
    getMobileFromWx
  }