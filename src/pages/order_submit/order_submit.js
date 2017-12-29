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
    data_json: null,
    init() {
        this.fetch();
        this._getAddress()
        this._getPayments()
        this.getTickets()
    },
    onLoad: function (options) {
        console.log(options)
        this.data_json = JSON.stringify(options);
        this.init();
    },
    getTickets() {
        this.$http.tickets().then(ticketLst => {
            if (!ticketLst) return
            this.setData({
                ticketLst: ticketLst.rows
            })
        })
    },
    fetch() {
        return this.$http.wait2pay({ data_json: this.data_json }).then(res => {
            if (!res) return
            let { goodsList, promotionPlug, delivery_list, final_sum, ...other } = res;
            this.setData({ goodsList, promotionPlug, delivery_list, final_sum, result: other })
            console.log(res)
        })
    },
    onShow() {
        if (this.$firstRender) return
        this.init();
    }

}, modal)
extend(config);