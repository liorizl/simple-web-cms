<template>
    <div class="rightCon">
        <now-position v-bind:posList="posiList"></now-position>
        <div class="title">所有字段都不区分大小写</div>
        <div class="tagField">
            <div class="title">全局字段</div>
            <div class="content">
                <span>网站标题: [!--webtitle--]</span>
                <span>网站关键字: [!--webkeywords--]</span>
                <span>网站描述: [!--webdescription--]</span>
                <span>网站作者: [!--webauthor--]</span>
            </div>
        </div>
        <div class="tagField">
            <div class="title">栏目字段</div>
            <div class="content">
                <span>栏目标题: [!--title--]</span>
                <span>栏目关键字: [!--colkeyword--]</span>
                <span>栏目描述: [!--coldescription--]</span>
                <span>栏目链接: [!--colurl--]</span>
                <span>分页导航:[!--pagelist--]</span>
            </div>
        </div>
        <div class="tagField">
            <div class="title">文章字段</div>
            <div class="content">
                <span>文章标题: [!--title--]</span>
                <span>文章关键字: [!--artkeywords--]</span>
                <span>文章描述: [!--artdescription--]</span>
                <span>文章链接: [!--arturl--]</span>
                <span>父栏目字段加上parent,如[!--parenttitle--],[!--parenturl--]</span>
            </div>
        </div>
        <div class="title">其他字段跟数据库相同，请查看数据库</div>
    </div>
</template>

<script>
import nowPosition from '../tinyComp/NowPosition.vue'
export default {
    components:{
        nowPosition
    },
    data () {
        return {
            posiList:[{name:'模版字段'}],
        }
    },

    created(){},

    methods: {}
}
</script>
<style lang="less" scoped>
.tagField{
    width:100%;max-width: 900px;min-width:800px;border:1px solid #999;margin-top:20px;
    .title{width:100%;height:30px;text-align: center;color: #33A0C9;font:bold 18px/30px 'simsun'}
    .content{width:94%;margin:20px auto;display:flex;flex-wrap:wrap;
        span{margin-left:30px;height:40px;}
    }
}
.title{text-align: center;max-width: 900px;min-width:800px;margin-top:20px;}
</style>