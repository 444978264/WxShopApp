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
    keyword:'',
    paramsInit() {
        this.page = 1;
        this.keyword = '';
        this.has_next = true;
        this.imgIsLoad = false;
        this._count = 0;
        this.waterfulView = [0, 0];
        let list = [];
        this.setData({ list })
    },
    fetch() {
        console.log(this.imgIsLoad,this.loading,this.has_next)
        if (!this.has_next) return
        if (this.loading) return
        if (this.imgIsLoad) return
        this.imgIsLoad = true;
        this.loading = true;
        return this.$http.goodsLst({
            page: this.page,
            pagesize: this.pagesize,
            class: this.data.viewid > 0 ? this.data.viewid : '',
            search_json:this.keyword
        }).then(res => {
            this.loading = false;
            if (!res) return
            this.page++;
            this.has_next = res.has_next;
            let { list } = this.data;
            if(!res.rows.length)return
            list = list.concat(res.rows);
            this.setData({ list });
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
        if(viewid == this.data.viewid)return
        this.setData({ viewid }, () => {
            this.removeItem('keyword');
            this.paramsInit();
            this.fetch();
        })
    },
    onLoad: function (options) {
        this.keyword = options.keyword || '';
        let id = options.class;
        if(id){
            this.setData({
                viewid:id
            })
        }
        this.fetch();
        this.category();
    }
}, waterfall)


extend(config);