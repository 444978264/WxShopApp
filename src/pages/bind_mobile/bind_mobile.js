// test.js
import extend from '../../libs/extends.js';
const app = getApp();
extend({
    data: {
        mobile: '',
        second: 60,
        hasSend: false,
        disabled: true
    },
    mobile: '',
    code: '',
    getMobile({ detail }) {
        let { errMsg, ...other } = detail;
        if (errMsg == 'getPhoneNumber:ok') {
            this.$http.getMobileFromWx({
                ...other
            }).then(res => {
                if (!res) return
                console.log(res)
            })
        }
    },
    onInput({ detail, ...other }) {
        let { type } = this.dataset(other);
        let { disabled } = this.data;
        switch (type) {
            case 'mobile':
                this.mobile = detail.value;
                break
            case 'code':
                this.code = detail.value;
                break
        }
        if (disabled && this.mobile.length == 11 && this.code.length == 6) {
            this.setData({
                disabled: false
            })
        } else if (!disabled) {
            this.setData({
                disabled: true
            })
        }
        return detail.value
    },
    bind() {
        this.$http.setMobile({
            mobile: this.mobile,
            code: this.code
        }).then(res => {
            if (!res) return
            this.$message('绑定成功', {
                success: () => {
                    this.$router.redirect('setting');
                }
            })
        })
    },
    sendCode() {
        if (this.mobile == '' || this.mobile.length < 11) {
            this.$message('请输入正确的手机号')
            return
        }
        this.$http.sendCode({
            mobile: this.mobile
        }).then(res => {
            if (!res) return
            this.setData({
                hasSend: true
            }, () => {
                this.timer = setInterval(() => {
                    let { second } = this.data;
                    if (second < 2) {
                        clearInterval(this.timer);
                        this.setData({
                            hasSend: false
                        })
                        return
                    }
                    second--;
                    this.setData({ second });
                }, 1000)
            })
        })
    },
    onUnload() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
});