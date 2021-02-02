<template>
    <div class="banner ccon">
        <form name="formBanner">
            <div class="input">
                <span class="input-title"><label for="title">标题</label></span>
                <span class="input-con">
                    <input type="text"  id="title" v-model="title" name="title" size="40">
                    <span class="error"></span>
                </span>
            </div>
            <div class="input">
                <span class="input-title"><label for="isUse">是否启用</label></span>
                <span class="input-con">
                    <input type="checkbox" v-model="isUse" name="isUse">{{isUse===true?"是":"否"}}
                </span>
            </div>
            <div class="input">
                <span class="input-title"><label for="pcUrl">图片地址(电脑)</label></span>
                <span class="input-con">
                    <input type="text"  id="pcUrl" v-model="pcUrl" name="pcUrl" size="60">
                    <input type="button" value="上传" @click="openUpfile('pc')">
                </span>
                
            </div>
            <div class="input">
                <span class="input-title"><label for="wapUrl">图片地址(手机)</label></span>
                <span class="input-con">
                    <input type="text"  id="wapUrl" v-model="wapUrl" name="wapUrl" size="60">
                    <input type="button" value="上传"  @click="openUpfile('wap')">
                </span>
            </div>
            <div class="input">
                <span class="input-title"><label for="pcLink">链接地址(电脑)</label></span>
                <span class="input-con">
                    <input type="text"  id="pcLink" v-model="pcLink" name="pcLink" size="60">
                    <span @click="viewLink(pcLink)" style="cursor:pointer">查看链接</span>
                </span>
            </div>
            <div class="input">
                <span class="input-title"><label for="wapLink">链接地址(手机)</label></span>
                <span class="input-con">
                    <input type="text"  id="wapLink" v-model="wapLink" name="wapLink" size="60">
                    <span @click="viewLink(wapLink)" style="cursor:pointer">查看链接</span>
                </span>
            </div>
            <div class="input">
                <span class="input-title"><label for="orderBy">排序</label></span>
                <span class="input-con">
                    <input type="text"  id="orderBy" v-model.number="orderBy" name="orderBy" size="2">
                </span>
            </div>
            <div class="input" v-if="$route.params.act === 'edit'">
                <span class="input-title"><label for="upTime">添加时间</label></span>
                <span class="input-con">
                    <input type="text"  id="upTime" v-model="upTime" name="upTime" size="20">
                </span>
            </div>
            <div class="input ">
                <input class="btn input-sub" type="button" value="提交" @click="submit">
            </div>
            <up-file @get-path="savePicPath" :colCid="colCid" :terminal="terminal" :upFileShow="show" v-show="show" @get-close="closeUpfile"></up-file>
            <sub-ok :subData="propData" @refresh="refreshPage" @returnEdit="reEdit"></sub-ok>
        </form>
    </div>
</template>

<script>
import upFile from '../../tinyComp/UpFile.vue'
import subOk from '../../tinyComp/SubOk.vue'
export default {
    name: "banner-add",
    components: {
        upFile,
        subOk
    },
    inject: ['reload'],
    data() {
        return {
            title: null,
            isUse: true,
            pcUrl: null,
            wapUrl: null,
            pcLink: null,
            wapLink: null,
            orderBy: 0,
            upTime: null,
            show: false,
            terminal: null,
            colCid: 'banner',
            propData: { showSub: false, status: 0, pageName: 'banner', router: 'bannerList', query: { id: this.$route.query.id } },
        }
    },
    created() {
        if (this.$route.query.act === 'edit') {
            this.axios({
                url: '/admin/getBannerEdit?id=' + this.$route.query.id
            }).then(res => {
                if (res.status === 200) {
                    const resData = res.data
                    this.title = resData.title
                    this.isUse = resData.isuse === 'true'? true : false
                    this.pcUrl = resData.pcurl
                    this.wapUrl = resData.wapurl
                    this.pcLink = resData.pclink
                    this.wapLink = resData.waplink
                    this.orderBy = resData.orderby
                    this.upTime = resData.uptime
                }
            })
        }
    },
    methods: {
        savePicPath(path, terminal) {
            if (terminal === 'wap') {
                this.wapUrl = path
            } else if (terminal === 'pc') {
                this.pcUrl = path
            } 
            this.show = false
        },
        openUpfile(terminal) {
            this.colCid = terminal
            this.terminal = terminal
            this.show = !this.show
        },
        closeUpfile() {
            this.show = !this.show
        },
        submit() {
            // if (!this.title) {
            //     alert('请输入标题！')
            //     return
            // }
            // if (!this.pcUrl) {
            //     alert('请输入PC端图片路径！')
            //     return
            // }
            this.propData.showSub = true
            let formData = new FormData(formBanner)
            const act = this.$route.query.act === 'add' ?
                            '添加':
                            '编辑'
            formData.set('isUse', this.isUse.toString())
            const url = this.$route.query.act === 'add' ?
                        '/admin/upBanner?act=add' :
                        '/admin/upBanner?act=edit&id=' + this.$route.query.id
           this.axios({
               method: 'post',
               data: formData,
               url
           }).then(res => {
               if (res.status === 200) {
                    if (res.data.upStatus === 1) {
                        this.propData.act = act
                        this.propData.status = 1
                        this.propData.resStatus = 1
                    }
               }
           }).catch(err => {
                this.propData.status = 1
                this.propData.resStatus = 2
           })
        },
        refreshPage() {
            this.reload()
        },
        reEdit() {
            this.propData.showSub = false
        },
        viewLink(picUrl) {
            const webSetting = this.$store.state.webSetting
            const url = 'http://' + webSetting.hostName + ':' +webSetting.backendPort + '/' + picUrl
            window.open(url);
        }
    }
}
</script>
<style lang="less"  scoped>
.input-sub {
    margin: 20px 20px;
}
</style>