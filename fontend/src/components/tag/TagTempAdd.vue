<template>
    <div class="rightCon">
        <now-position v-bind:posList="posiList"></now-position>
        <div class="ccon">
            <form name="tagTemp">
                <div class="input">
                    <span class="input-title"><label for="title">模版标题</label></span>
                    <span class="input-con">
                        <input type="text" id="title" v-model="title" name="title">
                    </span>
                </div>
                <div class="input">
                    <span class="input-title"><label for="title">时间格式</label></span>
                    <span class="input-con">
                        <input type="text" id="dateTypeText" v-model="dateTypeText" >
                        <select  id="" v-model="dateTypeSelect">
                            <option value="y-m-d" checked>y-m-d</option>
                            <option value="y-m-d h:m:s">y-m-d h:m:s</option>
                            <option value="y-m-d h:m">y-m-d h:m</option>
                        </select>{{getDateType}}
                    </span>
                </div>
                <div class="input">
                    <span class="input-title">页面模版内容</span>
                    <span class="input-con padding">
                        <textarea name="pageTemp" id="" cols="100" rows="15" v-model="pageTemp"></textarea>
                    </span>
                </div>
                <div class="input">
                    <span class="input-title">列表内容</span>
                    <span class="input-con padding">
                        <textarea name="listTemp" id="" cols="100" rows="15" v-model="listTemp"></textarea>
                    </span>
                </div>
                <div class="input padding"><input class="btn marginLeft " type="button" value="提交" @click="goSubmit"></div>
            </form>
        </div>
        <sub-ok v-bind:subData="propData" v-on:refresh="refreshPage" v-on:returnEdit="reEdit"></sub-ok>
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
            act: this.$route.params.act,
            id: null,
            title: null,
            titleCut: 0,
            introCut: 0,
            num: 5,
            dateTypeText: null,
            dateType: null,
            dateTypeSelect: 'y-m-d h: m',
            pageTemp: null,
            listTemp: null,
            posiList: [{url: {temp: 'tagTempList', query: {}}, name: '标签模版列表'}],
            propData: {showSub: false, status: 0, pageName: '标签模版', router: 'tagTempList', query: {type: 4}},
       }
    },

    created(){
        if(this.$route.params.act==='edit'){
            const id = this.$route.query.id
            this.propData.act = '编辑'
            this.id = id
            this.axios({
                method: 'get',
                url: '/admin/getTagTemp?id=' + id
            }).then(res=>{
                if(res.status===200){
                    let resData = res.data[0]
                    this.title = resData.title
                    this.dateType = resData.datetype
                    this.pageTemp = resData.tempcontent
                    this.listTemp = resData.listcontent
                    this.posiList.push({name: '编辑标签'})
                    this.posiList.push({name: resData.title})
                }
            })
        }else{
            this.posiList.push({name: '添加标签'})
            this.propData.act='添加'
        }
    },
    methods: {
        goSubmit(){
            let formData = new FormData(tagTemp), url
            this.propData.showSub = true
            if(this.act==='edit'){
                url='/admin/upTagTemp?act=edit&id=' + this.id
            }else{
               url='/admin/upTagTemp?act=add'
            }

            formData.append("timeType", this.dateType)
            this.axios({
                method: 'post',
                url: url,
                data: formData
            }).then(res=>{
                if(res.status === 200){
                    this.propData.status = 1
                    this.propData.resStatus = 1
                }
            }).catch(err=>{
                this.propData.status = 1
                this.propData.resStatus = 2
            })
        },
        refreshPage(){
            this.reload()
        },
        reEdit(){
            this.propData.showSub = false
        },
    },
    computed: {
        getDateType(){
            this.dateTypeText = this.dateTypeSelect
            if(this.dateTypeText==='y-m-d'){
                this.dateType = 1
            }
            else if(this.dateTypeText==='y-m-d h:m:s'){
                this.dateType = 2
            }
            else if(this.dateTypeText==='y-m-d h:m'){
                this.dateType = 3
            }
        }
    }
}
</script>
<style  scoped>
</style>