<template>
    <div class="sysCon">
        <h1>欢迎来到{{this.$store.state.webSetting.webName}}后台</h1>
        <ul class="sys">
            <!-- <li><span class="sysTitle">共有栏目:</span><span class="sysValue">个</span></li>
            <li><span class="sysTitle">首页显示栏目:</span><span class="sysValue">个</span></li>
            <li><span class="sysTitle">共有文章：</span><span class="sysValue">篇</span></li> -->
            <li><span class="sysTitle">服务器操作系统：</span><span class="sysValue">{{os}}</span></li>
            <li><span class="sysTitle">后台目录：</span><span class="sysValue">{{webPath}}</span></li>
            <li><span class="sysTitle">nodeJS版本：</span><span class="sysValue">{{nodeVersion}}</span></li>
            <li><span class="sysTitle">VUE版本：</span><span class="sysValue">{{vueVersion}}</span></li>
            <li><span class="sysTitle">MySQL版本：</span><span class="sysValue">{{mysqlVersion}}</span></li>
            <li><span class="sysTitle">编码：</span><span class="sysValue">UTF-8</span></li>
            <li><span class="sysTitle">静态网站目录</span><span class="sysValue">{{staticPath}}  //要修改请修改后台配置文件:confing.json</span></li>
            <li><span class="sysTitle">使用域名/IP：</span><span class="sysValue">{{hostName}}</span></li>
            <li><span class="sysTitle">后台程序端口：</span><span class="sysValue">{{port}}</span></li>
            <li><span class="sysTitle">程序版本：</span><span class="sysValue">{{version}}</span></li>
            <li><span class="sysTitle">配置文件目录：</span><span class="sysValue">{{configPath}}</span></li>
        </ul>
    </div>
</template>

<script>
import pack from "../../../package.json"
export default {
    name: "sys-con",
    data(){
        return{
            os:'',
            webPath:'',
            vueVersion:'',
            nodeVersion:'',
            mysqlVersion:'',
            staticPath:'',
            hostName:'',
            port:null,
            version:'',
            configPath:'',
            staticWebPath:null,
            staticWebName:null
        }
    },
    created(){
        this.vueVersion=pack.dependencies.vue
        this.axios({
            url:'/admin/getSysMes'
        }).then(res=>{
            if(res.status===200){
                let resData=res.data
                this.os=resData.os
                this.webPath=resData.webPath
                this.nodeVersion=resData.nodeVersion
                this.hostName=resData.hostName
                this.port=resData.port
                this.version=resData.version
                this.configPath=resData.webPath+'\\config\\config.json'
                this.staticWebPath=resData.staticWebPath
                this.staticWebName=resData.staticWebName
                this.checkPath()
            }
        })
        this.axios({
            url:'/admin/mysqlVersion'
        }).then(res=>{
            if(res.status===200){
                this.mysqlVersion=res.data
            }
        })
    },
    methods:{
        checkPath(){
            const regexp=/\.{2}\//g
            let pathArr=this.webPath.split('\\')
            const pathDepth=this.staticWebPath.match(regexp)
            if(pathDepth){
                pathArr.splice(-pathDepth.length)
            }
            pathArr=pathArr.join('\\')
            this.staticPath=pathArr+'\\'+this.staticWebName+'\\'
        }
    }
}
</script>

<style lang="less" scoped>
.sysCon{
    width:80%;margin:30px auto;
    h1{text-align: center;}
    .sys{
        border:1px solid #ededed;
        li{
            display: flex;align-items: center;height:30px;border-bottom:1px solid #ededed;text-indent:1em;
            .sysTitle{width:200px;border-right:1px solid #ededed;}
            .sysValue{width:100%;}
        }
    }
}
</style>
