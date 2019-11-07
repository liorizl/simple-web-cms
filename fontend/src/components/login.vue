<template>
    <div class="login">
        <div class="btitle">{{webName}}</div>
        <div class="ftitle">网站后台管理系统</div>
        <div class="loginCon" @keyup.enter="login">
            <div class="inputDiv">
                <label for="user" class="inputTitle">账  号:</label>
                <input class="inputText" type="text" id="user" v-model="userId" v-focus >
            </div>
            <div class="inputDiv">
                <label for="psd" class="inputTitle">密  码:</label>
                <input class="inputText" type="password" id="psd" v-model="userPsd">
            </div>
            <div class="inputDiv" v-if="useIdentCode">
                <label for="identCode" class="inputTitle">认证码:</label>
                <span>
                    <input class="inputText" type="text" id="identCode" v-model="identCode" size="4" maxlength="4"> 
                </span>
                
            </div>
            <div class="cookie">
                <label for="check"></label>
                <input type="checkbox" id="check" v-model="recordSession">12小时内自动登录
            </div>
            <input class="loginBtn" type="button" value="登录" @click.stop="login"  >
            <div class="errMes">
                {{status}}
            </div>
        </div>
        <div class="codeUrl">
            源码地址:<a href="https://github.com/liorizl/simple-web-cms" target="_blank">https://github.com/liorizl/simple-web-cms</a>
        </div>
    </div>
</template>

<script>
import md5 from 'js-md5';
export default {
    name: "login",
    data: function () {
        return {
            userId: '',
            userPsd: '',
            useIdentCode: null,
            identCode: '',
            recordSession: true,
            status: '',
            webName: null,
        }
    },
    created: function () {
        let cookieUser = this.$cookies.get('user')
        if (cookieUser) {
            this.status = '自动登录中...'
            this.axios({
                method: 'get',
                url: '/admin/autoLogin',
            }).then(res => {
                if (res.status === 200) {
                    if (res.data.myStatus === 1) {
                        this.$router.push({ path: '/admin/', query: { user: res.data.user } })
                    } else {
                        this.status = res.data.errMes
                    }
                }
            }).catch(err => {
                alert('程序内部错误,请检查!')
                console.log(err)
            })
        }
        this.axios({
            url: '/admin/getIdent'
        }).then(res => {
            if (res.status === 200) {
                this.useIdentCode = res.data === 1 ? true : false
            }
        })
        this.axios({
            url: '/admin/getWebName'
        }).then(res => {
            if (res.status === 200) {
                this.webName = res.data.webName
            }
        })
    },
    directives: {
        focus: {
            inserted: function (el) {
                el.focus()
            }
        }
    },
    methods: {
        login: function () {
            if (!this.identCode) {
                this.status = '请输入认证码！'
            } else {
                this.axios({
                    method: 'post',
                    url: '/admin/checkIdentCode',
                    data: { identCode: this.identCode }
                }).then(res => {
                    if (res.data === 1) {
                        this.axios({
                            method: 'post',
                            url: '/admin/login',
                            data: { userId: this.userId, userPsd: md5(this.userPsd), recordSession: this.recordSession, ip: returnCitySN.cip, cname: returnCitySN.cname }
                        }).then((res) => {
                            if (res.data.length === 2) {
                                this.$cookies.set('user', res.data[1].user, 60 * 60 * 12)
                                this.$cookies.set('userName', this.userId, 60 * 60 * 12)
                                this.$router.push({ path: "/admin", query: { user: this.userId } })
                            }
                            else {
                                this.status = '用户名或密码错误！'
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    } else {
                        this.status = '认证码错误！'
                    }
                })
            }

        }
    }
}
</script>

<style lang="less" scoped>
.login {
    width: 100%;
    height: 100vh;
    margin: 0;
    background: #fff url("../assets/images/bg2.jpg") top center;
    overflow: hidden;
}
.btitle {
    width: 100%;
    margin-top: 100px;
    height: 78px;
    text-align: center;
    font: bold 40px/78px "microsoft yahei";
    color: rgb(211, 234, 255);
}
.ftitle {
    width: 100%;
    margin-top: 10px;
    text-align: center;
    font: bold 30px/50px "microsoft yahei";
    color: rgb(211, 234, 255);
}
.loginCon {
    width: 400px;
    margin: 30px auto;
    border: 1px solid #ccc;
    background-color: rgba(223, 236, 246, 0.8);
    border-radius: 15px;
    padding-top: 10px;
}
.inputDiv {
    width: 74%;
    margin: 20px auto;
    color: #555;
    display: flex;
    align-items: center;
    .inputText {
        border-radius: 5px;
        border: 1px solid #ccc;
        height: 22px;
    }
    .inputTitle {
        width: 50px;
        display: block;
    }
    input {
        margin-left: 10px;
        text-indent: 0.5em;
    }
}
.cookie {
    line-height: 24px;
    text-align: left;
    width: 76%;
    margin: 0 auto;
    color: #555;
}
.loginBtn {
    width: 200px;
    height: 40px;
    background-color: rgb(74, 152, 194);
    cursor: pointer;
    border: 0;
    margin: 20px auto 30px auto;
    display: flex;
    justify-content: center;
    border-radius: 5px;
    color: #fff;
    font-size: 20px;
    letter-spacing: 5px;
}
.errMes {
    text-align: center;
    color: #f00;
    margin: 0 auto 20px auto;
}
.codeUrl {
    width: 400px;
    margin: 140px auto;
    text-align: center;
    height: 40px;
    color: #fff;
    a {
        color: #fff;
    }
}
</style>
