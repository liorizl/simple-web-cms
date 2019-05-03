<template>
  <div class="container">
    <div class="left">
        <ul class="singleCol">
            <li @click="buildIndex">生成首页</li>
            <li @click="buildCol('all')">生成所有栏目</li>
            <li @click="buildArt('all')">生成所有文章</li>
            <li @click="buildJs('all')">生成JS文件</li>
        </ul>
    </div>
    <div class="line"></div>
    <div class="right">
        <div class="rightCon">
            <div class="indexCon" v-if="state">{{state}} {{time}}</div>
            <div class="jsCon" v-if="buildJsMes" v-html="buildJsMes"></div>
            <div class="bulid">
                <div class="buildCon">
                    <div class="buildTitle">生成文章</div>
                    <select  multiple v-model="selectArt" size="25">
                        <template v-for="col in colListArr">
                            <option v-bind:value="{cid:col.cid,id:col.id}" v-bind:disabled="col.ultimate==='false'?true:false">{{col.title}}</option>
                        </template>
                    </select>
                    <input class="btn" type="button" value="生成文章" @click="buildArt">
                    <div class="artParam" title="(能传更多栏目,但要多查一次数据库,稍慢！)"><input type="radio" name="artParam" id="idParam" v-model.number="buildArtParam" value="1" >通过ID传参</div>
                    <div class="artParam" title="(不能传太多栏目,少查询一次数据库)"><input type="radio" name="artParam" id="cidParam" v-model.number="buildArtParam" value="2" >通过CID传参</div>
                </div>
                <div class="buildCon">
                    <div class="buildTitle">生成栏目</div>
                    <select  multiple v-model="selectCol" size="25">
                        <template v-for="col in colListArr">
                            <option v-bind:value="col.id">{{col.title}}</option>
                        </template>
                    </select>
                    <input class="btn" type="button" value="生成栏目" @click="buildCol">
                </div>
            </div>
            <div class="notice">注:上面2个列表生成页面用的url(get方式)传参，因为url长度有限制，所以一次不要选太多！</div>
        </div>
    </div>
  </div>
</template>

<script>
import util from '../../static/util.js'
export default {
   data () {
       return {
           state:null,
           time:null,
           config:null,
           buildJsMes:null,
           colListArr:[],
           selectArt:[],
           selectCol:[],
           buildArtParam:1
       }
    },
    created(){
        this.axios({
            url:'/admin/getSysMes'
        }).then(res=>{
            if(res.status===200){
                this.config=res.data
            }
        })
        this.colListArr=this.$store.getters.getColArr
    },
    methods: {
        buildIndex(){
            this.axios({
                method:'get',
                url:'/admin/buildIndex',
                data:{index:true}
            }).then(res=>{
                if(res.status===200){
                    if(res.data.status===1){
                        this.state='生成首页成功'
                        this.time='耗时'+(res.data.time/1000)+'秒'
                    }else{
                        this.state='生成首页失败' 
                        this.time='耗时'+(res.data.time/1000)+'秒'
                    }
                }
            })
        },
        buildArt(all){
            if(!this.config.hostName){
                alert('请稍等，还在获取信息！')
            }
            else if(this.selectArt.length===0&&all!='all'){
                alert('请选择需要生成文章的栏目！')
            }
            else{
                let url,artParam
                artParam=this.buildArtParam===1?
                    'id='+this.selectArt.map(obj=>obj.id):
                    'cid='+this.selectArt.map(obj=>obj.cid)
                url=all==='all'?
                    'http://'+this.config.hostName+':'+this.config.port+'/admin/buildArt':
                    'http://'+this.config.hostName+':'+this.config.port+'/admin/buildArt?'+artParam;
                window.open(url)
            }
        },
        buildCol(all){
            if(!this.config.hostName){
                alert('请稍等，还在获取信息！')
            }
            else if(this.selectCol.length===0&&all!=='all'){
                alert('请选择需要生成文章的栏目！')
            }
            else{
                let url=all==='all'?
                    'http://'+this.config.hostName+':'+this.config.port+'/admin/buildCol':
                    'http://'+this.config.hostName+':'+this.config.port+'/admin/buildCol?id='+this.selectCol;
                window.open(url)
            }
        },
        buildJs(all){
            this.axios({
                url:'/admin/buildJs'
            }).then(res=>{
                if(res.status===200){
                    this.buildJsMes='<span style="color:red">生成JS文件完毕</span><br>名称：'+res.data.name+'   目录： '+res.data.path+'<br>'+
                    '用途:用于操作文章的点击数（每刷新一次+1）和点赞功能<br>'+
                    '引用地址:http://'+this.config.hostName+':'+this.config.port+'/static/js/'+res.data.name+'(注意没有/statics)'+
                    '<br>也可以将到复制到你的网站静态文件夹下面再引入<br>'+
                    '如果网站静态文件目录里面已经有此目录+文件将会优先访问网站目录下的'
                }
            })
        }
    },
    mounted(){
        util.addEvent()
    }
}
</script>
<style  lang="less" scoped>
.indexCon{width:800px;text-align: center;line-height:40px;margin-top:20px;border:1px solid #999;color:#F00;}
.jsCon{width:800px;text-align: center;line-height:40px;margin-top:20px;border:1px solid #999;}
.bulid{width:800px;margin-top:30px;display:flex;justify-content: space-around;}
.buildCon{
    border:1px solid #33A0C9;padding-bottom:10px;
    .buildTitle{width:100%;background-color:#33A0C9;color:#FFF;text-align: center;line-height:30px; }
    select{width:250px;margin:10px;border:1px solid #33A0C9;}
    .btn{display:block;margin:5px auto 20px auto;}
    .artParam{line-height:24px;font-size:14px;text-indent:1em;}
}
.notice{width:90%;margin:30px auto}
</style>