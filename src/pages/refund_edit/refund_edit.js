import extend from '../../libs/extends.js';
extend({
    data: {
        items: [],
        order_no: '',
        content: '7天无理由退换货'
    },
    id: null,
    loading: false,
    reasons: [
        "下错订单",
        '卖家发错货',
        '质量问题',
        '7天无理由退换货'
    ],
    refund_items: [],
    onLoad({ id }) {
        this.id = id;
        console.log(id)
        this.fetch();
    },
    fetch() {
        return this.$http.ordDetail({
            id: this.id
        }).then(res => {
            if (!res) return
            let { items, order_no } = res;
            this.setData({
                items, order_no
            });
        })
    },
    checkboxChange({ detail }) {
        let val = detail.value;
        this.refund_items = val;
        console.log(val)
    },
    showActions() {
        wx.showActionSheet({
            itemList: this.reasons,
            success: res => {
                let idx = res.tapIndex;
                let content = this.reasons[idx];
                this.setData({ content });
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    },
    submit: function () {
        if (this.loading) return;
        if (!this.refund_items.length) {
            this.alert('请选择退款商品');
            return
        }
        let { items, content } = this.data;
        this.loading = true;
        this.$http.refund({
            order_id: this.id,
            content:content,
            o_id: this.refund_items.join(',')
        }).then(res => {
            this.loading = false;
            if (!res) return
            this.$router.redirect('refunds');
        })
    }
})