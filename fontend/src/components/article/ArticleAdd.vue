<template>
    <div class="rightCon">
        <now-position v-bind:posList="posiList"></now-position>
        {{posiReady}}
        <div class="show">
            <div class="showLi" @click="conShow(0)" :class="pageShow[0]===true?'now':''">基本设置</div>
            <div class="showLi" @click="conShow(1)" :class="pageShow[1]===true?'now':''">其他设置</div>
        </div>
        <div class="ccon">
            <form method="post" name="formArticle">
                <div v-show="pageShow[0]">
                    <div class="input padding"><input class="btn marginLeft " type="button" value="提交" @click="subArt"></div>
                    <div class="input">
                        <span class="input-title"><label for="title">文章标题</label></span>
                        <span class="input-con">
                            <input type="text" :class="errInput[0]" id="title" v-model="title" name="title" size="40" @blur="checkTitle">
                            <span class="error">{{titleErrMes}}</span>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="mainTitle">主标题</label></span>
                        <span class="input-con">
                            <input type="text" id="mainTitle" v-model="mainTitle" name="mainTitle" size="40">
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="viceTitle">副标题</label></span>
                        <span class="input-con">
                            <input type="text" id="viceTitle" v-model="viceTitle" name="viceTitle" size="40">
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="picUrl">导读图片</label></span>
                        <span class="input-con">
                            <input type="text" id="picUrl" v-model="picUrl" name="picUrl" size="50">
                            <input type="button" value="上传" @click="openUpfile(1)">
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="picUrl2">导读图片2</label></span>
                        <span class="input-con">
                            <input type="text" id="picUrl2" v-model="picUrl2" name="picUrl2" size="50">
                            <input type="button" value="上传" @click="openUpfile(2)">
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title">是否启用</span>
                        <span class="input-con">
                            <input type="checkbox" v-model="isUse" name="isUse">{{isUse===true?"是":"否"}}
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title">首页显示</span>
                        <span class="input-con">
                            <input type="checkbox" v-model="isIndex" name="isIndex">{{isIndex===true?"是":"否"}}
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title">其他属性</span>
                        <span class="input-con">
                            头条显示
                            <select name="headLine" id="headLine" v-model="headLine">
                                <option value="0">非头条</option>
                                <option value="1">一级头条</option>
                                <option value="2">二级头条</option>
                                <option value="3">三级头条</option>
                                <option value="4">四级头条</option>
                                <option value="5">五级头条</option>
                            </select>
                            是否推荐
                            <select name="suggest" id="suggest" v-model="suggest">
                                <option value="0">不推荐</option>
                                <option value="1">一级推荐</option>
                                <option value="2">二级推荐</option>
                                <option value="3">三级推荐</option>
                                <option value="4">四级推荐</option>
                                <option value="5">五级推荐</option>
                            </select>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="keyword">文章关键词</label></span>
                        <span class="input-con padding">
                            <input type="text" id="keyword" v-model="keyword" name="keyword" size="50">
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="intro">文章简介</label></span>
                        <span class="input-con padding">
                            <textarea id="intro" v-model="intro" name="intro" rows="6" cols="60"></textarea>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="source">文章来源</label></span>
                        <span class="input-con">
                            <input type="text" id="source" v-model="source" name="source" >
                            <select @change="checkSource($event.target)">
                                <option value="0" >选择来源</option>
                                <template v-for="url in sourceUrlList">
                                    <option :value="url.title">{{url.title}}</option>
                                </template>
                            </select>
                            <span class="noCon">是否带连接</span><input class="noCon" type="checkbox" v-model="useSourceUrl" name="useSourceUrl">{{useSourceUrl===true?"是":"否"}}
                            <input type="button" value="增加来源" @click="addSource">
                        </span>
                    </div>
                    <div class="input" v-show="useSourceUrl">
                        <span class="input-title"><label for="sourceUrl">来源链接</label></span>
                        <span class="input-con ">
                            <input type="text" id="sourceUrl" v-model="sourceUrl" name="sourceUrl" size="40">
                            <span class="error noCon" v-show="sourceUrlFormat">来源链接格式不对(必须是完整链接带上http/https)</span>
                            {{checkSourceUrl}}
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="author">文章作者</label></span>
                        <span class="input-con">
                            <input type="text" id="author" :class="errInput[4]" v-model="author" name="author">
                            <select @change="checkAuthor($event.target.value)">
                                <option value="0" >选择作者</option>
                                <template v-for="atuhor in authorList">
                                    <option :value="atuhor">{{atuhor}}</option>
                                </template>
                            </select>
                            <input type="button" value="增加作者" @click="addAuthor">
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="content">文章内容</label></span>
                        <span class="input-con noIndent padding">
                            <!-- <input type="text" id="content" v-model="content" name="content" > -->
                            <editor v-bind:path="path" v-bind:tinyHtml="content" v-bind:cready="cComReady" v-on:edit-input="getCon"></editor>
                        </span>
                    </div>
                </div>
                <div v-show="pageShow[1]">
                    <div class="input padding"><input class="btn marginLeft " type="button" value="提交" @click="subArt"></div>
                    <div class="input">
                        <span class="input-title"><label for="outUrl">外部链接</label></span>
                        <span class="input-con">
                            <input type="text" id="outUrl" v-model="outUrl" name="outUrl" size="50">填写后将链接到此地址
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="description">文章描述</label><br>&nbsp;(用于顶部meta标签)</span>
                        <span class="input-con padding">
                            <textarea id="description" v-model="description" name="description" rows="6" cols="80"></textarea>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="hits">点击数</label></span>
                        <span class="input-con">
                            <input type="number" id="hits" v-model="hits" name="hits" min="0" size="5">
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="stars">点赞数</label></span>
                        <span class="input-con">
                            <input type="number" id="stars" v-model="stars" name="stars" min="0" size="5">
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="orderBy">排序</label></span>
                        <span class="input-con">
                            <input type="number" id="orderBy" v-model="orderBy" name="orderBy" size="5">
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="path">页面路径</label></span>
                        <span class="input-con">
                            <input type="text" id="path" v-model="path" name="path">
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="articleName">页面名字</label></span>
                        <span class="input-con">
                            <input type="text" id="articleName" v-model="articleName" name="articleName" :disabled="this.$route.act==='add'?true:false" size="10">
                        </span>
                    </div>

                    <div class="input">
                        <span class="input-title"><label for="tempName">模版</label></span>
                        <span class="input-con">
                            <select name="tempName" id="tempName" v-model="tempName" :class="errInput[2]">
                                <template v-for="contentTemp in contentTempList">
                                    <option v-bind:value="contentTemp.title" v-bind:class="contentTemp.title===tempNameDefault?'text':''">{{contentTemp.title}}</option>
                                </template>
                            </select>红色的模版名代表父级栏目默认的模版名
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="upTime">上传时间</label></span>
                        <span class="input-con">
                            <input type="text" id="upTime" v-model="upTime" >
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="lastEditTime">上次修改时间</label></span>
                        <span class="input-con">
                            <input type="text" id="lastEditTime" v-model="lastEditTime">
                        </span>
                    </div>
                </div>
                <div class="input padding"><input class="btn marginLeft " type="button" value="提交" @click="subArt"></div>
            </form>
            {{checkMustFill}}
        </div>
        <up-file v-on:get-path="savePicPath" v-show="show" :upFileShow="show" v-on:get-close="openUpfile"></up-file>
        <sub-ok v-bind:subData="propData" v-on:refresh="refreshPage" v-on:returnEdit="reEdit"></sub-ok>
    </div>
</template>

<script>
import upFile from '../tinyComp/UpFile.vue'
import editor from '../editor/Editor.vue'
import subOk from '../tinyComp/SubOk.vue'
import nowPosition from '../tinyComp/NowPosition.vue'
export default {
    name: "add-article",
    components: {
        upFile,
        editor,
        subOk,
        nowPosition
    },
    inject: ['reload'],
    data: function () {
        return {
            pageShow: [true, false],
            show1: false,
            cid: this.$route.query.cid || null,
            id: this.$route.query.id || null,
            act: this.$route.params.act || null,
            title: '',
            titleErrMes: null,
            posiColReady: false,
            posiArtReady: false,
            mainTitle: '',
            viceTitle: '',
            isIndex: false,
            isUse: true,
            headLine: 0,
            suggest: 0,
            outUrl: '',
            keyword: '',
            picUrl: '',
            picUrl2: '',
            intro: '',
            source: '',
            useSourceUrl: false,
            sourceUrl: '',
            sourceUrlList: [],
            sourceUrlFormat: false,
            author: '',
            authorList: [],
            content: '内容加载中',
            cComReady: false,
            description: null,
            hits: 0,
            stars: 0,
            orderBy: 0,
            path: '',
            articleName: '',
            tempName: null,
            tempNameDefault: null,
            contentTempList: null,
            upTime: '',
            lastEditTime: '',
            show: false,
            propData: { showSub: false, status: 0, pageName: '文章', router: 'articleList', query: { cid: this.$route.query.cid } },
            posiList: [{ name: '文章管理' }],
            errInput: ['', '', '', '', ''],
            alertMes: ['', '', '', ''],
            checkTitleIng: false,
            upFileNum: 0
        }
    },
    created: function () {
        this.axios({
            method: 'get',
            url: '/admin/getContentTempList'
        }).then(res => {
            if (res.status === 200) {
                this.contentTempList = res.data
            }
        })
        if (this.$route.params.act === 'add') {
            this.content = ''
        }
        this.axios({
            method: 'get',
            url: '/admin/getArtTemp?cid=' + this.$route.query.cid
        }).then(res => {
            if (res.status === 200) {
                this.tempNameDefault = res.data.tempContent
                if (this.act === 'add') {
                    this.propData.act = '添加'
                    this.tempName = res.data.tempContent
                    this.path = res.data.path2 === '' ? '/' + res.data.path1 : '/' + res.data.path1 + '/' + res.data.path2
                }
                else if (this.act === 'edit') {
                    this.propData.act = '编辑'
                    if (this.id) {
                        this.axios({
                            method: 'get',
                            url: '/admin/getEditArt?id=' + parseInt(this.id)
                        }).then(res => {
                            if (res.status === 200) {
                                let result = res.data
                                this.title = result.title
                                this.posiArtReady = true
                                this.mainTitle = result.mainTitle
                                this.viceTitle = result.viceTitle
                                this.isIndex = result.isIndex === 'true' ? true : false
                                this.isUse = result.isUse === 'true' ? true : false
                                this.headLine = result.headLine
                                this.suggest = result.suggest
                                this.outUrl = result.outUrl
                                this.keyword = result.keyword
                                this.picUrl = result.picUrl
                                this.picUrl2 = result.picUrl2
                                this.intro = result.intro
                                this.source = result.source
                                this.sourceUrl = result.sourceUrl
                                this.useSourceUrl = result.useSourceUrl === 'true' ? true : false
                                this.author = result.author
                                this.content = result.content
                                this.cComReady = true
                                this.description = result.description
                                this.hits = result.hits
                                this.stars = result.stars
                                this.orderBy = result.orderBy
                                this.path = result.path
                                this.articleName = result.articleName
                                this.tempName = result.tempName
                                this.upTime = result.upTime
                                this.lastEditTime = result.lastEditTime
                            }
                        })
                    }
                    else {
                        console.log('文章ID不正确！')
                    }
                }
            }
        })
        this.axios({
            method: 'get',
            url: '/admin/getNowArticle?cid=' + this.$route.query.cid
        }).then(res => {
            if (res.status === 200) {
                this.posiList = this.posiList.concat(res.data);
                this.posiColReady = true
                if (this.$route.params.act === 'add') {
                    this.posiList.push({ name: '添加文章' })
                } else if (this.$route.params.act === 'edit') {
                    this.posiList.push({ name: '编辑文章' })
                }
            }
        })
        this.axios({
            url: '/admin/getAuthorList'
        }).then(res => {
            if (res.status === 200) {
                this.authorList = res.data
                this.author = this.authorList.length > 0 && this.authorList[0] !== '还没有添加作者' ? this.authorList[this.authorList.length - 1] : ''
            }
        })
        this.axios({
            url: '/admin/getSourceUrlList'
        }).then(res => {
            if (res.status === 200) {
                this.sourceUrlList = res.data
                this.source = this.sourceUrlList.length > 0 && this.sourceUrlList[0].title !== '还没有添加来源' ? this.sourceUrlList[this.sourceUrlList.length - 1].title : ''
                this.sourceUrl = this.sourceUrlList.length > 0 && this.sourceUrlList[0].title !== '还没有添加来源' ? this.sourceUrlList[this.sourceUrlList.length - 1].url : ''
                this.useSourceUrl = this.sourceUrl ? true : false
            }
        })
    },
    methods: {
        subArt() {
            if (this.checkTitleIng) {
                setTimeout(() => { this.subArt() }, 200)
                return
            }
            if (!this.title) {
                this.alertMes[0] = "文章不能没有标题！"
                this.$set(this.errInput, 0, 'errInput')
            }
            if (!this.content) {
                this.alertMes[1] = "文章不能没有内容！"
                this.$set(this.errInput, 1, 'errInput')
            }
            if (!this.tempName) {
                this.alertMes[2] = "文章不能没有模版！"
                this.$set(this.errInput, 2, 'errInput')
            }
            if (this.useSourceUrl && this.sourceUrlFormat) {
                this.alertMes[3] = "要使用来源链接的话，必须正确填写链接!"
                this.$set(this.errInput, 3, 'errInput')
            }
            if (this.alertMes[0] !== '' || this.alertMes[1] !== '' || this.alertMes[2] !== '' || this.alertMes[3] !== '') {
                alert(this.alertMes)
            } else {
                let url, formData = new FormData(formArticle)
                this.propData.showSub = true
                if (formData.get('isUse') !== 'on') {
                    formData.append('isUse', 'off')
                }
                if (formData.get('isIndex') !== 'on') {
                    formData.append('isIndex', 'off')
                }
                if (formData.get('useSourceUrl') !== 'on') {
                    formData.append('useSourceUrl', 'off')
                }
                if (this.act === 'add') {
                    url = '/admin/upArticle?act=' + this.act + '&cid=' + this.cid
                }
                else if (this.act === 'edit') {
                    url = '/admin/upArticle?act=' + this.act + '&id=' + this.id
                }
                formData.set('content', this.content)
                this.axios({
                    method: 'post',
                    url: url,
                    data: formData
                }).then(res => {
                    if (res.status === 200) {
                        const webset = this.$store.state.webSetting
                        this.propData.status = 1
                        const insertId = res.data.id || this.id
                        this.propData.resStatus = res.data.err ? 2 : 1
                        this.propData.err = res.data.err || ''
                        if (webset.buildArt === 1) {
                            this.$set(this.propData, 'build', { status: 2, name: '文章' }) //准备生成
                            this.axios({
                                url: '/admin/withBuildArt?id=' + insertId
                            }).then(res1 => {
                                if (res1.status === 200) {
                                    if (res1.data.myStatus === 1) {
                                        this.$set(this.propData, 'build', { status: 1, name: '文章', id: insertId })   //生成成功
                                    } else {
                                        this.$set(this.propData, 'build', { status: 0, name: '文章', id: insertId })  //生成失败
                                    }
                                    if (webset.buildFaArt === 1) {
                                        this.axios({
                                            url: '/admin/buildFaArt?id=' + insertId,
                                            method: 'get'
                                        }).then(res2 => {
                                            if (res2.status === 200) {
                                                if (res2.data.myStatus === 1) {
                                                    this.$set(this.propData, 'build', { status: 1, name: '父栏目', id: res2.data.colId })
                                                    const buildFaCol = (cid) => {
                                                        this.axios({
                                                            url: '/admin/buildFaCol?cid = ' + cid
                                                        }).then(result => {
                                                            if (result.status === 200) {
                                                                if (result.data.myStatus === 1) {
                                                                    this.$set(this.propData, 'build', { status: 1, name: '父栏目', id: result.data.colId })
                                                                    if (result.data.aid !== 0) buildFaCol(result.data.aid)
                                                                } else {
                                                                    this.$set(this.propData, 'build', { status: 0, name: '父栏目', id: result.data.colId })
                                                                }
                                                            }
                                                        })
                                                    }
                                                    if (res2.data.aid !== 0) buildFaCol(res2.data.aid)
                                                } else {
                                                    this.$set(this.propData, 'build', { status: 0, name: '父栏目', id: res2.data.colId })
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                }).catch(err => {
                    this.propData.status = 1
                    this.propData.resStatus = 2
                })
            }
        },
        conShow(n) {
            this.pageShow = this.pageShow.map((ele, i) => {
                if (n === i) {
                    return true
                } else {
                    return false
                }
            })
        },
        addAuthor() {
            if (!this.author) {
                alert("作者为空!")
                this.$set(this.errInput, 4, 'errInput')
            } else {
                this.axios({
                    url: '/admin/upAuthor?author=' + this.author
                }).then(res => {
                    if (res.status === 200) {
                        if (res.data.myStatus === 1) {
                            if (this.authorList[0] !== '还没有添加作者') {
                                this.authorList.unshift(this.author)
                            } else {
                                this.$set(this.authorList, 0, this.author)
                            }
                        }
                        else if (res.data.myStatus === 2) {
                            alert("该作者已经存在!")
                        }
                        else {
                            alert('添加失败！')
                        }
                    }
                }).catch(err => {
                    console.log(err);
                    alert('添加失败！')
                })
            }
        },
        checkAuthor(value) {
            if (value !== "0" && value !== '还没有添加作者') {
                this.author = value
            } else {
                this.author = null
            }
        },
        checkSource(e) {
            if (e.value !== "0" && e.value !== '还没有添加来源') {
                this.source = e.value
                this.sourceUrl = this.sourceUrlList[e.selectedIndex - 1].url
            } else {
                this.source = null
                this.sourceUrl = null
            }
        },
        checkTitle() {
            this.checkTitleIng = true
            if (!this.title) {
                this.titleErrMes = '请输入标题!'
                this.alertMes[0] = "文章不能没有标题！"
                this.$set(this.errInput, 0, 'errInput')
            } else {
                this.axios({
                    method: 'post',
                    url: '/admin/checkArtTitle',
                    data: { title: this.title, cid: this.cid }
                }).then(res => {
                    if (res.status === 200) {
                        if (res.data.myStatus === 1 && this.act === 'add') {
                            this.titleErrMes = '该标题此栏目下已经存在!'
                            this.alertMes[0] = "该标题此栏目下已经存在"
                            this.$set(this.errInput, 0, 'errInput')
                        } else {
                            this.titleErrMes = null
                            this.alertMes[0] = ""
                            this.$set(this.errInput, 0, '')
                        }
                        this.checkTitleIng = false
                    }
                })
            }
        },
        addSource() {
            if (!this.source) {
                alert('请正确填写来源!')
            }
            else if (this.useSourceUrl && this.sourceUrlFormat) {
                alert('要添加来源链接的话，必须正确填写链接!')
            }
            else {
                this.axios({
                    method: 'post',
                    url: '/admin/postSource',
                    data: { title: this.source, url: this.sourceUrl }
                }).then(res => {
                    if (res.status === 200) {
                        const result = res.data
                        if (result.exist) {
                            alert('该来源名称和链接已经存在!')
                        }
                        else if (result.myStatus === 0) {
                            alert('添加来源失败，服务器或者程序问题!')
                        } else {
                            if (this.sourceUrlList[0].title !== '还没有添加来源') {
                                this.sourceUrlList.unshift({ title: this.source, url: this.sourceUrl })
                            } else {
                                alert('添加成功！')
                                this.$set(this.sourceUrlList, 0, { title: this.source, url: this.sourceUrl })
                            }
                        }
                    }
                }).catch(err => {
                    console.log(err);
                    alert('添加来源失败，服务器或者程序问题!')
                })
            }
        },
        openUpfile(num) {
            this.upFileNum = num
            this.show = !this.show;
        },
        savePicPath(path) {
            if (this.upFileNum === 1) {
                this.picUrl = '/' + path
            } else {
                this.picUrl2 = '/' + path
            }
            this.show = false
        },
        // goLink(cid){
        //     this.$router.push({name:'articleList', query:{cid:cid}})
        // },
        getCon(e) {
            this.content = e
        },
        refreshPage() {
            this.reload()
        },
        reEdit() {
            this.propData.showSub = false
        },
    },
    computed: {
        posiReady() {
            if (this.posiColReady && this.posiArtReady) {
                this.posiList.push({ name: this.title })
                this.posiArtReady = false
            }
        },
        checkMustFill() {
            if (this.title && !this.titleErrMes) {
                this.$set(this.errInput, 0, '')
                this.alertMes[0] = ''
            }
            if (this.content) {
                this.$set(this.errInput, 1, '')
                this.alertMes[1] = ''
            }
            if (this.tempName) {
                this.$set(this.errInput, 1, '')
                this.alertMes[2] = ''
            }
            if (this.author) {
                this.$set(this.errInput, 4, '')
            }
        },
        checkSourceUrl() {
            const regexp = /^http[s]*?\:\/\/[a-zA-Z]*\.?[a-zA-Z]+?[a-zA-Z\-]*\.[a-zA-Z]|^http[s]*?\:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$|^http[s]*?\:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}[\:\/]/
            if (regexp.exec(this.sourceUrl)) {
                this.sourceUrlFormat = false
                this.alertMes[3] = ''
            } else {
                this.sourceUrlFormat = true
            }
        }
    }
}
</script>

<style scoped>
.rigth-content {
    border: 1px solid #000;
    position: relative;
}
.text {
    color: #f00;
}
.error {
    color: #f00;
}
.errInput {
    border: 1px solid #f00;
}
</style>