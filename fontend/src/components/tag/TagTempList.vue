<template>
    <div class="rightCon">
        <now-position v-bind:posList="posiList"></now-position>
        <input class="btn" type="button" value="添加标签模版" @click="addTagTemp">
        <ul class="tinyList1">
            <template v-if="tempList&&tempList.length>0">
                <li>
                    <span class="id">ID</span>
                    <span class="title">标题</span>
                    <span class="operate">操作</span>
                </li>
                <template v-for="temp in tempList">
                    <li> 
                        <span class="id">{{temp.id}}</span>
                        <span class="title">{{temp.title}}   </span>
                        <span class="operate">
                            <span class="edit"  @click="goEditTagTemp(temp.id)">编辑</span> | 
                            <span class="dele" @click="deleTag(temp.id, temp.title, 'tagtemp')">删除</span>
                        </span>
                    </li>
                </template>
            </template>
            <template v-else-if="tempList&&tempList.length===0">
                <div  class="noCon">没有任何内容</div>
            </template>
            <div v-else  class="noCon">正在获取标签模版</div>
        </ul>
        <sub-ok v-bind:subData="propData" v-on:refresh="refreshPage"></sub-ok>
    </div>
</template>

<script>
import nowPosition from '../tinyComp/NowPosition.vue'
import subOk from '../tinyComp/SubOk.vue'
export default {
    components: {
        nowPosition,
        subOk
    },
    inject: ['reload'],
    data () {
       return {
           tempList: null,
           posiList: [{url: {temp: 'tagTempList', query: {type: 4}}, name: '标签模版列表'}],
           propData: {showSub: false, status: 0, pageName: '标签', query: {type: 4}}
       }
    },

    created(){
        this.axios({
            method: 'get',
            url: '/admin/getTagTempList'
        }).then(res=>{
            if(res.status===200){
                this.tempList = res.data
            }
        })
    },
    methods: {
        addTagTemp(){
            this.$router.push({name: 'tagTempAdd', query: {type: 4}, params: {act: 'add'}})
        },
        goEditTagTemp(id){
            this.$router.push({name: 'tagTempAdd', query: {type: 4, id: id}, params: {act: 'edit'}})
        },
        deleTag(id, title, table){
            this.propData.act = "删除"
            if(confirm("确定删除？\r\nid:" + id + "标题:" + title)){
                this.propData.showSub = true
                this.axios({
                    method: 'get',
                    url: '/admin/dele?table=' + table + '&id=' + id
                }).then(res=>{
                    if(res.status===200){
                        if(res.data.myStatus===1){
                            this.propData.status = 1
                            this.propData.resStatus = 1
                        }else{
                            this.propData.status = 1
                            this.propData.resStatus = 2
                        }
                    }
                }).catch(err=>{
                    this.propData.status = 1
                    this.propData.resStatus = 2
                })
            }
        },
        refreshPage(){
            this.reload()
        }
    }
}
</script>
<style  scoped>
</style>