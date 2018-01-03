// test.js
import extend from '../../libs/extends.js';
import _ from '../../libs/deepcopy';
const app = getApp();
extend({
    data: {
        idx: 0,
        result: null,
        city: '--'
    },
    fetch() {
        this.$http.iad({
            code: 'index',
            fld: 'content_json'
        }).then(res => {
            if (!res) return
            let result = JSON.parse(res.content);
            result.forEach((res, i) => {
                res._xcxSource = [];
                if (res.xcx_module.startsWith('goods-')) {
                    let { goodsArr } = res;
                    let way = goodsArr.category == null;
                    if (way) {
                        this.$http.getById({
                            ids: goodsArr.list.join(","),
                            withfullinfo: 1
                        }).then(res => {
                            if (!res) return
                            let { result } = this.data
                            result[i]._xcxSource = res;
                            this.setData({ result })
                        })
                    } else {
                        this.$http.getByCategory({
                            id: goodsArr.category,
                            pagesize: goodsArr.pagesize,
                            withfullinfo: 1,
                        }).then(res => {
                            if (!res) return
                            let { result } = this.data
                            result[i]._xcxSource = res.rows;
                            this.setData({ result })
                        })
                    }
                }
            })
            this.setData({ result })
        })
    },

    onLoad() {
        this.fetch()
    },
    onShow() {
        app.getLocation({
            always: ({ originalData }) => {
                console.log(originalData)
                let city = originalData.result.addressComponent.city;
                this.setData({ city })
            }
        });
    }
});