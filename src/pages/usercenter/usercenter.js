// test.js
import extend from '../../libs/extends.js';
extend({
    $openRefresh() {
        return true
    },
    data: {
        userInfo: null,
        count: 0,
        chits:0,
        extra: null
    },
    getCount() {
        this.$http.countOfCart().then(count => {
            if (!count) return
            this.setData({ count })
        })
    },
    getChits(){
        this.$http.chits().then(chits => {
            if (!chits) return
            this.setData({ chits:chits.total })
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
        this.getChits();
    },
    toUrl(e) {
        let { pay, dist,type } = this.dataset(e);
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