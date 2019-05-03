<template>
    <div class="rightCon">
        <now-position v-bind:posList="posiList"></now-position>
        <div class="ccon">
            <form name="webSetting">
                <div class="input">
                    <span class="input-title"><label for="webName">网站名称：</label></span>
                    <span class="input-con"><input type="text"  id="webName" size="30" name="webName" v-model="webName"></span>
                </div>
                <div class="input">
                    <span class="input-title"><label for="webUrl">网站地址：</label></span>
                    <span class="input-con"><input type="text"  id="webUrl" size="30" name="webUrl" v-model="webUrl"><span class="noCon">输入完整网址:http://域名+端口或http://xx.com</span></span>
                </div>
                <div class="input">
                    <span class="input-title"><label for="webKeyword">网站关键词：</label></span>
                    <span class="input-con padding"><textarea id="webKeyword" v-model="keyword" name="keyword" rows="4" cols="50"></textarea></span>
                </div>
                <div class="input">
                    <span class="input-title"><label for="webDescription">网站描述：</label></span>
                    <span class="input-con padding"><textarea id="webDescription" v-model="description" name="description" rows="5" cols="50"></textarea></span>
                </div>
                <div class="input">
                    <span class="input-title"><label for="indexPath">首页目录：</label></span>
                    <span class="input-con"><input type="text"  id="indexPath"  name="indexPath" v-model="indexPath"></span>
                </div>  
                <div class="input">
                    <span class="input-title"><label for="pagePath">页面目录：</label></span>
                    <span class="input-con"><input type="text"  id="pagePath"  name="pagePath" v-model="pagePath"></span>
                </div>
                <div class="input">
                    <span class="input-title"><label >首页模式：</label></span>
                    <span class="input-con">
                        <input type="radio"  id="indexModel1" value=1 v-model.number="indexModel" name="indexModel"><label for="indexModel1">静态首页</label>
                        <input type="radio"  id="indexModel2" value=2 v-model.number="indexModel" name="indexModel"><label for="indexModel2">动态首页</label>
                        <span class="noCon">可以将动态页面作为调试</span>
                    </span>
                </div>
                <div class="input">
                    <span class="input-title"><label >其他页面模式：</label></span>
                    <span class="input-con">
                        <input type="radio"  id="pageModel1" value=1 v-model.number="pageModel" name="pageModel"><label for="pageModel1">静态页面</label>
                        <input type="radio"  id="pageModel2" value=2 v-model.number="pageModel" name="pageModel"><label for="pageModel2">动态页面</label>
                    </span>
                </div>
                <div class="input">
                    编辑栏目后是否自动生成栏目：
                    <input type="radio"  id="buildCol1" value=1 v-model.number="buildCol" name="buildCol"><label for="buildCol1">是</label>
                    <input type="radio"  id="buildCol2" value=0 v-model.number="buildCol" name="buildCol"><label for="buildCol2">否</label>
                </div>
                <div class="input">
                    编辑栏目后是否生成父栏目&nbsp;&nbsp;&nbsp;：
                    <input type="radio"  id="buildFaCol1" value=1 v-model.number="buildFaCol" name="buildFaCol"><label for="buildFaCol1">是</label>
                    <input type="radio"  id="buildFaCol2" value=0 v-model.number="buildFaCol" name="buildFaCol"><label for="buildFaCol2">否</label>
                </div>
                <div class="input">
                    编辑文章后是否自动生成文章：
                    <input type="radio"  id="buildArt1" value=1 v-model.number="buildArt" name="buildArt"><label for="buildArt1">是</label>
                    <input type="radio"  id="buildArt2" value=0 v-model.number="buildArt" name="buildArt"><label for="buildArt2">否</label>
                </div>
                <div class="input">
                    编辑文章后是否生成父栏目&nbsp;&nbsp;&nbsp;：
                    <input type="radio"  id="buildFaArt1" value=1 v-model.number="buildFaArt" name="buildFaArt"><label for="buildFaArt1">是</label>
                    <input type="radio"  id="buildFaArt2" value=0 v-model.number="buildFaArt" name="buildFaArt"><label for="buildFaArt2">否</label>
                </div>
                <div class="input">
                    <span class="input-title"><label for="extendName">首页扩展名：</label></span>
                    <span class="input-con"><input type="text" class="extendName" id="extendName" v-model="extendName" name="extendName" size="20"></span>
                    
                </div>
                <div class="input">
                    <span class="input-title"><label for="listNum">后台列表显示条数：</label></span>
                    <span class="input-con"><input type="number" class="listNum" id="listNum" v-model:number="listNum" name="listNum" min="0" max="100"></span>
                </div>
                <div class="input">
                    <span class="input-title"><label for="author">作者：</label></span>
                    <span class="input-con"><input type="text"  id="author" v-model="author" name="author"  size="20"></span>
                </div>
            </form>
            <div class="input padding"><input class="btn marginLeft " type="button" value="提交" @click="goSub"></div>
            <sub-ok v-bind:subData="propData" v-on:refresh="refreshPage" v-on:returnEdit="reEdit"></sub-ok>
        </div>
    </div>
</template>

<script>
    import util from '../../../static/util.js'
    import subOk from '../tinyComp/SubOk.vue'
    import nowPosition from '../tinyComp/NowPosition.vue'
    export default {
        name: "sys-basic",
        components:{
            subOk,
            nowPosition
        },
        inject:['reload'],
        data:function(){
            return {
                webName:'',
                webUrl:'',
                keyword:'',
                description:'',
                indexPath:'/',
                pagePath:'/',  
                indexModel:1,
                pageModel:1,
                buildCol:1,
                buildArt:1,
                buildFaCol:1,
                buildFaArt:1,
                extendName:'index.html',
                listNum:10,
                author:'',
                propData:{showSub:false,status:0,act:'修改',pageName:'设置',router:'sysBasic'},
                posiList:[{name:'网站基本设置'}],
            }
        },
        created(){
            this.axios({
                method:'get',
                url:'/admin/getSetting'
            }).then(res=>{
                if(res.status===200){
                    let result=res.data
                    this.webName=result.webName
                    this.webUrl=result.webUrl
                    this.keyword=result.keyword
                    this.description=result.description
                    this.indexPath=result.indexPath
                    this.pagePath=result.pagePath
                    this.indexModel=result.indexModel
                    this.pageModel=result.pageModel
                    this.buildCol=result.buildCol
                    this.buildFaCol=result.buildFaCol
                    this.buildArt=result.buildArt
                    this.buildFaArt=result.buildFaArt
                    this.listNum=result.listNum
                    this.extendName=result.extendName
                    this.author=result.author
                }
            })
        },
        computed:{
            userIcon:function(){
                if(this.haveIcon==0){
                    return true
                }
                else{
                    return false
                }
            }
        },
        methods:{
            goSub(){
                this.propData.showSub=true
                let formData=new FormData(webSetting)
                this.axios({
                    method:'post',
                    url:'/admin/upSetting',
                    data:formData
                }).then(res=>{
                    if(res.status===200){
                        this.propData.status=1
                        if(res.data.myStatus===1){
                            this.propData.resStatus=1
                            let changeObj={
                                webName:this.webName,
                                buildCol:this.buildCol,
                                buildFaCol:this.buildFaCol,
                                buildArt:this.buildArt,
                                buildFaArt:this.buildFaArt,
                                indexModel:this.indexModel,
                                pageModel:this.pageModel,
                                indexPath:this.indexPath,
                                pagePath:this.pagePath,
                                listNum:this.listNum,
                                extendName:this.extendName,
                                webUrl:this.webUrl
                            }
                            this.$store.commit('changeWebSetting',changeObj)
                        }else{
                            this.propData.resStatus=2
                        }
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
        },
        mounted(){
            util.addEvent()
        }
    }
</script>

<style lang="less" scoped>

</style>
