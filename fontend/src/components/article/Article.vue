<template>
    <div class="container">
        <div class="left">
            <article-left-nav  :colList="colList"  @goNav="goNav" ></article-left-nav>
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
    name:"article-info",
    components: {
        articleLeftNav: {
            name: 'article-left-nav',
            props: ['colList'],
            data(){
                return{
                    activeId: 0,
                    ulClassArr: [],
                    icon: []
                }
            },
            methods: {
                showC(i){
                    let classArr = this.ulClassArr
                    let iconI = this.icon[i] === 'iconDown'?'iconUp': 'iconDown'
                    this.$set(this.icon, i, iconI)
                    this.ulClassArr = this.ulClassArr.map((c, index)=>{
                        if(index === i){
                            return this.ulClassArr[index] === false?true: false
                        }else{
                            return this.ulClassArr[index]
                        }
                    })
                },
            },
            watch: {
                'colList'(){
                    this.colList.forEach(col=>{
                        if(col.haveChild === 0){
                            this.ulClassArr.push(0)
                            this.icon.push(0)
                        }else{
                            this.ulClassArr.push(false)
                            this.icon.push('iconDown')
                        }
                    })
                }
            },
            created(){
                this.colList.forEach(col=>{
                    if(col.haveChild === 0){
                        this.ulClassArr.push(0)
                        this.icon.push(0)
                    }else{
                        this.ulClassArr.push(false)
                        this.icon.push('iconDown')
                    }
                })
            },
            render(h){
                let self = this
                const getActiveClass = (colList, h)=>{
                    let html = [], firstLiClass, firstLiTitle, firstLiEvent
                    const getActiveUl = (colList)=>{
                        let createEArr = colList.map(col=>{
                            return h('ul', getActiveLi(col))
                        })
                        return createEArr
                    }
                    const getActiveLi = (col)=>{
                        const isUlti1 = col.ultimate === 'true' ? 'isUlti1' : 'notUlti1'
                        if(col.haveChild === 0){
                            return [h(
                                'li',
                                {
                                    'class': [isUlti1, 'iconfont', self.activeId === col.id ? 'active' : ''],
                                    //'class': ['colEmp1', 'iconfont', self.activeId === col.id?'active':''],
                                    attrs: {id: col.id},
                                    on: {
                                        click: ()=>{
                                            self.activeId = col.id
                                            this.$emit('goNav', {cid: col.cid, title: col.title, id: col.id})
                                        }
                                    }
                                },
                                col.title
                                )]
                        }else{
                            return [h('li', {'class': [isUlti1, 'iconfont', self.activeId === col.id?'active':''], attrs: {id: col.id}}, col.title), getActiveUl(col.haveChild)]
                        }
                    }
                    const getActive = (colList, i, index = null)=>{
                        if(colList){
                            if(i === 0){
                                for(let [k, col] of colList.entries()){
                                    firstLiClass = col.haveChild === 0?'colEmp': 'colExist'
                                    firstLiTitle = col.ultimate === 'true'?'isUlti': 'notUlti'
                                    html.push(
                                        h('li',
                                        {
                                            'class': [firstLiClass, 'iconfont', 'liFirst', self.activeId === col.id?'active': ''],
                                            on: {
                                                click: ()=>{
                                                    this.activeId = col.id
                                                    firstLiEvent = col.haveChild === 0?'goNav': ''
                                                    if(col.haveChild!==0) this.showC(k)
                                                    this.$emit(firstLiEvent, {cid: col.cid, title: col.title, id: col.id})
                                                }
                                            },
                                        },
                                        [
                                            h('span', {'class': [firstLiTitle, {title: true}]}, col.title),
                                            h('span', {'class': ['icon', this.icon[k]]})
                                        ]
                                        )
                                    )
                                    if(col.haveChild!==0){
                                        getActive(col.haveChild, 1, k)
                                    }
                                }
                            }else if(i === 1){
                                //html.push(h('transition', {attrs: {name: 'fade'}}, h('div', getActiveUl(colList))))
                                html.push(h('div', {style: {display: this.ulClassArr[index] === true ? '' : 'none'}}, getActiveUl(colList)))
                            }
                        }else{
                            return '数据加载中...'
                        }
                    }
                    getActive(colList, 0)
                    return html
                }
                if(this.colList.length === 0){
                    return h('div',
                        {
                            style: {
                                'text-align': 'center',
                                'margin-top': '20px',
                                'cursor': 'pointer',
                                'text-decoration': 'underline'
                            },
                            on: {
                                click: ()=>{
                                    this.$router.push({name: 'columnAdd', params: {act: 'add'}})
                                }
                            }
                        },
                        '还没有栏目,点击添加栏目')
                }
                else{
                    return h(
                    'ul',
                    {
                        'class': {
                            leftColList: true
                        }
                    },
                    getActiveClass(this.colList,h)
                )
                }
            },
        }
    },
    data: function(){
        return{
            colList: null,
            html: null,
            icon: [],
            ulClassArr: [],
            activeClass: {id: 0},
            activeClassId: 0
        }
    },
    created: function(){
        this.colList = this.$store.state.webSetting.colList
    },
    methods: {
        goNav(e){
            this.activeClassId = e.id
            if(this.$parent.$refs.appCon) this.$parent.$refs.appCon.scrollIntoView()
            this.$router.push({name: 'articleList', query: {cid: e.cid}, params: {title: e.title}})
        },
    },
    mounted(){
        util.addEvent()
    }
}
</script>

<style  lang="less">
@icon-margin-right: 40px;
@li-background-color:#999;
.flexColInArt{display:flex;justify-content: space-between;align-items: center;}
.flexLeft{display:flex;justify-content: flex-start;align-items: center;}
.flexCenter{display: flex;justify-content: center;align-items: center;}
.outLiHover{background-color:@li-background-color;color:#FFF !important;}
.inLiHover{text-decoration:none;color:#33A0C9;}
.leftColList{
    width:80%;min-width:210px;max-width:410px;margin:0 auto;margin-top:20px;
    li{
        max-width:100%;height:26px;margin:0 auto;line-height:26px;list-style: none;
        span:before,span:after{width:18px;height:18px;
        .flexCenter()}
        .title{
            .flexLeft();
            text-indent:.5em;
        }
    }
    ul{margin-left:22px;border-left:1px dashed #ccc;overflow: hidden;}
    >li{
        width:100%;height:36px;margin:0 auto;line-height:30px;cursor: pointer;border:1px solid #F00;
        background-color:#f7f5f5;margin-top:10px;border:1px solid #ededed;
        .flexColInArt();
    }
    >li:hover{.outLiHover()}
    .notUlti:before,.notUlti1:before{
        content:"\e66f";font-size:14px;margin-right:5px;
    }
    .colExist {
        .icon:before{
            font-size:14px;margin-right:@icon-margin-right;
        }
        .iconDown:before{
            content:"\e603";
        }
        .iconUp:before{
            content:"\e672";
        }
    }
    .isUlti:before,.isUlti1:before{
        content:"\e713";font-size:18px;margin-right:5px;
    }
    .colEmp .icon:before{
        content:"\e60d";font-size:12px;margin-right:@icon-margin-right;
    }
    .colEmp,.colEmp1,.isUlti1{cursor:pointer;display: flex;align-items: center;}
    .colEmp:hover,.isUlti1:hover{.inLiHover()}
    .colEmp:before:hover,.isUlti1:before:hover{text-decoration:none}
    .ulHide{display:none;}
    .ulShow{display:inherit}
    .fade-enter-active,.fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to {
        opacity:0;
    }
    .active{
        .inLiHover();
        background-color:#ededed;
    }
    .colEmp1.active::after,.isUlti1.active::after{
        content:"\e60d";font-size:12px;margin-left:10px;
        }
    >li.active{
        .outLiHover()
    }
}
</style>
