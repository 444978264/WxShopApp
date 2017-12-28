// test.js
import extend from '../../libs/extends.js';
import _ from '../../libs/deepcopy';
import { modal } from '../template/template'
let config = _.extend(true, {
    data: {
        final_sum: 0,
        result: null,
        goodsList: [],
        promotionPlug: [],
        paymentList: [],
        paymentIdx: 0,
        tickets: [],
        ticketIdx: 'nouse',
    },
    onLoad: function (options) {
        console.log(options)
        this.fetch(JSON.stringify(options));
        this._getAddress()
        this.getPayments()
        this.getTickets()
    },
    getPayments() {
        this.$http.payments().then(paymentList => {
            if (!paymentList) return
            this.setData({
                paymentList
            })
        })
    },
    getTickets() {
        this.$http.tickets().then(ticketLst => {
            if (!ticketLst) return
            this.setData({
                ticketLst: ticketLst.rows
            })
        })
    },
    fetch(data_json) {
        return this.$http.wait2pay({ data_json }).then(res => {
            if (!res) return
            let { goodsList, promotionPlug, delivery_list, final_sum, ...other } = res;
            this.setData({ goodsList, promotionPlug, delivery_list, final_sum, result: other })
            console.log(res)
        })
    }
}, modal)
extend(config);


