// test.js
import extend from '../../libs/extends.js';
import _ from '../../libs/deepcopy';

extend({
    data: {
        idx: 0,
        result: null
    },
    fetch() {
        this.$http.iad({
            code: 'index',
            fld: 'content_json'
        }).then(res => {
            if (!res) return
            let result = JSON.parse(res.content);
            result = result.map(el => el.swiper);
            this.setData({ result })
            console.log(res.content)
        })
    },
    onLoad() {
        this.fetch()
    }
});