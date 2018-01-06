// test.js
import extend from '../../libs/extends.js';
const app = getApp();
extend({
    data: {
        userInfo: null,
        second:60,
        extra: null
    },
    getMobile({ detail }) {
        let { errMsg, ...other } = detail;
        if (errMsg == 'getPhoneNumber:ok') {
            this.$http.getMobileFromWx({
                ...other
            }).then(res => {
                if (!res) return
                console.log(res)
            })
        }
    },
    bind(){
        
    },
    sendCode(){
        this.timer = setInterval(() => {
            let { second } = this.data;
            if (second < 2) {
                clearInterval(this.timer);
                this.setData({
                    showBtn: true
                }, () => {
                    // wx.createSelectorQuery().select('#btn-back').boundingClientRect(function (rect) {
                    //     // 使页面滚动到底部
                    //     wx.pageScrollTo({
                    //         scrollTop: rect.bottom
                    //     })
                    // }).exec()
                })
                return
            }
            second--;
            this.setData({ second });
        }, 1000)
    }
});