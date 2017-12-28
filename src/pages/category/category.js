// test.js
import extend from '../../libs/extends.js';
import _ from '../../libs/deepcopy.js';
import {waterfall} from '../template/template.js';

let config = _.extend(true,{
    data: {
        list: [],
    },
    page: 1,
    pagesize:20,
    has_next: true,
    loading: false,
    fetch() {
        if(this.imgIsLoad)return
        this.imgIsLoad = true;
        if(!this.has_next)return
        if (this.loading) return
        this.loading = true;
        this.$http.goodsLst({
            page:this.page,
            pagesize:this.pagesize
        }).then(res => {
            if (!res) return
            this.loading = false;
            this.page++;
            this.has_next = res.has_next;
            let { list } = this.data;
            list = list.concat(res.rows);
            this.setData({ list });
            console.log(res)
        })
    },
    onLoad: function () {
        this.fetch();
    },
},waterfall)


extend(config);