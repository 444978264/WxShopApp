// test.js
import extend from '../../libs/extends.js';
extend({
    $openRefresh() {
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
    toUrl(e) {
        let { pay, dist,type } = this.dataset(e);
        console.log(pay, dist,123132)
        if (pay >= 0 && dist >= 0) {
            this.$router.push("orders", {
                pay,
                dist,
                type
            })
        } else {
            this.$router.push("refunds")
        }
    },
    onShow() {
        this.init();
    }
});