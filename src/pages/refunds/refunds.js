import extend from '../../libs/extends.js';
extend({
    $openRefresh() {
        this.paramsInit();
        return true
    },
    data: {
        list: []
    },
    page: 1,
    pagesize: 20,
    has_next: true,
    loading: false,
    paramsInit() {
        this.page = 1;
        this.has_next = true;
        let list = [];
        this.setData({ list })
    },
    onLoad() {
        this.fetch()
    },
    fetch() {
        if (this.loading) return
        this.loading = true;
        return this.$http.refundLst().then(res => {
            this.loading = false;
            if (!res) return
            console.log(res)
            this.has_next = res.has_next;
            let { list } = this.data;
            list = list.concat(res.rows);
            this.setData({ list })
        })
    },
    getRefund(e) {
        let { item } = this.dataset(e);
        this.setItemSync('refund_detail', item);
        this.$router.push('refund_detail');
    },
    cancelRefund(e) {
        let { id, idx, no } = this.dataset(e);
        this.$message(`要取消"${no}"申请?`, {
            success: () => {
                this.$http.cancelRef({
                    id: id
                }).then(res => {
                    if (!res) return
                    let { list } = this.data;
                    list.splice(idx, 1);
                    this.setData({ list }, () => {
                        this.alert('取消成功')
                    })
                })
            },
            showCancel: true
        })
    },
    onReachBottom() {
        if (!this.has_next) return
        this.fetch()
    }
})