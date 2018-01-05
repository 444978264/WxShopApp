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
        return this.$http.chits().then(res => {
            this.loading = false;
            if (!res) return
            console.log(res)
            this.has_next = res.has_next;
            let { list } = this.data;
            list = list.concat(res.rows);
            this.setData({ list,has_next:res.has_next })
        })
    },
    onReachBottom() {
        if (!this.has_next) return
        this.fetch()
    }
})