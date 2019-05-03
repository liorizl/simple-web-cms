<template>
    <div id="appCon" ref="appCon">
        <div id="top" class="flexCol">
            <div class="logo"><i>LioriCMS</i></div>
            <div class="nav">
                <ul class="nav-ul flexCol ">
                    <li class="iconfont"><router-link to="/admin/system/" keep-alive>系统</router-link></li>
                    <li class="iconfont"><router-link to="/admin/article/" keep-alive>文章</router-link></li>
                    <li class="iconfont"><router-link to="/admin/column/" keep-alive>栏目</router-link></li>
                    <li class="iconfont"><router-link to="/admin/temp/" keep-alive>模版</router-link></li>
                    <li class="iconfont"><router-link to="/admin/tag/" keep-alive>标签 </router-link></li>
                    <li class="iconfont"><router-link to="/admin/user/" keep-alive>用户 </router-link></li>
                    <li class="iconfont"><router-link to="/admin/buildHtml/" keep-alive>生成</router-link></li>
                </ul>
            </div>
            <div class="loginOut">
                {{user}}
                <button @click="loginOut">登出</button>
            </div>
        </div>
        <div class="quickNav">
            快速入口:
            <router-link to="/admin/tag/dynaTagShow" tag="a">动态标签语法</router-link>
            <a @click="buildTag" href="javascript:void(0)">快速创建标签</a>
            <router-link to="/admin/system/TagField" tag="a">模版字段介绍</router-link>
            <a @click="openIndex" href="javascript:void(0)">网站首页</a>
        </div>
        <router-view v-if="routerAlive"></router-view>

        <div id="bottom"></div>
    </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import util from '../../static/util.js'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        webSetting:{
            webName:null,
            buildCol:null,
            buildFaCol:null,
            buildArt:null,
            buildFaArt:null,
            backendPort:null,
            hostName:null,
            indexModel:null,
            pageModel:null,
            indexPath:null,
            pagePath:null,
            webUrl:null,
            listNum:null,
            extendName:null,
            colList:[]
        }
    },
    mutations: {
        changeWebSetting(state,obj){
            for(let o in obj){
                if(state.webSetting[o]!==undefined){
                    state.webSetting[o]=obj[o]
                }
            }
        }
    },
    getters:{
        getColArr:state=>{
            let i=0,j=0,newColArr=[]
            const titleAdd=['','--','----','------','--------','----------']
            const getColList=(colList,j)=>{
                colList.forEach(col=>{
                    newColArr[i]={id:col.id,cid:col.cid,ultimate:col.ultimate,path:col.path2?col.path1+'/'+col.path2:col.path1,title:titleAdd[j]+col.title}
                    i++
                    if(col.haveChild!==0){
                        j++
                        getColList(col.haveChild,j)
                        j--
                    }
                })
            }
            getColList(state.webSetting.colList,j)
            return newColArr
        }
    }
})
  export default {
    name: 'admin',
    provide(){
        return {
            reload:this.reload
        }
    },
    store,
    data (){
      return {
        user:'',
        routerAlive:true,
        nameaa:null
      }
    },
    created(){
        const cookieUser=this.$cookies.get('user')
        const cookieUserName=this.$cookies.get('userName')
        if(!cookieUser||!cookieUserName){
            this.$router.push({path:'/login'})
        }else{
            this.user=cookieUserName
            if(cookieUser){
                this.axios({
                    method:'get',
                    url:'/admin/checkSession',
                    params:{cookieUser:cookieUser}
                }).then(res=>{
                    if(res.status===200){
                        if(res.data.myStatus===0){
                            alert('请登录！')
                            this.$router.push({path:'/login'})
                        }
                    }
                })
            }else{
                this.$router.push({path:'/login'})
            }
        }
        if(window.sessionStorage.getItem('webset')){
            this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("webset"))))
        }else{
            this.axios({
                url:'/admin/getSetting'
            }).then(res=>{
                if(res.status===200){
                    this.$store.commit('changeWebSetting',res.data)
                }
            })
            this.axios({
                url:'/admin/getSysMes'
            }).then(res=>{
                if(res.status===200){
                    this.$store.commit('changeWebSetting',{backendPort:res.data.port,hostName:res.data.hostName})
                }
            })
            this.axios({
                url:'/admin/getColList'
            }).then(res=>{
                if(res.status===200){
                    this.$store.commit('changeWebSetting',{colList:res.data})
                }
            }).catch(err=>{
                console.log(err)
            })
        }
        window.addEventListener('beforeunload',()=>{
            window.sessionStorage.setItem('webset',JSON.stringify(this.$store.state))
        })
    },
    methods:{
        loginOut:function(){
            this.axios({
                url:'/admin/deleSession'
            }).then(res=>{
                if(res.status===200){
                    if(res.data.myStatus===1){
                        this.$cookies.remove('user')
                        this.$cookies.remove('userName')
                        this.$router.push({path:'/login'})
                    }else{
                        alert('登出失败！')
                    }
                }
            })
        },
        reload(){
            this.routerAlive=false
            this.$nextTick(()=>{
                this.routerAlive=true
            })
        },
        buildTag(){
            window.open('#/admin/BuildTag','_blank','width=800,height=630')
        },
        openIndex(){
            const webset=this.$store.state.webSetting
            const url=parseInt(webset.indexModel)===1?
                    util.repalceStr(webset.webUrl)+util.repalceStr2(webset.indexPath)+webset.extendName:
                    util.repalceStr(webset.webUrl)+'/showIndex'
            window.open(url)
        }
    }
  }
</script>

<style lang="less" scoped>

</style>

