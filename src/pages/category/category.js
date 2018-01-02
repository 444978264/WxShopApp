// test.js
import extend from '../../libs/extends.js';
import _ from '../../libs/deepcopy.js';
import { waterfall } from '../template/template.js';

let config = _.extend(true, {
    data: {
        list: [],
        navs: [{
            name: "全部",
            id: 0
        }],
        viewid: 0
    },
    page: 1,
    pagesize: 20,
    has_next: true,
    loading: false,
    paramsInit() {
        this.page = 1;
        this.has_next = true;
        this.imgIsLoad = false;
        this._count = 0;
        this.waterfulView = [0, 0];
        let list = [];
        this.setData({ list })
    },
    fetch() {
        if (this.imgIsLoad) return
        this.imgIsLoad = true;
        if (!this.has_next) return
        if (this.loading) return
        this.loading = true;
        return this.$http.goodsLst({
            page: this.page,
            pagesize: this.pagesize,
            class: this.data.viewid > 0 ? this.data.viewid : ''
        }).then(res => {
            this.loading = false;
            if (!res) return
            this.page++;
            this.has_next = res.has_next;
            let { list } = this.data;
            list = list.concat(res.rows);
            this.setData({ list });
            console.log(res)
        })
    },
    category() {
        this.$http.category().then(res => {
            if (!res) return
            let { navs } = this.data;
            navs = navs.concat(res)
            this.setData({ navs })
            console.log(res)
        })
    },
    selectNavs(e) {
        let { viewid } = this.dataset(e);
        this.setData({ viewid }, () => {
            console.log(12132)
            this.paramsInit();
            this.fetch();
        })
    },
    onLoad: function () {
        this.fetch();
        this.category();
    },
}, waterfall)


extend(config);