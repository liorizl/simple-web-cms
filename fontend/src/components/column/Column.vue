<template>
    <div class="container">
        <div class="left">
            <ul class="singleCol">
                <router-link to="/admin/column/ColumnList" tag="li" class="iconfont">管理栏目</router-link>
                <router-link to="/admin/column/ColumnAdd/add" tag="li" class="iconfont">添加栏目</router-link>
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
        name: "column",
        data: function(){
          return{
            act: "add"
          }
        },
        mounted(){
            util.addEvent()
        }
    }
</script>

<style scoped>

</style>
