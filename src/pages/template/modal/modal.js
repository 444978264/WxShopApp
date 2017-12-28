export default{
    data:{
        addressList: [],
        addressIdx: 0,
        delivery_list: [],
        deliveryIdx: 0,
        show_modal:false,
        dataSource:[],
        temp_type:''
    },
    _modalHide(){
        this.setData({
            show_modal:false
        })
    },
    _selectSource(e) {
        let { type } = this.dataset(e);
        switch (type) {
            case 'delivery':
                this.setData({
                    dataSource: this.data.delivery_list,
                    temp_type: type,
                    show_modal:true
                })
                break
            case 'address':
                this.setData({
                    dataSource: this.data.addressList,
                    temp_type: type,
                    show_modal:true
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
    _selectRes(e){
        let {type,idx} = this.dataset(e);
        switch(type){
            case 'delivery':
                this.setData({
                    deliveryIdx:idx,
                    show_modal:false
                })
            break
            case 'address':
                this.setData({
                    addressIdx:idx,
                    show_modal:false                    
                })
            break
        }
    }
}