<template>
  <div class="rightCon">
        <now-position v-bind:posList="posiList"></now-position>
        <div><button class="btn" @click="goAddTemp()">添加模版</button></div>
        <ul :class="type===1?'tinyList':'tinyList1'" v-if="Array.isArray(tempList)&&tempList.length!=0">
            <li>
                <span class="id">ID</span>
                <span class="title">标题</span>
                <template v-if="type===1">
                    <span class="name">是否启用</span> 
                </template>
                <span class="operate">操作</span>
            </li>
            <template v-for="temp in tempList">
                <li>
                    <span class="id">{{temp.id}}</span>
                    <span class="title">{{temp.title}}</span>
                    <template v-if="type===1">
                        <span class="name isLink" @click="enableTemp($event, temp.id)"> {{temp.isUse==='true'?'启用':'不启用'}}</span>
                    </template>
                    <span class="operate">
                        <span @click="editTemp(temp.id)" class="edit"> 编辑</span> | 
                        <span @click="deleTemp(temp.id, temp.title)" class="dele">删除</span>
                    </span>
                </li>
            </template>
        </ul>
        <div v-else-if="Array.isArray(tempList)&&tempList.length===0"  class="noCon">还没有模版！</div>
        <div v-else  class="noCon">加载中...</div>
        <sub-ok v-bind:subData="propData" v-on:refresh="refreshPage"></sub-ok>
    </div>
</template>

<script>
import nowPosition from '../tinyComp/NowPosition.vue'
import subOk from '../tinyComp/SubOk.vue'
export default {
    name: "tempList",
    components: {
        nowPosition,
        subOk
    },
    inject: ['reload'],
    data: function () {
        return {
            type: parseInt(this.$route.query.type) || 1,
            tempList: null,
            tempType: '',
            posiList: '加载中...',
            propData: { showSub: false, status: 0, pageName: '模版', query: { type: parseInt(this.$route.query.type) || 1 } }
        }
    },
    created: function () {
        this.axios({
            method: 'get',
            url: '/admin/tempList?type=' + this.type
        }).then(res => {
            if (res.status === 200) {
                this.tempList = res.data
            }
        })
        this.getPos()
    },
    watch: {
        '$route'(to, from) {
            this.axios({
                method: 'get',
                url: '/admin/tempList?type=' + this.$route.query.type
            }).then(res => {
                if (res.status === 200) {
                    this.tempList = res.data
                    this.type = parseInt(this.$route.query.type)
                    this.getPos()
                }
            })
        }
    },
    methods: {
        goAddTemp() {
            this.$router.push({ name: 'tempAdd', query: { type: this.type }, params: { act: 'add' } })
        },
        editTemp(id) {
            this.$router.push({ name: 'tempAdd', query: { type: this.type, id: id }, params: { act: 'edit' } })
        },
        getPos() {
            switch (parseInt(this.$route.query.type)) {
                case 1:
                    this.tempType = '首页模版'
                    break
                case 2:
                    this.tempType = '封面页模版'
                    break
                case 3:
                    this.tempType = '列表页模版'
                    break
                case 4:
                    this.tempType = '内容页模版'
                    break
                default:
                    this.tempType = '首页模版'
            }
            this.posiList = [{ url: { temp: 'tempList', query: { type: this.$route.query.type } }, name: this.tempType }, { name: '模版列表' }]
        },
        enableTemp(e, id) {
            if (e.target.innerText === '启用') {
                alert('该模版已经启用!')
            } else {
                console.log(id)
                this.axios({
                    method: 'get',
                    url: '/admin/changeIsUseTemp?id=' + id
                }).then(res => {
                    if (res.status === 200) {
                        if (res.data.myStatus === 0) {
                            alert('修改不成功')
                        }
                        this.tempList = res.data.result
                    }
                })
            }
        },
        deleTemp(id, title) {
            this.propData.act = "删除"
            if (confirm("确定删除？\r\nid:" + id + "名称:" + title)) {
                this.propData.showSub = true
                const table = 'template' //数据表名
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
        },
    }
}
</script>

<style scoped>
</style>
