<template>
  <div class="container">
    <div class="left">
        <ul class="singleCol">
            <router-link to="/admin/system/SysCon" tag="li" >系统信息</router-link>
            <router-link to="/admin/system/SysBasic" tag="li" >网站设置</router-link>
            <router-link to="/admin/system/TagField" tag="li" >模版字段</router-link>
            <router-link to="/admin/system/banner/" tag="li" >轮播banner</router-link>
        </ul>
    </div>
    <div class="line" draggable="true"></div>
    <div class="right">
      <router-view ></router-view>
    </div>
  </div>
</template>

<script>
export default {
    name: "system",
}
</script>

<style scoped>
</style>
