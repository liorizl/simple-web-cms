<template>
  <div class="rightCon">
    <now-position v-bind:posList="posiList"></now-position>
    <ul class="colUl">
        <li><span class="id">栏目id</span><span class="ultiPic"></span><span class="title">栏目标题</span><span class="ultimate">终极栏目</span><span class="operate">操作</span></li>
        <template v-if="colListArr.length===0">
            <li class="noCon"> 还没有栏目，请添加</li>
        </template>
        <template v-else-if="typeof colListArr.length==='string'">
            <li>{{colListArr}}</li>
        </template>
        <template v-else >
            <li v-for="(item, index) in colListArr">
                <span class="id">{{item.id}}</span>
                <span class="ultiPic iconfont" :class="item.ultimate==='true'?'isUlti':'notUlti'"></span>
                <span class="title isLink"><a @click="viewCol(item.id, index)">{{item.title}}</a></span>
                <span class="ultimate"><a @click="changeUltimate(item.id, item.ultimate, item.cid, $event, index)" class="edit">{{item.ultimate==='true'?'是':'否'}}</a></span>
                <span class="operate"><a  @click="edit(item.id)" class="edit">编辑</a> | <a @click="dele(item.id, item.title, item.cid)" class="dele">删除</a></span>
            </li>
        </template>
    </ul>
    <sub-ok v-bind:subData="propData" v-on:refresh="refreshPage"></sub-ok>
  </div>
</template>

<script>
import nowPosition from '../tinyComp/NowPosition.vue'
import subOk from '../tinyComp/SubOk.vue'
import util from '../../../static/util.js'
    export default {
        name: "columnList",
        components: {
            nowPosition,
            subOk
        },
        inject: ['reload'],
        data: function(){
            return {
                colListArr: '栏目加载中...',
                posiList: [{name: '栏目列表'}],
                propData: {showSub: false, status: 0, pageName: '栏目'}
            }
        },
        created(){
            this.colListArr = this.$store.getters.getColArr
        },
        methods: {
            edit(id){
                this.$router.push({name: 'columnAdd', query: {id: id}, params: {act: 'edit'}})
            },
            viewCol(id, index){
                let url
                const webSet = this.$store.state.webSetting
                url = parseInt(webSet.pageModel)===1?
                    util.repalceStr(webSet.webUrl) + webSet.pagePath + util.repalceStr2(this.colListArr[index].path):
                    'http://' + webSet.hostName + ':' + webSet.backendPort + '/showColumn?id=' + id
                window.open(url);
            },
            changeUltimate(id, ulti, cid, e, i){
                this.axios({
                    method: 'get',
                    url: '/admin/checkUltimate?cid=' + cid
                }).then(res=>{
                    if(res.status===200){
                        if(res.data===1){
                            alert('该栏目下有子栏目，不能设置为终极栏目！')
                        }else{
                            this.axios({
                                url: '/admin/changeUltimate?id=' + id + '&ulti=' + ulti
                            }).then(res=>{
                                if(res.status===200){
                                    if(res.data.myStatus===1){
                                        e.target.innerText = e.target.innerText === '是' ? '否' : '是'
                                        this.$set(this.colListArr, i, Object.assign(this.colListArr[i], {ultimate: this.colListArr[i].ultimate === 'true' ? 'fasle' : 'true'}))
                                        this.axios({
                                            url: '/admin/getColList'
                                        }).then(res=>{
                                            if(res.status===200){
                                                this.$store.commit('changeWebSetting', {colList: res.data})
                                            }
                                        }).catch(err=>{
                                            console.log(err)
                                        })
                                    }else{
                                        alert('修改失败')
                                    }
                                }
                            })
                        } 
                    }
                })
            },
            dele(id, title, cid){
                this.propData.act = "删除"
                if(confirm("删除栏目将删除该栏目的所有子栏目和文章.\r\n确定删除？\r\nid:" + id + "名称:" + title.replace(/-/g, ""))){
                    this.propData.showSub = true
                    const table='columns' //数据表名
                    this.axios({
                        method: 'get',
                        url: '/admin/dele?table=' + table + '&id=' + id + '&cid=' + cid
                    }).then(res=>{
                        if(res.status === 200){
                            if(res.data.myStatus === 1){
                                this.axios({
                                    url: '/admin/getColList'
                                }).then(response=>{
                                    if(response.status===200){
                                        this.$store.commit('changeWebSetting', {colList: response.data})
                                        this.propData.status = 1
                                        this.propData.resStatus = 1
                                        this.propData.deleNum = {col: res.data.col, art: res.data.art}
                                    }
                                }).catch(err=>{
                                    console.log(err)
                                })
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
            },
        }
    }
</script>

<style scoped>
</style>
