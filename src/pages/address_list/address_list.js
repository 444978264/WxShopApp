// test.js
import extend from '../../libs/extends.js';
extend({
    $openRefresh() {
        return true
    },
    data: {
        list: [],
    },
    loading: false,
    fetch() {
        if (this.loading) return
        this.loading = true;
        return this.$http.addressLst().then(res => {
            this.loading = false;
            if (!res) return
            let list = res;
            this.setData({ list })
        })
    },
    edit(e) {
        let { id } = this.dataset(e);
        this.addressEdit(({ userName, postalCode, provinceName, cityName, countyName, detailInfo, telNumber, ...other }) => {
            this.$http.addressUpdate({
                accept_name: userName,
                province: provinceName,
                city: cityName,
                area: countyName,
                address: detailInfo,
                zip: postalCode,
                mobile: telNumber,
                id: id
            })
        })
    },
    add() {
        this.addressEdit(({ userName, postalCode, provinceName, cityName, countyName, detailInfo, telNumber, ...other }) => {
            this.$http.addressAdd({
                accept_name: userName,
                province: provinceName,
                city: cityName,
                area: countyName,
                address: detailInfo,
                zip: postalCode,
                mobile: telNumber,
            })
        })
    },
    addressEdit(cbk) {
        wx.getSetting({
            success: ({ authSetting }) => {
                if (authSetting['scope.address']) {
                    wx.chooseAddress({
                        success: res => {
                            cbk && cbk(res)
                        },
                        fail(err) {
                            console.log(err)
                        }
                    })
                }else{
                    this.$message("请前往设置，重新获取授权",{
                        success:void(0)    
                    })
                }
            }
        })
    },
    onShow() {
        this.fetch();
    },
});