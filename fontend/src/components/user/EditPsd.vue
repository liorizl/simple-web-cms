<template>
    <div class="rightCon">
        <now-position v-bind:posList="posiList"></now-position>
        <div class="ccon">
            <form name="userPsd">
                <div class="input">
                    <span class="input-title"><label for="name">用户名</label></span>
                    <span class="input-con">
                        <input type="text" id="name" v-model="name" name="name">
                    </span>
                </div>
                <div class="input">
                    <span class="input-title"><label for="psd1">用户密码</label></span>
                    <span class="input-con">
                        <input type="text" id="psd1" v-model="psd1" name="psd1">
                    </span>
                </div>
                <div class="input">
                    <span class="input-title"><label for="psd2">重复密码</label></span>
                    <span class="input-con">
                        <input type="text" id="psd2" v-model="psd2" name="psd2" @blur="checkPsdSame">
                        <span v-if="psdNotSame" class="iconfont psdErr psdNotSame">密码输入不一致</span>
                    </span>
                </div>
                <div class="input">
                    <span class="input-title"><label for="newName">新用户名</label></span>
                    <span class="input-con">
                        <input type="text" id="newName" v-model="newName" name="newName">
                        <span class="marginLeft">不修改则不填</span>
                    </span>
                </div>
                <div class="input">
                    <span class="input-title"><label for="newPsd">新密码</label></span>
                    <span class="input-con">
                        <input type="text" id="newPsd" v-model="newPsd" name="newPsd" @blur="checkPsdFormat">
                        <span v-if="psdWrong" class="iconfont psdErr psdWrong">密码必须包含字母和数字</span>
                    </span>
                </div>
                {{newPsdNoErr}}
                <div class="input padding">
                    <input class="btn marginLeft" type="button" value="提交" :disabled="disable" @click="subUser">
                </div>
                <sub-ok v-bind:subData="propData" v-on:refresh="refreshPage" v-on:returnEdit="reEdit"></sub-ok>
            </form>
        </div>
    </div>
</template>

<script>
import nowPosition from '../tinyComp/NowPosition.vue'
import subOk from '../tinyComp/SubOk.vue'
import md5 from 'js-md5';
export default {
    name: "editPsd",
    components: {
        nowPosition,
        subOk
    },
    inject: ['reload'],
    data() {
        return {
            posiList: [{ url: { temp: 'editPsd' }, name: '修改管理员密码' }],
            name: '',
            newName: '',
            psd1: null,
            psd2: null,
            newPsd: '',
            psdNotSame: false,
            psdWrong: false,
            disable: true,
            propData: { showSub: false, status: 0, pageName: '修改管理员密码', router: 'editPst' },
        }
    },
    methods: {
        checkPsdSame() {
            if (this.psd1 === this.psd2 && this.psd1 !== null) {
                this.psdNotSame = false
            } else {
                this.psdNotSame = true
            }
        },
        checkPsdFormat() {
            if (!/[a-zA-Z]+/.test(this.newPsd) || !/\d+/.test(this.newPsd)) {
                this.psdWrong = true
            } else {
                this.psdWrong = false
            }
        },
        subUser() {
            this.checkPsdSame()
            this.checkPsdFormat()
            if (!this.psdWrong && !this.psdNotSame && this.name) {
                this.propData.showSub = true
                this.axios({
                    method: 'post',
                    url: '/admin/editPsd',
                    data: { name: this.name, psd: md5(this.psd1), newPsd: md5(this.newPsd), newName: this.newName }
                }).then(res => {
                    if (res.status === 200) {
                        if (res.data.myStatus === 1) {
                            this.propData.status = 1
                            this.propData.resStatus = 1
                        } else {
                            this.propData.status = 1
                            this.propData.resStatus = 2
                            this.propData.errMes = res.data.mes
                        }
                    }
                }).catch(err => {
                    this.propData.status = 1
                    this.propData.resStatus = 2
                })
            }
        },
        refreshPage() {
            this.reload()
        },
        reEdit() {
            this.propData.showSub = false
        },
    },
    computed: {
        newPsdNoErr() {
            if (this.psdWrong === true) {
                if (/[a-zA-Z]+/.test(this.newPsd) && /\d+/.test(this.newPsd)) {
                    this.psdWrong = false
                }
            }
            if (this.psd1 === this.psd2 && this.psd1 !== null) {
                this.psdNotSame = false
            }
            if (this.psdWrong || this.psdNotSame || !this.name) {
                this.disable = true
            } else {
                this.disable = false
            }

        }
    }
}
</script>

<style scoped>
.psdErr {
    color: #f00;
    display: inline;
    margin-left: 10px;
}
.psdErr::before {
    content: "\e616";
    color: #f00;
}
</style>
