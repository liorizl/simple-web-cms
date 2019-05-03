<template>
    <div class="container">
        <div class="left">
            <ul class="singleCol">
                <router-link to="/admin/user/UserLoginList" tag="li">登录列表</router-link>
                <router-link to="/admin/user/EditPsd" tag="li">修改密码</router-link>
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
        name: "user",
        mounted(){
            util.addEvent()
        }
    }
</script>

<style scoped>

</style>
