// test.js
import extend from '../../libs/extends.js';
import address from '../template/modal/address'
extend({
    $openRefresh() {
        return true
    },
    data: {
        list: [],
    },
    loading: false,
    fetch() {
        if (this.loading) return
        this.loading = true;
        return this.$http.addressLst().then(res => {
            this.loading = false;
            if (!res) return
            let list = res;
            this.setData({ list })
        })
    },
    ...address,
    onShow() {
        this.fetch();
    },
});