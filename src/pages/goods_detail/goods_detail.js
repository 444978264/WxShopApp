// test.js
import extend from '../../libs/extends.js';
import _ from '../../libs/deepcopy';

extend({
    $shareParams: {
        params: {
            id: ''
        }
    },
    data: {
        result: {
            photo: []
        },
        photo: [],
        promotion: null,
        goods_type: "",
        spec_array: null,
        count: 1,
        store_num: 0,
        price: 0,
        selectArr: [],
        show_pop: false
    },
    id: null,
    loading: false,
    // 选择的商品id
    sub_id: "",
    onLoad: function ({ id } = {}) {
        this.$shareParams.params.id = id;
        this.id = id;
        this.fetch();
        this._computed = new computed();
    },
    //计算多规格选择的数据信息
    computedResult: function () {
        if (!this.data.spec_array.length) return;
        let { goodsType } = this._computed;
        let { selectArr, store_num, price, count } = this.data;
        selectArr.forEach(function (res) {
            goodsType = goodsType.filter(function (elem) {
                return elem.spec_array.indexOf(res) > -1;
            });
        });
        if (!goodsType.length) {
            goodsType = [{
                store_nums: 0,
                price: '--',
                id: '--'
            }]
            this.$message('该款式，库存不足', {
                success() {
                    console.log(selectArr, "不足")
                }
            })
        }
        store_num = goodsType[0].store_nums;
        //库存是否为0
        if (store_num == 0) {
            count = 0;
        } else {
            count = 1;
        }
        price = goodsType[0].price;
        this.sub_id = goodsType[0].id;
        this.setData({ price, store_num, count })
    },
    checkHandle(e) {
        let { val, idx } = this.dataset(e);
        let { selectArr } = this.data;
        selectArr[idx] = val;
        this._computed.checkStore = selectArr;
        console.log(this._computed.checkStore, 666)
        this.setData({ selectArr }, () => {
            this.computedResult();
        });
    },
    fetch() {
        if (this.id == null) return
        this.$http.getGoodsDetail({
            id: this.id
        }).then(res => {
            if (!res) return
            let { photo, spec_array, ...other } = res;
            let { store_num, selectArr } = this.data;
            // 检查该商品是否参与营销活动
            this.$http.getPromotions({
                id: other.id,
                price: other.sell_price
            }).then(data => {
                if (!data) return
                let { promotion } = this.data;
                promotion = data;
                this.setData({ promotion })
            })
            // 计算
            this._computed.goodsType = other.skus && other.skus;
            // 如果不是多规格的商品，设置库存数
            store_num = other.skus && !other.skus.length ? other.store_nums : 0;
            let goods_type = other.skus && other.skus.length ? 'product' : 'goods';
            let result = other;

            if (spec_array.trim() != "") {
                spec_array = Object.values(spec_array && JSON.parse(spec_array)).map(res => ({
                    name: res.name,
                    value: res.value.split(",")
                }))
                for (var i = 0; i < spec_array.length; i++) {
                    selectArr[i] = spec_array[i].value[0];
                }
            } else {
                this.sub_id = this.id;
            }

            this.setData({ result, photo, goods_type, spec_array, store_num, selectArr }, () => {
                this.computedResult()
            });
        })
    },
    setCount(e) {
        let { value } = e.detail;
        this.setData({
            count: value
        })
    },
    reduceOrincrease(e) {
        let { type } = this.dataset(e);
        let { count } = this.data;
        switch (type) {
            case "reduce":
                if (count > 1) {
                    count--;
                }
                break
            case "add":
                count++;
                break
        }
        this.setData({ count })
    },
    resultCtrl(e) {
        // if (this.data.spec_array.length) {
        //     this.setData({
        //         show_pop: true
        //     })
        //     return
        // }
        let { type } = this.dataset(e);
        if (this.data.count == 0) {
            this.$message('该款式库存不足，请重新选择', {
                success() {
                    console.log(type)
                }
            })
        }
        switch (type) {
            case "bug":
                this.toBuy();
                break
            case "cart":
                this.joinCart();
                break
        }
    },
    toBuy() {
        let { count, goods_type, store_num } = this.data;
        if (store_num <= 0) {
            this.$message("库存不足")
            return;
        }
        let params = {
            type: goods_type,
            id: this.sub_id,
            num: count
        }
        this.$router.push('order_submit', { ...params });
    },
    joinCart() {
        if (this.loading) return
        let { count, goods_type } = this.data;
        let config = {
            type: goods_type,
            id: this.sub_id,
            num: count
        }
        this.loading = true;
        this.$http.joinCart(config).then(res => {
            this.loading = false;
            if (!res) return
            this.$message('成功加入购物车')
        })
    },
    closePop() {
        this.setData({
            show_pop: false
        })
    },
    showPop() {
        this.setData({
            show_pop: true
        })
    }
});

function computed() {
    let goodsType = [];
    Object.defineProperty(this, 'goodsType', {
        get: () => {
            console.log('get!');
            return goodsType;
        },
        set: skus => {
            console.log(skus)
            if (!skus.length) return
            skus.forEach(function (res) {
                goodsType.push({
                    store_nums: res.store_nums,
                    spec_array: JSON.parse(res.spec_array).map(function (_) {
                        return _.value;
                    }),
                    id: res.id,
                    price: res.group_price
                })
            });
        }
    });
}

