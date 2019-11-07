<template>
    <div class="rightCon">
        <now-position v-bind:posList="posiList"></now-position>
        <div v-if="this.type===1"><input class="btn" type="button" value="添加静态标签" @click="goAddStaticTag(1)"></div>
        <div v-else-if="this.type===3"><input class="btn" type="button" value="添加SQL标签" @click="goAddSqlTag(3)"></div>
        <template v-if="tagList&&tagList.length>0">
            <ul class="tinyList" v-if="this.type===1">
                <li>
                    <span class="id">ID</span>
                    <span class="title">标题</span>
                    <span class="name">调用名</span>
                    <span class="operate">操作</span>
                </li>
                <template v-for="tag in tagList">
                    <li> 
                        <span class="id">{{tag.id}}</span>
                        <span class="title">{{tag.title}}</span>
                        <span class="name">[litag]temp.{{tag.callName}}[/litag] </span>
                        <span class="operate">
                            <span @click="goEdit(1, tag.id)" class="edit">编辑</span> | 
                            <span @click="deleTag(tag.id, tag.title, 'tag')" class="dele">删除</span>
                        </span>
                    </li>
                </template>
            </ul>
            <!-- <ul class="tinyList" v-else-if="this.type===2">
                <template v-for="tag in tagList">
                    <li> {{tag.id}} {{tag.title}}  {{tag.pattern}} 
                        <input type="button" value="查看" @click="showDynaTag(tag.id)">
                    </li>
                </template>
            </ul> -->
            <ul class="tinyList" v-else-if="this.type===3">
                <li>
                    <span class="id">ID</span>
                    <span class="title">标题</span>
                    <span class="name">调用名</span>
                    <span class="operate">操作</span>
                </li>
                <template v-for="tag in tagList">
                    <li> 
                        <span class="id">{{tag.id}}</span>
                        <span class="title">{{tag.title}}</span>
                        <span class="name">{{tag.callname}}</span>
                        <span class="operate">
                            <span @click="goEditSqlTag(tag.id, 3)" class="edit">编辑</span> | 
                            <span @click="deleTag(tag.id, tag.title, 'sqltag')" class="dele">删除</span>
                        </span>
                    </li>
                </template>
            </ul>
            <template v-else>
                <div  class="noCon">初始化失败,参数错误</div>
            </template>
                
        </template>
        <div v-else-if="tagList&&tagList.length===0"  class="noCon">没有标签</div>
        <div v-else  class="noCon">正在获取标签</div>
        <sub-ok v-bind:subData="propData" v-on:refresh="refreshPage"></sub-ok>
    </div>
</template>

<script>
import nowPosition from '../tinyComp/NowPosition.vue'
import subOk from '../tinyComp/SubOk.vue'
export default {
    name: "tagList",
    components: {
        nowPosition,
        subOk
    },
    inject: ['reload'],
    data: function () {
        return {
            type: parseInt(this.$route.query.type) || 1,
            id: null,
            tagList: null,
            posiList: '加载中...',
            propData: { showSub: false, status: 0, pageName: '标签' }
        }
    },
    created: function () {
        this.init()
    },
    watch: {
        '$route'(to, from) {
            this.init()
        }
    },
    methods: {
        init() {
            this.type = parseInt(this.$route.query.type) || 1;
            let tagName
            switch (this.type) {
                case 1:
                    tagName = '静态标签'
                    break
                case 2:
                    tagName = '动态标签'
                    break
                case 3:
                    tagName = 'sql标签'
                    break
                default:
                    tagName = '静态标签'
            }
            this.posiList = [{ url: { temp: 'tagList', query: { type: this.type } }, name: tagName }, { name: '标签列表' }]
            this.axios({
                method: 'get',
                url: '/admin/tagList?type=' + this.type
            }).then(res => {
                if (res.status === 200) {
                    this.tagList = res.data
                    //console.log(this.tagList)
                }
            })
        },
        goAddStaticTag(type) {
            this.$router.push({ name: 'staticTagAdd', query: { type: type }, params: { act: 'add' } })
        },
        goAddSqlTag(type) {
            this.$router.push({ name: 'sqlTagAdd', query: { type: type }, params: { act: 'add' } })
        },
        goEdit(type, id) {
            this.$router.push({ name: 'staticTagAdd', query: { type: type, id: id }, params: { act: 'edit' } })
        },
        goEditSqlTag(id, type) {
            this.$router.push({ name: 'sqlTagAdd', query: { id: id, type: type }, params: { act: 'edit' } })
        },
        showDynaTag(id) {
            this.$router.push({ name: 'dynaTagShow', query: { id: id } })
        },
        deleTag(id, title, table) {
            this.propData.act = "删除"
            if (confirm("确定删除？\r\nid:" + id + "标题:" + title)) {
                this.propData.showSub = true
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
        refreshPage() {
            this.reload()
        }
    }
}
</script>

<style scoped>
</style>
