// test.js
import extend from '../../libs/extends.js';
const app = getApp();
extend({
    $openRefresh(){
        return true
    },
    data: {
        userInfo: null,
        count: 0,
        extra: null
    },
    getCount() {
        this.$http.countOfCart().then(count => {
            if (!count) return
            this.setData({ count })
        })
    },
    fetch() {
        return this.$http.balance().then(res => {
            if (!res) return
            this.setData({
                extra: res.g_info
            })
        })
    },
    init() {
        let userInfo = this.getItemSync("userInfo");
        this.setData({ userInfo })
        this.getCount();
        this.fetch();
    },
    onShow() {
        this.init();
    }
});