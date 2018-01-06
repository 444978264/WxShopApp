// test.js
import extend from '../../libs/extends.js';
const app = getApp();
extend({
    data: {
        userInfo: null,
        count: 0,
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
});