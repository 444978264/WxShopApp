// test.js
import extend from '../../libs/extends.js';
const app = getApp();
extend({
    data: {
        mobile: null,
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
    onShow() {
        this.$http.balance().then(res => {
            if (!res) return
            if (res.g_info.mobile) {
                this.setData({
                    mobile: res.g_info.mobile
                })
            }
        })
    }
});