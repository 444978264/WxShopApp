import extend from '../../libs/extends.js';
import _ from '../../libs/deepcopy';
import { modal } from '../template/template'
let config = _.extend(true, {
    $openRefresh() {
        return true
    },
    data: {
        final_sum: 0,
        result: null,
        goodsList: [],
        promotionPlug: [],
        tickets: [],
        ticketIdx: 'nouse',
    },
    id: null,
    onLoad: function (options) {
        this.id = options.id;
        this.fetch();
        this._getPayments()
    },
    fetch() {
        if (this.id == null) return
        return this.$http.ordDetail({
            id: this.id
        }).then(result => {
            if (!result) return
            console.log(result)
            result.reduce = result.promotionPlug.reduce(function (start, next) {
                return start - next.payment_reduced
            }, result.promotions) - (result.prop_detail ? result.prop_detail.value : 0);
            this.setData({ result });
        })
    },
    refund() {
        this.$router.push('refund_edit', {
            id: this.id
        })
    },
}, modal)
extend(config);