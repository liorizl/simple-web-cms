<template>
    <div class="rightCon">
        <now-position v-bind:posList="posiList"></now-position>
        <div class="ccon">
            <form name="formTag">
                <div class="input">
                    <span class="input-title"><label for="title">标签标题</label></span>
                    <span class="input-con">
                        <input type="text" id="title" v-model="title" name="title">
                    </span>
                </div>
                <div class="input">
                    <span class="input-title"><label for="callName">标签调用名</label></span>
                    <span class="input-con">
                        <input type="text" id="callName" v-model="callName" name="callName">请用[litag]temp.{{callName?callName:'标签调用名'}}[/litag]此格式调用
                    </span>

                </div>
                <div class="input">
                    <span class="input-title"><label for="content">标签内容</label></span>
                    <span class="input-con padding">
                        <textarea name="content" id="content" v-model="content" cols="100" rows="34"></textarea>
                    </span>
                </div>
                <div class="input padding"><input class="btn marginLeft " type="button" value="提交" @click="upTag"></div>
            </form>
        </div>
        <sub-ok v-bind:subData="propData" v-on:refresh="refreshPage" v-on:returnEdit="reEdit"></sub-ok>
    </div>
</template>

<script>
import nowPosition from '../tinyComp/NowPosition.vue'
import subOk from '../tinyComp/SubOk.vue'
export default {
    components:{
        nowPosition,
        subOk
    },
    inject:['reload'],
    data :function() {
        return {
            id:null,
            type:this.$route.query.type,
            title:null,
            callName:null,
            content:null,
            posiList:[{url:{temp:'tagList',query:{type:1}},name:'静态标签'}],
            propData:{showSub:false,status:0,pageName:'栏目',query:{type:1},router:'tagList'},
       }
    },

    created:function(){
        if(this.$route.params.act==='edit'){
            this.propData.act='编辑'
            this.id=this.$route.query.id
            this.axios({
                method:'get',
                url:'/admin/tagMes?id='+this.id
            }).then(res=>{
                if(res.status===200){
                    const resData=res.data[0]
                    this.id=resData.id
                    this.title=resData.title
                    this.callName=resData.callName
                    this.content=resData.content
                    this.posiList.push({name:'编辑标签'})
                    this.posiList.push({name:resData.title})
                }
            })
        }else{
            this.propData.act='添加'
            this.posiList.push({name:'添加标签'})
        }
    },
    methods: {
        upTag(){
            this.propData.showSub=true
            let act,formData=new FormData(formTag)
            if(this.$route.params.act==='add'){
                act='add'
            }
            else if(this.$route.params.act==='edit'){
                act='edit'
            }
            this.axios({
                method:'post',
                url:'/admin/upTag?type=1&act='+act+'&id='+this.id,
                data:formData
            }).then(res=>{
                if(res.status===200){
                    this.propData.status=1
                    this.propData.resStatus=1
                }
            }).catch(err=>{
                this.propData.status=1
                this.propData.resStatus=2
            })
        },
        refreshPage(){
            this.reload()
        },
        reEdit(){
            this.propData.showSub=false
        },
    }
}
</script>
<style  scoped>
</style>