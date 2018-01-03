// test.js
import extend from '../../libs/extends.js';
import _ from '../../libs/deepcopy';
const app = getApp();
extend({
    $openRefresh() {
        return true
    },
    data: {
        idx: 0,
        result: null,
        city: '--'
    },
    loading: false,
    fetch() {
        if (this.loading) return
        this.loading = true;
        return this.$http.iad({
            code: 'index',
            fld: 'content_json'
        }).then(res => {
            this.loading = false;
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
                } else if (res.xcx_module == 'swiper') {
                    res.swiperHeight = 0
                }
            })
            this.setData({ result })
        })
    },
    // swiper自适应高度
    imgLoad({ detail, ...other }) {
        let { id } = this.dataset(other);
        let { result } = this.data;
        let h = detail.height;
        if (result[id].swiperHeight <= 0) {
            result[id].swiperHeight = h;
        } else {
            result[id].swiperHeight = result[id].swiperHeight > h ? result[id].swiperHeight : h;
        }
        this.setData({result})
    },
    setVal({ detail }) {
        this.inp_val = JSON.stringify([{
            field: 'name',
            oper: 'like',
            keyword: detail.value
        }]);
    },
    searchResult({ type, ...other }) {
        switch (type) {
            case "confirm":
                this.setVal(other);
                break;
        }
        this.$router.push('products', {
            keyword: this.inp_val
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