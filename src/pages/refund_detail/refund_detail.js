import extend from '../../libs/extends.js';
extend({
    data: {
        result: [],
        refundAddress: null
    },
    loading: false,
    fetch() {
        if (this.loading) return;
        this.loading = true;
        this.$http.refundAddress().then(res => {
            this.loading = false;
            if (!res) return
            var address = res.filter(function (res) {
                return res.is_default == 1
            });
            let { refundAddress } = this.data;
            if (address.length) {
                refundAddress = address[0];
                this.setData({ refundAddress })
            }
        })
    },
    onLoad() {
        let result = this.getItemSync('refund_detail');
        this.setData({ result });
        this.fetch();
    },
    onUnload() {
        this.removeItem("refund_detail");
    }
})