<template>
    <div>
        <h2 class="title">快速生成动态标签</h2>
        <div class="li">
            请选择标签
            <select name="tagName" id="tagName" v-model.number="tagName">
                <option value="1">栏目下文章</option>
                <option value="2">循环栏目下文章</option>
            </select>
        </div>
        <ul class="tagCon">
            <li class="borderRight">
                <span class="liTitle">选择栏目</span>
                <span class="liCon">
                    <select name="colId" id="colId" v-model:number="colId" multiple>
                        <template v-if="!colList">
                            <option value="-1">正在初始化</option>
                        </template>
                        <template v-if="colList&&colList.length===0">
                            <option value="-1">栏目为空</option>
                        </template>
                        <template v-if="colList&&colList.length>0">
                            <template v-for="col in colList">
                                <option :value="col.id">{{col.title}}</option>
                            </template>
                        </template>
                    </select>
                </span>
            </li>
            <li >
                <span class="liTitle">选择标签模版</span>
                <span class="liCon">
                    <select name="tempId" id="tempId" v-model.number="tempId">
                        <template v-if="!tempList">
                            <option value="0">正在初始化</option>
                        </template>
                        <template v-if="tempList&&tempList.length===0">
                            <option value="0">标签模版为空</option>
                        </template>
                        <template v-if="tempList&&tempList.length>0">
                            <template v-for="temp in tempList">
                                <option :value="temp.id">{{temp.title}}</option>
                            </template>
                        </template>
                    </select>
                </span>
            </li>
            <li class="allLine">
                <span class="liTitle">显示条数</span>
                <span class="liCon">
                    <input type="number" v-model.number="num"  min="-1" max="1000">
                </span>
            </li>
            <li class="borderRight">
                <span class="liTitle">标题截取</span>
                <span class="liCon">
                    <input type="number" v-model.number="titleCut" min="0" max="1000">
                </span>
            </li>
            <li>
                <span class="liTitle">简介截取</span>
                <span class="liCon">
                    <input type="number" v-model.number="introCut" min="0" max="1000">
                </span>
            </li>
            <li class="borderRight">
                <span class="liTitle">分页器显示</span>
                <span class="liCon">
                    <select name="pagition" id="pagition" v-model="pagition">
                        <option value="0">不显示</option>
                        <option value="1">样式1</option>
                    </select>
                </span>
            </li>
            <li>
                <span class="liTitle">时间显示</span>
                <span class="liCon">
                    <select name="timeType" id="timeType" v-model="timeType">
                        <option value="0">不显示</option>
                        <option value="1">y-m-d</option>
                        <option value="2">y-m-d h:m</option>
                        <option value="3">y-m-d h:m:s</option>
                    </select>
                </span>
            </li>
            <li class="allLine">
                <span class="liTitle">附加sql条件</span>
                <span class="liCon">
                    <input type="text" name="sqlFilter" id="sqlFilter" v-model="sqlFilter">
                </span>
            </li>
            <li class="allLine">
                <span class="liTitle">文章排序</span>
                <span class="liCon select">
                    <input type="text" v-model="orderBy" name="orderBy" />
                    <select @change="getOrder($event.target,0)">
                        <option value="">排序字段</option>
                        <option  value="orderBy desc">排序字段降序</option>
                        <option value="orderBy asc">排序字段升序</option>
                    </select>
                    <select @change="getOrder($event.target,1)">
                        <option value="">ID</option>
                        <option  value="id desc">ID降序</option>
                        <option value="id asc">ID升序</option>
                    </select>
                    <select @change="getOrder($event.target,2)">
                        <option value="">点击</option>
                        <option  value="hit desc">点击降序</option>
                        <option value="hit asc">点击升序</option>
                    </select>
                    <select @change="getOrder($event.target,3)">
                        <option value="">添加时间</option>
                        <option  value="uptime desc">添加时间降序</option>
                        <option value="uptime asc">添加时间升序</option>
                    </select>
                </span>
            </li>
            <li class="allLine" v-if="tagName===2">
                <span class="liTitle">类名列表</span>
                <span class="liCon">
                    <input type="text" name="classStr" id="classStr" v-model="classStr" size="60">
                </span>
            </li>
            <li class="allLine" v-if="tagName===2">
                <span class="liTitle">栏目排序</span>
                <span class="liCon select">
                    <input type="text" v-model="colOrderBy" name="colOrderBy" />
                    <select @change="getColOrder($event.target,0)">
                        <option value="">排序字段</option>
                        <option  value="orderBy desc">排序字段降序</option>
                        <option value="orderBy asc">排序字段升序</option>
                    </select>
                    <select @change="getColOrder($event.target,1)">
                        <option value="">ID</option>
                        <option  value="id desc">ID降序</option>
                        <option value="id asc">ID升序</option>
                    </select>
                    <select @change="getColOrder($event.target,2)">
                        <option value="">点击</option>
                        <option  value="hit desc">点击降序</option>
                        <option value="hit asc">点击升序</option>
                    </select>
                    <select @change="getColOrder($event.target,3)">
                        <option value="">添加时间</option>
                        <option  value="uptime desc">添加时间降序</option>
                        <option value="uptime asc">添加时间升序</option>
                    </select>
                </span>
            </li>
        </ul>
        <div class="li"><input type="button" value="输出标签" @click="getTag"></div>
        <div class="li" v-if="tagName===1">[litag]dynamic.artInCol(栏目ID,标签模版ID,显示条数,标题截取,简介截取,分页,时间,SQL条件,排序)[/litag]</div>
        <div class="li" v-else-if="tagName===2">[litag]dynamic.artInCols(栏目ID,模版ID,显示条数,标题截取,简介截取,分页,时间,SQL条件,排序,样式类名)[/litag]</div>
        <div class="li">
            <textarea name="" id="" cols="100" rows="3" v-model="tagCon"></textarea>
        </div>
        <div class="li"><input type="button" value="复制标签内容" @click="doCopy"></div>
    </div>
</template>

<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
export default {
    data() {
        return {
            tagName: 1,
            colId: ['self'],
            colList: null,
            tempId: null,
            tempList: null,
            num: 0,
            titleCut: 0,
            introCut: 0,
            pagition: 0,
            timeType: 0,
            sqlFilter: 0,
            orderBy: 0,
            colOrderBy: 0,
            orderByArr: new Array(4),
            colOrderByArr: new Array(4),
            tagCon: null,
            classStr: 0
        }
    },

    created() {
        this.axios({
            url: '/admin/getColList'
        }).then(res => {
            if (res.status === 200) {
                if (res.data.length > 0) {
                    this.getNewColList(res.data)
                } else {
                    this.colList = []
                }
            }
        })
        this.axios({
            url: '/admin/getTagTempList'
        }).then(res => {
            if (res.status === 200) {
                this.tempList = res.data
            }
        })
    },

    methods: {
        getNewColList(colList) {
            let i = 0, j = 0, newColArr = []
            const titleAdd = ['', '--', '----', '------', '--------', '----------']
            const getColList = (colList, j) => {
                colList.forEach(col => {
                    newColArr[i] = {
                        id: col.id,
                        cid: col.cid,
                        ultimate: col.ultimate,
                        path: col.path2 ? col.path1 + '/' + col.path2 : col.path1,
                        title: titleAdd[j] + col.title
                    }
                    i++
                    if (col.haveChild !== 0) {
                        j++
                        getColList(col.haveChild, j)
                        j--
                    }
                })
            }
            getColList(colList, j)
            newColArr.unshift({ id: 0, title: '所有栏目' })
            newColArr.unshift({ id: 'self', title: '当前栏目' })
            this.colList = newColArr
        },
        getOrder(eTarget, num) {
            let string = ''
            this.orderByArr[num] = eTarget.value
            this.orderByArr.forEach((value) => {
                if (value) {
                    string = string + value + ', '
                }
            })
            string = string === '' ? 0 : string
            this.orderBy = string.replace(/,$/, '')
        },
        getColOrder(eTarget, num) {
            let string = ''
            this.colOrderByArr[num] = eTarget.value
            this.colOrderByArr.forEach((value) => {
                if (value) {
                    string = string + value + ','
                }
            })
            string = string === '' ? 0 : string
            this.colOrderBy = string.replace(/,$/, '')
        },
        getTag() {
            let str = '', ttagName, tagArr = [], tcolId, tsqlFilter, torderBy, tclassStr, tColOrderBy
            if (this.tagName === 1) {
                ttagName = 'artInCol'
            }
            else if (this.tagName === 2) {
                ttagName = 'artInCols'
            }
            if (this.colId[0] === '-1') {
                alert('你还没有栏目，请先添加栏目!')
                return
            }
            if (this.colId.length > 1 && this.colId.indexOf('self') >= 0) {
                alert('选择了当前栏目后不要多选其他栏目！')
            }
            else if (this.colId.length > 1 && this.colId.indexOf(0) >= 0) {
                alert('选择了所有栏目后不要多选其他栏目！')
            }
            else if (!this.tempId) {
                alert("请选择标签模版！")
            }
            else if (this.tempId === 0) {
                alert("还没有标签模版，请去添加！")
            }
            else {
                tcolId = this.colId.length > 1 ? '\'' + this.colId.join(',') + '\'' : this.colId[0]
                tsqlFilter = this.sqlFilter !== 0 && /\,/.test(this.sqlFilter) ?
                    '\'' + this.sqlFilter + '\'' :
                    this.sqlFilter
                if (this.orderBy !== 0) {
                    if (/\,/.test(this.orderBy)) {
                        torderBy = '\'' + this.orderBy + '\''
                    } else {
                        torderBy = this.orderBy
                    }
                } else {
                    torderBy = 0
                }
                tagArr = [tcolId, this.tempId, this.num, this.titleCut, this.introCut, this.pagition, this.timeType, tsqlFilter, torderBy]
                if (this.tagName === 2) {
                    tclassStr = this.classStr !== 0 ? '\'' + this.classStr + '\'' : this.classStr
                    tagArr.push(tclassStr)
                    if (this.colOrderBy !== 0) {
                        if (/\,/.test(this.colOrderBy)) {
                            tColOrderBy = '\'' + this.colOrderBy + '\''
                        } else {
                            tColOrderBy = this.colOrderBy
                        }
                    } else {
                        tColOrderBy = 0
                    }
                    tagArr.push(tColOrderBy)
                }
                for (let i = tagArr.length - 1; i >= 0; i--) {
                    if (parseInt(tagArr[i]) === 0) {
                        tagArr.pop()
                    } else {
                        break
                    }
                }
                str = '[litag]dynamic.' + ttagName + '(' + tagArr.join(',') + ')[/litag]'
                this.tagCon = str
            }
        },
        doCopy() {
            this.$copyText(this.tagCon)
        }
    }
}
</script>
<style lang="less" scoped>
@borderColor: #888;
.title {
    text-align: center;
}
.li {
    width: 94%;
    margin: 15px auto;
}
.tagCon {
    width: 94%;
    margin: 20px auto;
    border: 1px solid #888;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    li {
        width: 50%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid @borderColor;
        box-sizing: border-box;
        padding: 10px 0;
        overflow: hidden;
        .liTitle,
        .liCon {
            text-indent: 1em;
        }
        .liTitle {
            width: 110px;
        }
        .liCon.select {
            display: flex;
            align-items: center;
            input,
            select {
                margin-left: 10px;
            }
        }
    }
    li.borderRight {
        border-right: 1px solid @borderColor;
    }

    li.allLine {
        width: 100%;
    }
}
</style>