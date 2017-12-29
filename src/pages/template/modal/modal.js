export default {
    data: {
        addressList: [],
        addressIdx: 0,
        delivery_list: [],
        deliveryIdx: 0,
        paymentList: [],
        paymentIdx: 0,
        show_modal: false,
        dataSource: [],
        temp_type: ''
    },
    _order_id: null,
    _modalHide() {
        this.setData({
            show_modal: false
        })
    },
    _getPayments() {
        this.$http.payments().then(paymentList => {
            if (!paymentList) return
            this.setData({
                paymentList
            })
        })
    },
    _selectSource(e) {
        let { type, oid } = this.dataset(e);
        if(oid){
            console.log(this.dataset(e),oid,45654654)
            this._order_id = oid;
        }
        switch (type) {
            case 'delivery':
                this.setData({
                    dataSource: this.data.delivery_list,
                    temp_type: type,
                    show_modal: true
                })
                break
            case 'address':
                this.setData({
                    dataSource: this.data.addressList,
                    temp_type: type,
                    show_modal: true
                })
                break
            case 'payment':
                this.setData({
                    dataSource: this.data.paymentList,
                    temp_type: type,
                    show_modal: true
                })
                break
        }
    },
    _getAddress() {
        this.$http.addressLst().then(addressList => {
            if (!addressList) return
            this.setData({
                addressList
            })
        })
    },
    _selectRes(e) {
        let { type, idx } = this.dataset(e);
        switch (type) {
            case 'delivery':
                this.setData({
                    deliveryIdx: idx,
                    show_modal: false
                })
                break
            case 'address':
                this.setData({
                    addressIdx: idx,
                    show_modal: false
                })
                break
            case 'payment':
                this.setData({
                    paymentIdx: idx,
                    // show_modal:false                    
                }, () => {
                    this._createdOrd();
                })
                break
        }
    },
    _createdOrd() {
        console.log('order')
        if (this._order_id == null) {
            let {
                addressList,
                addressIdx,
                delivery_list,
                deliveryIdx,
                paymentList,
                paymentIdx,
                goodsList
            } = this.data
            this.$http.toPay({
                data_json: JSON.stringify({
                    // ticket_id: ticketIdx >= 0 && ticketLst[ticketIdx].id || '',
                    pay_mode: 'xcx',
                    accept_name: addressList[addressIdx].accept_name,
                    address: addressList[addressIdx].address,
                    area: addressList[addressIdx].area,
                    city: addressList[addressIdx].city,
                    delivery_id: delivery_list[deliveryIdx].id,
                    items: goodsList.map(function (res) {
                        return {
                            type: res.product_id > 0 ? "product" : "goods",
                            id: res.product_id > 0 ? res.product_id : res.goods_id,
                            count: res.count
                        };
                    }),
                    mobile: addressList[addressIdx].mobile,
                    payment: paymentList[paymentIdx].id,
                    province: addressList[addressIdx].province,
                    telphone: addressList[addressIdx].telphone,
                    zip: addressList[addressIdx].zip
                })
            }).then(res => {
                if (!res) return
                let { order_id } = res[0];
                this._order_id = order_id;
                this._payHandle();
            })
        } else {
            this._payHandle();
        }
    },
    _payHandle() {
        this.$http.pay({
            order_id: this._order_id
        }).then(res => {
            if (!res) return
            let { appId, ...other } = res;
            this.setData({
                show_modal: false
            }, () => {
                wx.requestPayment({
                    ...other,
                    success: (res) => {
                        console.log(res)
                        this.$http.payCbk({
                            order_id: this._order_id
                        }).then(res => {
                            if (!res) return
                            //跳到订单详情里
                            this.$router.redirect("order_detail", {
                                id: this._order_id
                            })
                        })
                    },
                    fail: (err) => {
                        console.log(err)
                    }
                })
            })
        })
    }
}