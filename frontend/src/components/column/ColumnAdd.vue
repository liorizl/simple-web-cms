<template>
   <div class="rightCon">
       <now-position v-bind:posList="posiList"></now-position>
       <div class="show">
            <div class="showLi" @click="conShow(0)" :class="pageShow[0]===true?'now':''">基本设置</div>
            <div class="showLi" @click="conShow(1)" :class="pageShow[1]===true?'now':''">其他设置</div>
        </div>
       <div class="ccon">
            <form  method="post" name="formCol">
                <div v-show="pageShow[0]">
                    <div class="input">
                        <span class="input-title"><label for="colName">栏目名称：</label></span>
                        <span class="input-con">
                            <input type="text" :class="errInput[0]" id="colName" v-model="colName" name="colName" @input="getColNamePin">
                        </span>
                    </div>{{checkMustFill}}
                    <div class="input">
                        <span class="input-title"><label for="colNamePin">栏目别名：</label></span>
                        <span class="input-con">
                            <input type="text" id="colNamePin" v-model="colNamePin" name="colNamePin" @input="getNewPath" @change="checkAlias">
                            <input type="radio" id="radio1" v-model="indexPinYin" value="1" /><label for="radio1">单拼</label>
                            <input type="radio" id="radio2" v-model="indexPinYin" value="2" /><label for="radio2">全拼</label>
                            <span style="color:red">{{aliasErrMes}}</span>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="selectOpt">所属栏目：</label></span>
                        <span class="input-con padding">
                            <select  v-bind:size="(colListArr.length+1) < 15 ? (colListArr.length+1) : 15" v-model:number="position" id="selectOpt" name="position" @change="selChange($event)">
                                <option :value="0" >根目录</option>
                                <template v-for="col in colListArr">
                                    <option :value="col.cid">{{col.title}}</option>
                                </template>
                            </select>
                            <span class="errMes" v-show="ultimateErr">终极栏目下不能再添加栏目</span>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="ultimate">是否终极栏目：</label></span>
                        <span class="input-con">
                            <input type="checkbox" id="ultimate" v-model="ultimate" name="ultimate" v-bind:disabled="ultimateDisable" />{{this.ultimate===true?'是':'否'}}{{checkUltimateDisable}}
                            <span class="notice" title="只有终极栏目下可以添加文章(非终极栏目下的文章可能不会显示)，有子栏目的栏目不能设置为终极栏目,终极栏目不能选择封面式模版">非终极栏目下的文章可能会不显示，有子栏目的栏目不能设置为终极栏目,终极栏目不能选择封面式模版</span>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title">栏目存放目录:</span>
                        <span class="input-con">
                            根目录/<input type="text" v-model="path1" name="path1" />/<input type="text" v-model="path2" name="path2" />
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="colImg">栏目图片：</label></span>
                        <span class="input-con">
                            <input type="text" id="colImg" v-model="colImg" name="colImg" size="50" />
                            <input type="button" value="上传" @click="openUpfile">
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="keyword">栏目关键词：</label></span>
                        <span class="input-con">
                            <input type="text" id="keyword" v-model="keyword" name="keyword" size="60" />
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="describe">栏目简介:</label></span>
                        <span class="input-con padding">
                            <textarea id="describe" v-model="describe" name="describe" rows="6" cols="60"></textarea>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="hits">栏目点击数：</label></span>
                        <span class="input-con">
                            <input type="number" id="hits" v-model="hits" name="hits" min="-10000" max="10000000" />
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="orderBy">栏目排序：</label></span>
                        <span class="input-con">
                            <input type="number" id="orderBy" v-model="orderBy" name="orderBy" min="-10000" max="10000000" />
                        </span>
                    </div>
                </div>
                <div v-show="pageShow[1]">
                    <div class="input">
                        <span class="input-title"><label for="isUse">是否启用：</label></span>
                        <span class="input-con">
                            <input type="checkbox" id="isUse" v-model="isUse" name="isUse" />
                            {{this.isUse===true?'是':'否'}}
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="colName">显示到导航：</label></span>
                        <span class="input-con">
                            <input type="checkbox" id="isNav" v-model="isNav" name="isNav" />
                            {{this.isNav===true?'是':'否'}}
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="suggest">栏目推荐：</label></span>
                        <span class="input-con">
                            <select name="suggest" id="suggest" v-model="suggest">
                                <option :value.number="0">不推荐</option>
                                <option :value.number="1">一级推荐</option>
                                <option :value.number="2">二级推荐</option>
                                <option :value.number="3">三级推荐</option>
                                <option :value.number="4">四级推荐</option>
                                <option :value.number="5">五级推荐</option>
                            </select>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="outUrl">地址重定向：</label></span>
                        <span class="input-con">
                            <input type="text" id="outUrl" v-model="outUrl" name="outUrl" size="40" />
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title">模版类别:</span>
                        <span class="input-con">
                            <input type="radio" id="tempMode1" v-model.number="tempMode" name="tempMode" value="1" /><label for="tempMode1">封面式</label>
                            <input type="radio" id="tempMode2" v-model.number="tempMode" name="tempMode" value="2" /><label for="tempMode2">列表式</label>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="coverTemp">封面模版：</label></span>
                        <span class="input-con">
                            <select id="coverTemp" v-model="coverTemp" name="coverTemp" :class="errInput[1]">
                                <template v-if="coverTempList && coverTempList.length > 0">
                                    <option v-for="coverTemp in coverTempList" v-bind:value="coverTemp.title">{{coverTemp.title}}</option>
                                </template>
                                <template v-else-if="coverTempList && coverTempList.length === 0">
                                    <option  value="还没有封面模版" disabled>还没有封面模版</option>
                                </template>
                            </select>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="listTemp">列表模版：</label></span>
                        <span class="input-con">
                        <select id="listTemp" v-model="listTemp" name="listTemp" :class="errInput[1]">
                                <template v-if="listTempList && listTempList.length > 0">
                                    <option v-for="listTemp in listTempList" v-bind:value="listTemp.title">{{listTemp.title}}</option>
                                </template>
                                <template v-else-if=" listTempList && listTempList.length === 0">
                                    <option  value="还没有列表模版" disabled>还没有列表模版</option>
                                </template>
                            </select>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="listTempInClass">所属栏目列表模版：</label></span>
                        <span class="input-con">
                            <select id="listTempInClass" v-model="listTempInClass" name="listTempInClass">
                                <template v-for="listTemp in listTempList">
                                    <option v-bind:value="listTemp.title" :class="listTemp.title===listTempInClassDefault?'defaultTemp':''">{{listTemp.title}}</option>
                                </template>
                            </select><span class="noCon">红色的模版名代表{{this.act==='添加栏目'?'所选':'父级'}}栏目默认的模版名</span> 
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="contentTemp">所属栏目内容模版：</label></span>
                        <span class="input-con">
                            <select id="contentTemp" v-model="contentTemp" name="contentTemp">
                                <template v-for="contentTemp in contentTempList">
                                    <option v-bind:value="contentTemp.title" :class="contentTemp.title===contentTempDefault?'defaultTemp':''">{{contentTemp.title}}</option>
                                </template>
                            </select><span class="noCon">红色的模版名代表{{this.act==='添加栏目'?'所选':'父级'}}栏目默认的模版名</span>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="extend">扩展名：</label></span>
                        <span class="input-con">
                            <input type="text" id="extend" v-model="extend" name="extend" />
                        </span>
                    </div>
                    <div class="input red">*以下设置均无效，页面模式在网站设置里面设置，其他选项在标签调用里设置.</div>
                    <div class="input">
                        <span class="input-title">列表页模式：</span>
                        <span class="input-con">
                            <input type="radio" id="listActive1" v-model="listActive" name="listActive" value="1" /><label for="listActive1">静态列表页</label>
                            <input type="radio" id="listActive2" v-model="listActive" name="listActive" value="2" /><label for="listActive2">动态列表页</label>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title">内容页模式：</span>
                        <span class="input-con">
                            <input type="radio" id="contentActive1" v-model="contentActive" name="contentActive" value="1" /><label for="contentActive1">静态内容页</label>
                            <input type="radio" id="contentActive2" v-model="contentActive" name="contentActive" value="2" /><label for="contentActive2">动态内容页</label>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title">内容排序方式：</span>
                        <span class="input-con">
                            <input type="text" v-model="contentOrder" name="contentOrder" />
                                <select @change="getOrder($event, 0, 'contentOrder')">
                                    <option checked value="id desc">ID降序</option>
                                    <option value="id asc">ID升序</option>
                                </select>
                                <select @change="getOrder($event, 1, 'contentOrder')">
                                    <option checked value="hit desc">点击降序</option>
                                    <option value="hit asc">点击升序</option>
                                </select>
                                <select @change="getOrder($event, 2, 'contentOrder')">
                                    <option checked value="upDate desc">添加时间降序</option>
                                    <option value="upDate asc">添加时间升序</option>
                                </select>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title">栏目排序方式：</span>
                        <span class="input-con">
                            <input type="text" v-model="listOrder" name="listOrder" />
                            <select @change="getOrder($event, 0, 'listOrder')">
                                <option checked value="id desc">ID降序</option>
                                <option value="id asc">ID升序</option>
                            </select>
                            <select @change="getOrder($event, 1, 'listOrder')">
                                <option checked value="hit desc">点击降序</option>
                                <option value="hit asc">点击升序</option>
                            </select>
                            <select @change="getOrder($event, 2, 'listOrder')">
                                <option checked value="upDate desc">添加时间降序</option>
                                <option value="upDate asc">添加时间升序</option>
                            </select>{{checkOrderBy}}
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="showNum">显示总条数：</label></span>
                        <span class="input-con">
                            <input type="number" id="showNum" v-model:number="showNum" name="showNum" min="0" max="100"  />
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="pageNum">每页显示条数：</label></span>
                        <span class="input-con">
                            <input type="number" id="pageNum" v-model:number="pageNum" name="pageNum" min="0" max="100" />
                        </span>
                    </div>
                </div>
                <div class="input padding"><input class="btn marginLeft " type="button" value="提交" @click="subCol"></div>
            </form>
       </div>
        <up-file v-on:get-path="savePicPath" v-show="show" :colCid="cid" :upFileShow="show" v-on:get-close="openUpfile"></up-file>
       <sub-ok v-bind:subData="propData" v-on:refresh="refreshPage" v-on:returnEdit="reEdit"></sub-ok>
   </div>
</template>

<script>
import pinyin from "pinyin";
import subOk from '../tinyComp/SubOk.vue'
import upFile from '../tinyComp/UpFile.vue'
import nowPosition from '../tinyComp/NowPosition.vue'
export default {
    name: "column-add",
    components: {
        subOk,
        upFile,
        nowPosition
    },
    inject: ['reload'],
    data: function () {
        return {
            pageShow: [true, false],
            show: false,
            act: '',
            aid: '',
            cid: null,
            positionIndex: 0,
            colName: '',
            colList: '',
            colListArr: '',
            colNamePin: '',
            optSize: 5,
            indexPinYin: 1,
            ultimate: false,
            ultimateDisable: false,
            ultimateErr: false,
            position: 0,
            path1: '',
            path2: '',
            colImg: '',
            keyword: '',
            describe: '',
            hits: 0,
            orderBy: 0,
            isUse: true,
            isNav: true,
            suggest: 0,
            outUrl: '',
            tempMode: 1,
            coverTemp: null,
            listTemp: null,
            contentTemp: null,
            coverTempList: null,
            listTempList: null,
            listTempInClass: null,
            listTempInClassDefault: null,
            contentTempDefault: null,
            contentTempList: null,
            listActive: 1,
            contentActive: 1,
            contentOrder: 'id desc,',
            listOrder: 'id desc,',
            contentOrderArr: new Array(3),
            listOrderArr: new Array(3),
            extend: '.html',
            showNum: 0,
            pageNum: 0,
            propData: { showSub: false, status: 0, pageName: '栏目', router: 'columnList' },
            posiList: [{ url: { temp: 'columnList' }, name: '栏目列表' }],
            errInput: ['', ''],
            alertMes: ['', '', ''],
            aliasErrMes: null,
            checkingAlias: 0,    // 1为别名正在检测
            aliasTimer: null
        }
    },
    created: function () {
        this.act = this.$route.params.act
        if (this.act === 'edit') {
            this.act = "编辑栏目"
            this.propData.act = '编辑'
            this.axios({
                method: 'get',
                url: '/admin/editColumn?id=' + this.$route.query.id
            }).then(res => {
                if (res.status === 200) {
                    //console.log(res.data)
                    const resData = res.data
                    this.colName = resData.title
                    this.aid = resData.aid
                    this.cid = resData.cid
                    this.position = resData.fClass ? resData.fClass.cid : 0
                    this.colNamePin = resData.alias
                    this.ultimate = resData.ultimate === 'true' ? true : false
                    this.path1 = resData.path1
                    this.path2 = resData.path2
                    this.colImg = resData.colImg
                    this.keyword = resData.keyword
                    this.describe = resData.description
                    this.hits = resData.hits
                    this.orderBy = resData.orderBy
                    this.isUse = resData.isUse === 'true' ? true : false
                    this.isNav = resData.isNav === 'true' ? true : false
                    this.suggest = resData.suggest
                    this.outUrl = resData.outUrl
                    this.tempMode = resData.tempMode
                    this.coverTemp = resData.tempCover
                    this.listTemp = resData.tempList
                    this.listTempInClass = resData.listTempInClass
                    this.listTempInClassDefault = resData.fClass ? resData.fClass.listTempInClass : ''
                    this.contentTempDefault = resData.fClass ? resData.fClass.tempContent : ''
                    this.contentTemp = resData.tempContent
                    this.listActive = resData.listActive
                    this.contentActive = resData.contentActive
                    this.contentOrder = resData.contentOrder
                    this.listOrder = resData.listOrder
                    this.extend = resData.extendName
                    this.showNum = resData.showNum
                    this.pageNum = resData.pageNum
                }
            })
        }
        else if (this.act == "add") {
            this.act = "添加栏目"
            this.propData.act = '添加'
            this.posiList.push({ name: '添加栏目' })
        }
        this.getDefaultMes()
    },
    watch: {
        '$route'(to, from) {
            Object.assign(this.$data, this.$options.data())
            this.act = '添加栏目'
            this.getDefaultMes()
        }
    },
    methods: {
        getDefaultMes() {
            this.axios({
                method: 'get',
                url: '/admin/getColList'
            }).then(res => {
                if (res.status === 200) {
                    this.colList = res.data
                    this.getNewColList(this.colList)
                }
            }).catch(err => {
                console.log(err)
            })
            this.axios({
                method: 'get',
                url: '/admin/getCoverTempList'
            }).then(res => {
                if (res.status === 200) {
                    this.coverTempList = res.data
                }
            })
            this.axios({
                method: 'get',
                url: '/admin/getListTempList'
            }).then(res => {
                if (res.status === 200) {
                    this.listTempList = res.data
                }
            })
            this.axios({
                method: 'get',
                url: '/admin/getContentTempList'
            }).then(res => {
                if (res.status === 200) {
                    this.contentTempList = res.data
                }
            })
        },
        getNewColList(colList) {
            let i = 0, j = 0, newColArr = []
            const titleAdd = ['', '--', '----', '------', '--------', '----------', '------------']
            const getColList = (colList, j) => {
                colList.forEach(col => {
                    newColArr[i] = {
                        cid: col.cid,
                        path1: col.path1,
                        path2: col.path2,
                        title: titleAdd[j] + col.title,
                        originTitle: col.title,
                        contentTemp: col.tempContent,
                        listTempInClass: col.listTempInClass,
                        ultimate: col.ultimate,
                        index: j
                    }
                    i++
                    if (col.haveChild !== 0) {
                        getColList(col.haveChild, ++j)
                        j--
                    }
                })
            }
            getColList(colList, j)
            this.colListArr = newColArr
            if (this.$route.params.act === 'edit') {
                this.getPos()
            }
        },
        getNewPath() {
            if (this.position === 0) {
                this.path1 = this.colNamePin
            } else {
                this.path2 = this.colNamePin
            }
        },
        checkAlias() {
            if (this.propData.status === 0) { //没提交的时候才检查
                if (this.aliasTimer) {
                    clearTimeout(this.aliasTimer)
                }
                const goCheck = () =>{
                    this.axios({
                        method: 'post',
                        url: '/admin/checkColAlias',
                        data: {
                            alias: this.colNamePin
                        }
                    }).then(res => {
                        if (res.status === 200) {
                            if (res.data.myStatus === 1) {
                                this.aliasErrMes = '该栏目别名已经存在，请更换'
                            }
                            this.aliasTimer = null
                        }
                    }).catch(err => {
                        this.aliasTimer = null
                        console.log(err)
                    })
                }
                this.aliasTimer = setTimeout(goCheck, 500) 
            }
        },
        subCol() {
            const checkAliasDone = () => {
                if (this.aliasTimer) {
                    alert('正在检查栏目名称，请稍等！')
                    setTimeout(checkAliasDone, 1000)
                }
            }
            checkAliasDone()
            if (!this.colName) {
                this.alertMes[0] = "栏目名为空！"
                this.$set(this.errInput, 0, 'errInput')
            }
            if (this.aliasErrMes) {
                alert(this.aliasErrMes)
                return
            }
            if (!((this.tempMode === 1 && typeof this.coverTemp === 'string' && this.coverTemp !== '') || (this.tempMode === 2 && typeof this.listTemp === 'string' && this.listTemp !== ''))) {
                this.alertMes[1] = "栏目必须要有模版！"
                this.$set(this.errInput, 1, 'errInput')
            }
            if (this.ultimateErr) {
                this.alertMes[2] = "终极栏目下不能添加子栏目"
            }
            if (this.alertMes[0] !== '' || this.alertMes[1] !== '' || this.alertMes[2] !== '') {
                alert(this.alertMes)
            }
            else {
                let url
                this.propData.showSub = true
                const formData = new FormData(formCol)
                if (this.$route.query.id) {
                    url = '/admin/upColumn?id=' + this.$route.query.id
                } else {
                    url = '/admin/upColumn'
                }
                if (formData.get('ultimate') !== 'on') {
                    formData.append('ultimate', 'off')
                }
                if (formData.get('isUse') !== 'on') {
                    formData.append('isUse', 'off')
                }
                if (formData.get('isNav') !== 'on') {
                    formData.append('isNav', 'off')
                }
                if (!formData.get("coverTemp")) {
                    formData.append('coverTemp', '')
                }
                if (!formData.get("listTemp")) {
                    formData.append('listTemp', '')
                }
                if (!formData.get("listTempInClass")) {
                    formData.append('listTempInClass', '')
                }
                if (!formData.get("contentTemp")) {
                    formData.append('contentTemp', '')
                }
                formData.append("cid", this.position)
                if (this.$route.query.id) { formData.append('aid', parseInt(this.aid)) }
                this.axios({
                    method: 'post',
                    url: url,
                    data: formData
                }).then(res => {
                    if (res.status === 200) {
                        this.propData.status = 1
                        this.propData.resStatus = 1
                        const insertId = res.data.id || this.$route.query.id
                        this.axios({
                            url: '/admin/getColList'
                        }).then(res => {
                            if (res.status === 200) {
                                this.$store.commit('changeWebSetting', { colList: res.data })
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                        const webset = this.$store.state.webSetting
                        if (webset.buildCol === 1) {
                            this.$set(this.propData, 'build', { status: 2, name: '栏目' }) //准备生成
                            this.axios({
                                url: '/admin/withBuildCol?id=' + insertId
                            }).then(res => {
                                if (res.status === 200) {
                                    if (res.data.myStatus === 1) {
                                        this.$set(this.propData, 'build', { status: 1, name: '栏目', id: insertId })   //生成成功
                                        const buildFaCol = (cid) => {
                                            this.axios({
                                                url: '/admin/buildFaCol?cid=' + cid
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
                                        if (res.data.aid !== 0 && webset.buildFaCol === 1) buildFaCol(res.data.aid)
                                    } else {
                                        this.$set(this.propData, 'build', { status: 0, name: '栏目', id: insertId })  //生成失败
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
        getOrder(e, num, m) {
            let string = ''
            if (m === 'contentOrder') {
                this.contentOrderArr[num] = e.target.value
                this.contentOrderArr.forEach((value) => {
                    if (value) {
                        string = string + value + ','
                    }
                })
                this.contentOrder = string
            } else if (m === 'listOrder') {
                this.listOrderArr[num] = e.target.value
                this.listOrderArr.forEach((value) => {
                    if (value) {
                        string = string + value + ','
                    }
                })
                this.listOrder = string
            }
        },
        selChange(e) {
            const index = e.target.selectedIndex
            if (index === 0) {
                this.path1 = this.colNamePin
                this.path2 = ''
                this.aid = 0
            } else {
                this.path1 = this.colListArr[index - 1].path2 ?
                    this.colListArr[index - 1].path1 + '/' + this.colListArr[index - 1].path2 :
                    this.colListArr[index - 1].path1
                this.path2 = this.colNamePin
                this.aid = this.colListArr[index - 1].cid
            }
            if (this.$route.params.act === 'add') {
                if (index != 0) {
                    this.listTemp = this.colListArr[index - 1].listTempInClass
                    this.listTempInClass = this.colListArr[index - 1].listTempInClass
                    this.listTempInClassDefault = this.colListArr[index - 1].listTempInClass
                    this.contentTemp = this.colListArr[index - 1].contentTemp
                    this.contentTempDefault = this.colListArr[index - 1].contentTemp
                    if (this.listTemp) {
                        this.tempMode = 2
                    }
                    if (this.colListArr[index - 1].ultimate === 'true') {
                        this.ultimateErr = true
                    } else {
                        this.ultimateErr = false
                    }
                }
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
        refreshPage() {
            this.reload()
        },
        reEdit() {
            this.propData.showSub = false
        },
        openUpfile() {
            if (!this.cid) {
                let comfirm = confirm("添加栏目的时候上传栏目图片因为栏目还不存在会预创建栏目，\r以后修改栏目的路径会导致图片路径不正确！\r\n确定上传？")
                if (comfirm) {
                    if (!this.colName) {
                        alert('栏目名称为空')
                        this.$set(this.errInput, 0, 'errInput')
                    }
                    else if (!this.path1) {
                        alert('栏目路径为空')
                    }
                    else {
                        const formData = new FormData(formCol)
                        if (formData.get('ultimate') !== 'on') {
                            formData.append('ultimate', 'off')
                        }
                        if (formData.get('isUse') !== 'on') {
                            formData.append('isUse', 'off')
                        }
                        if (formData.get('isNav') !== 'on') {
                            formData.append('isNav', 'off')
                        }
                        if (!formData.get("coverTemp")) {
                            formData.append('coverTemp', '')
                        }
                        if (!formData.get("listTemp")) {
                            formData.append('listTemp', '')
                        }
                        if (!formData.get("listTempInClass")) {
                            formData.append('listTempInClass', '')
                        }
                        if (!formData.get("contentTemp")) {
                            formData.append('contentTemp', '')
                        }
                        this.axios({
                            method: 'post',
                            url: '/admin/preCreateCol',
                            data: formData
                        }).then(res => {
                            if (res.status === 200) {
                                if (res.data.myStatus === 1) {
                                    this.cid = res.data.cid
                                    this.colName = res.data.alias
                                    this.getDefaultMes()
                                    this.axios({
                                        url: '/admin/getColList'
                                    }).then(res => {
                                        if (res.status === 200) {
                                            this.$store.commit('changeWebSetting', { colList: res.data })
                                            this.show = !this.show
                                        }
                                    }).catch(err => {
                                        console.log(err)
                                    })
                                } else {
                                    alert('后台原因，栏目预添加失败！')
                                }
                            }
                        }).catch(Err => {
                            alert('后台原因，栏目预添加失败！')
                        })
                    }
                }
            } else {
                this.show = !this.show;
            }
        },
        savePicPath(path) {
            this.colImg = '/' + path
            this.show = false
        },
        getPos() {
            let colIndex, posCol = [], colListArr = this.colListArr
            const getPosCol = (colIndex, ArrIndex) => {
                for (let i = ArrIndex; i >= 0; i--) {
                    if (colListArr[i].index === colIndex - 1) {
                        posCol.push({ name: colListArr[i].originTitle })
                        getPosCol(colIndex - 1, i)
                        break
                    }
                }
            }
            for (let i = 0; i <= this.colListArr.length - 1; i++) {
                if (colListArr[i].cid === this.cid) {
                    colIndex = colListArr[i].index
                    posCol.push({ name: colListArr[i].originTitle })
                    getPosCol(colIndex, i)
                    break
                }
            }
            this.posiList = this.posiList.concat(posCol.reverse())
            this.posiList.push({ name: '编辑栏目' })
        },
        getColNamePin() {
            if (this.act !== '编辑栏目') {
                let pinyinArr = pinyin(this.colName, { style: pinyin.STYLE_NORMAL })
                let pinyinStr = ''
                pinyinArr.forEach((value) => {
                    if (parseInt(this.indexPinYin) === 1) {
                        pinyinStr += value[0].substring(0, 1)
                    }
                    else if (parseInt(this.indexPinYin) === 2) {
                        pinyinStr += value[0]
                    }
                })
                if (this.colNamePin !== pinyinStr) {
                    this.colNamePin = pinyinStr
                    this.checkAlias()
                }
                if (this.position === 0) {
                    this.path1 = pinyinStr
                } else {
                    this.path2 = pinyinStr
                }
            }
        },
    },
    computed: {
        checkOrderBy() {
            let regExp = /^[a-z]+.*\,$/
            let result = regExp.test(this.contentOrder)
            result = result ? '' : '排序必须用逗号结束，多个用逗号间隔'
            return result
        },
        checkUltimateDisable() {
            if (this.cid) {
                this.axios({
                    method: 'get',
                    url: '/admin/checkUltimate?cid=' + this.cid
                }).then(res => {
                    if (res.status === 200) {
                        if (res.data === 1) {
                            this.ultimate === false
                            if (this.ultimate === true) {
                                this.ultimate = false
                                alert('该栏目有子栏目，不能设置为终极栏目！')
                            }
                        }
                    }
                })
                if (this.ultimate === true) {
                    this.tempMode = 2
                }
            } else {
                if (this.ultimate === true) {
                    this.tempMode = 2
                }
            }
        },
        checkMustFill() {
            if (this.colName) {
                this.$set(this.errInput, 0, '')
                this.alertMes[0] = ''
            }
            if (this.coverTemp || this.listTemp) {
                this.$set(this.errInput, 1, '')
                this.alertMes[1] = ''
            }
            if (!this.ultimateErr) {
                this.alertMes[2] = ''
            }
        },
    },
    updated() {
        //    let optLength = document.getElementById("selectOpt").querySelectorAll("option").length
        //    this.optSize = optLength
    },

}
</script>
<style scoped>
.defaultTemp {
    color: #f00;
}
.errMes {
    color: #f00;
}
.errInput {
    border: 1px solid #f00;
}
</style>
