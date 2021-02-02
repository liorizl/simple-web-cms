<template>
    <div class="rightCon">
        <now-position v-bind:posList="posiList"></now-position>
        <input class="btn" type="button" value="添加文章" @click="goAdd(cid)">
        <ul class="artList" >
            <li>
                <span class="checkbox"></span>
                <span class="id">ID</span>
                <span class="havePic"></span>
                <span class="title">标题</span>
                <span class="uptime">上传时间</span>
                <span class="hit">点击</span>
                <span class="star">点赞</span>
                <span class="operate">操作</span>
            </li>
            <template v-if="articleList&&articleList.length!=0&&Array.isArray(articleList)">
                <template >
                    <li v-for="(article, index) in articleList">
                        <span class="checkbox"><input type="checkbox" :value="article.id" v-model="checkArt"></span>
                        <span class="id">{{article.id}}</span>
                        <span class="havePic" :class="article.picUrl ? ['picIcon', 'iconfont'] : ''"></span>
                        <span class="title isLink" :class="article.isUse==='false'?'notUse':''" @click="showArticle(article.id, index)">
                            {{article.title.length > 22 ? article.title.substr(0, 20) : article.title}}
                        </span>
                        <span class="uptime">{{article.upTime}}</span>
                        <span class="hit">{{article.hits}}</span>
                        <span class="star">{{article.stars}}</span>
                        <span class="operate">
                            <span @click="editArt(article.id, $route.query.cid)" class="edit">编辑文章</span> | 
                            <span @click='deleArt(article.id, article.title)' class="dele">删除文章</span>
                        </span>
                    </li>
                </template>
            </template>
            <li v-else-if="articleList&&articleList.length!=0&&!Array.isArray(articleList)">{{articleList}}</li>
            <li v-else class="noCon">还没有文章！</li>
        </ul>
        <div class="bar">
            <div class="copy">
                <input type="checkbox" v-model="checkAll" @change="showCheck">{{checkAll?'全不选':'全选'}}
                将所选文章
                <select v-model="copyAct" @change="checkIsDele">
                    <option value="copy">复制</option>
                    <option value="cut">剪切</option>
                    <option value="dele">删除</option>
                </select>
                <template v-if="!isDele">
                    到
                    <select v-model="copyToIndex">
                        <template v-if="colListArr.length>0">
                            <option disabled :value="0">请选择</option>
                            <template v-for="(col, index) in colListArr">
                                <option :value="index + 1">{{col.title}}</option>
                            </template>
                        </template>
                        <template v-else>
                            <option>加载中...</option>
                        </template>
                    </select>
                </template>
                <input type="button" value="执行" @click="goCopy">
            </div>
            <page-nation v-bind:pageMessage="pageMes" v-on:pageT="pageTurn"></page-nation>
        </div>
        <sub-ok v-bind:subData="propData" v-on:refresh="refreshPage"></sub-ok>
    </div>
</template>

<script>
import nowPosition from '../tinyComp/NowPosition.vue'
import subOk from '../tinyComp/SubOk.vue'
import pageNation from '../tinyComp/MyPagination.vue'
import util from '../../../static/util.js'
export default {
    name: "article-list",
    components: {
        nowPosition,
        subOk,
        pageNation
    },
    inject: ['reload'],
    data: function () {
        return {
            cid: this.$route.query.cid,
            articleList: '加载中...',
            num: 10,
            sum: null,
            copyAct: 'copy',
            checkArt: [],
            copyToIndex: 0,
            isDele: false,
            checkAll: false,
            nowPage: parseInt(this.$route.query.page) || null,
            posiList: [{ name: '文章管理' }],
            pageMes: { status: 0 },
            propData: { showSub: false, status: 0, pageName: '文章' },
            colList: [],
            colListArr: []
        }
    },
    created: function () {
        this.num = this.$store.state.webSetting.listNum
        this.colListArr = this.$store.getters.getColArr
        this.getArtList()
    },
    watch: {
        '$route'(to, from) {
            this.getArtList()
            this.checkArt = []
            this.checkAll = false
        }
    },
    computed: {
    },
    methods: {
        getArtList() {
            this.cid = parseInt(this.$route.query.cid)
            const url = !this.$route.query.page ?
                '/admin/getArtList?cid=' + this.cid + '&num=' + this.num :
                '/admin/getArtList?cid=' + this.cid + '&num=' + this.num + '&page=' + this.$route.query.page
            this.axios({
                method: 'get',
                url: url
            }).then(res => {
                if (res.status === 200) {
                    this.articleList = res.data.result
                    this.sum = res.data.sum
                    this.pageMes = {
                        num: this.num,
                        page: parseInt(this.$route.query.page) || 1,
                        sum: res.data.sum,
                        pageNum: Math.ceil(res.data.sum / this.num),
                        status: 1
                    }
                }
            })
            this.axios({
                method: 'get',
                url: '/admin/getNowArticle?cid=' + this.cid
            }).then(res => {
                if (res.status === 200) {
                    this.posiList = [this.posiList[0]].concat(res.data)
                    this.posiList.push({ name: '文章列表' })
                }
            })
        },
        goAdd(cid) {
            if (cid) {
                this.$router.push({ name: 'articleAdd', query: { cid: cid }, params: { act: 'add' } })
            } else {
                alert('请在左边选择栏目！')
            }
        },
        editArt(id, cid) {
            this.$router.push({ name: 'articleAdd', query: { id: id, cid: cid }, params: { act: 'edit' } })
        },
        deleArt(id, title) {
            this.propData.act = "删除"
            if (confirm("确定删除？\r\nid:" + id + "标题:" + title)) {
                this.propData.showSub = true
                const table = 'article' //数据表名
                this.axios({
                    method: 'get',
                    url: '/admin/dele?table=' + table + '&id=' + id
                }).then(res => {
                    if (res.status === 200) {
                        if (res.data.myStatus === 1) {
                            this.propData.status = 1
                            this.propData.resStatus = 1
                        } else {
                            this.propData.status = 1
                            this.propData.resStatus = 2
                        }
                    }
                }).catch(err => {
                    this.propData.status = 1
                    this.propData.resStatus = 2
                })
            }
        },
        showArticle(id, index) {
            let url
            const webSet = this.$store.state.webSetting
            const pagePath = webSet.pagePath === '/' ? '' : webSet.pagePath
            url = parseInt(webSet.pageModel) === 1 ?
                util.repalceStr(webSet.webUrl) + pagePath + util.repalceStr2(this.articleList[index].path) + this.articleList[index].articleName + '.html' :
                'http://' + webSet.hostName + ':' + webSet.backendPort + '/showArticle?id=' + id
            window.open(url);
        },
        goLink(cid) {
            this.$router.push({ name: 'articleList', query: { cid: cid } })
        },
        refreshPage() {
            this.num = this.$store.state.webSetting.listNum
            this.colListArr = this.$store.getters.getColArr
            this.getArtList()
            this.propData.showSub = false
        },
        pageTurn(e) {
            this.$router.push({ name: 'articleList', query: { cid: this.$route.query.cid, page: e } })
        },
        goCopy() {
            let action, updata
            if (this.copyAct === 'copy') {
                action = '复制'
            } else if (this.copyAct === 'cut') {
                action = '剪切'
            } else {
                action = '删除'
            }
            if (this.checkArt.length === 0) {
                alert('请选择要' + action + '的文章!')
                return
            }
            if (this.copyAct === 'dele' && this.checkArt.length > 1) {
                if (!confirm('确定要删除？')) {
                    return
                }
            }
            if (this.copyAct === 'dele' && this.checkArt.length === 1) {
                let title, id = this.checkArt[0]
                this.articleList.forEach(art => {
                    if (art.id === id) {
                        title = art.title
                    }
                })
                this.deleArt(id, title)
            } else {
                if (this.copyToIndex === 0 && this.copyAct !== 'dele') {
                    alert('请选择要' + action + '到的栏目!')
                    return
                }
                if (this.copyAct === 'dele') {
                    updata = {
                        act: this.copyAct,
                        artid: this.checkArt
                    }
                } else {
                    const nowCopyIndex = this.colListArr[this.copyToIndex - 1]
                    const copyToCid = nowCopyIndex.cid
                    const ultimate = nowCopyIndex.ultimate
                    if (parseInt(copyToCid) === this.cid) {
                        alert('不能' + action + '到当前栏目，这样会造成文章标题和文件名重复!')
                        return
                    }
                    if (ultimate === 'false') {
                        if (!confirm('所选栏目非终极栏目，\r\n要查看需要将栏目设为终极栏目,\r\n确定要' + action + '?')) {
                            return
                        }
                    }
                    updata = {
                        act: this.copyAct,
                        artid: this.checkArt,
                        cid: copyToCid
                    }
                }
                this.propData.act = action
                this.propData.showSub = true
                this.axios({
                    method: 'post',
                    url: '/admin/copyArt',
                    data: updata
                }).then(res => {
                    if (res.status === 200) {
                        if (res.data.myStatus === 1) {
                            this.propData.copy = { num: res.data.num }
                            this.propData.status = 1
                            this.propData.resStatus = 1
                        } else {
                            this.propData.copy = { errMes: res.data.errMes }
                            this.propData.status = 1
                            this.propData.resStatus = 2
                        }
                    }
                }).catch(err => {
                    this.propData.copy = { errMes: err }
                    this.propData.status = 1
                    this.propData.resStatus = 2
                })
            }
        },
        showCheck() {
            if (this.checkAll) {
                this.checkArt = this.articleList.map(art => {
                    return art.id
                })
            } else {
                this.checkArt = []
            }
        },
        checkIsDele() {
            this.isDele = this.copyAct === 'dele' ? true : false
        }
    }
}
</script>

<style lang="less" scoped>
ul li {
    display: flex;
}
</style>