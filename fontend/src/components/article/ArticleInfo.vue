<template>
    <div class="rightCon">
        <div class="nowPosition">当前位置：文章管理</div>
        <div>共有栏目：{{col}}个(其中显示到导航的有{{colNav}}个,启用的有{{colUse}}个)</div>
        <div>共有文章：{{art}}篇(其中启用的有{{artUse}}篇)</div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            col: null,
            colNav: null,
            colUse: null,
            art: null,
            artUse: null
        }
    },
    created(){
        this.axios({
            url: '/admin/getArtMes'
        }).then(res=>{
            if(res.status === 200){
                const resData = res.data
                this.col = resData.col
                this.colNav = resData.colNav
                this.colUse = resData.colUse
                this.art = resData.art
                this.artUse = resData.artUse
            }
        })
    },

    methods: {}
}
</script>
<style  scoped>

</style>