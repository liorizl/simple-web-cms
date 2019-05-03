<template>
    <div class="container">
        <div class="left">
            <ul class="singleCol">
                <li @click="goLink('tagList',1,1)" :class="liClass[0]">静态标签</li>
                <li @click="goLink('dynaTagShow',2,2)" :class="liClass[1]">动态标签</li>
                <li @click="goLink('tagList',3,3)" :class="liClass[2]">SQL标签</li>
                <li @click="goLink('tagTempList',4,4)" :class="liClass[3]">标签模版</li>
            </ul>
        </div>
    <div class="line" draggable="true"></div>
    <div class="right">
        <router-view ></router-view>
    </div>
  </div>
</template>

<script>
import util from '../../../static/util.js'
export default {
    name: "tag",
    data(){
        return{
            id:null,
            liClass:['active','','','']
        }
    },
    created(){
        if(this.$route.query.type) this.noActive(this.$route.query.type)
    },
    methods:{
        noActive(i){
            this.liClass=this.liClass.map((li,index)=>{
                if(i-1===index){
                    return 'active'
                }else{
                    return ''
                }
            })
        },
        goLink(temp,type){
            this.noActive(type)
            this.$router.push({name:temp,query:{type:type}})
        }
    },
    mounted(){
        util.addEvent()
    }
};
</script>

<style scoped>
</style>