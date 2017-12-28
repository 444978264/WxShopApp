import extend from '../../libs/extends.js';
extend({
    data: {
        list: []
    },
    onLoad(){
        this.fetch()
    },
    fetch() {
        return this.$http.refundLst().then(res => {
            if (!res) return
            console.log(res)
        })
    },
    onReachBottom() {
        if (!this.has_next) return
        this.fetch()
    }
})