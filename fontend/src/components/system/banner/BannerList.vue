<template>
    <div class="banner">
        <input class="btn" type="button" value="添加" @click="add">
        <ul class="bannerList">
            <li>
                <span class="id">ID</span>
                <span class="title">标题</span>
                <span class="order">排序</span>
                <span class="operate">操作</span>
            </li>
            <template v-if="bannerList.length > 0">
                <li v-for="banner in bannerList">
                    <span class="id">{{banner.id}}</span>
                    <span class="title">
                        <span @click="viewPic(banner.pcurl)">
                            {{banner.title}}
                        </span>
                    </span>
                    <span class="order">{{banner.orderby}}</span>
                    <span class="operate">
                        <router-link :to="{name:'bannerAdd',query: {id: banner.id, act: 'edit'}}" tag="span">编辑</router-link>
                          |  
                        <span  @click="dele(banner.id, banner.title)">删除</span>
                    </span>
                </li>
            </template>
        </ul>
        <sub-ok v-bind:subData="propData" v-on:refresh="refreshPage"></sub-ok>
    </div>
</template>

<script>

import subOk from '../../tinyComp/SubOk.vue'
export default {
    name: "banner-list",
    inject: ['reload'],
    components: {
        subOk
    },
    data: function () {
        return {
            bannerList: [],
            propData: { showSub: false, status: 0, pageName: 'banner' }
        }
    },
    created() {
        this.axios({
            url: '/admin/getBanner'
        }).then(res => {
            this.bannerList = res.data
        })
    },
    computed: {
        
    },
    methods: {
        add() {
            this.$router.push({name: 'bannerAdd', query: {cid: 'banner', act: 'add'}})
        },
        dele(id, title) {
            if (confirm("确定删除？\r\nid:" + id + "标题:" + title)) {
                this.propData.showSub = true
                this.axios({
                    url: '/admin/dele?id=' + id + '&table=banner'
                }).then(res => {
                    if (res.status === 200) {
                        if (res.data.myStatus === 1) {
                            this.propData.status = 1
                            this.propData.resStatus = 1
                        } else {
                            this.propData.status = 1
                            this.propData.resStatus = 2
                        }
                    }
                }).catch(err => {
                    this.propData.status = 1
                    this.propData.resStatus = 2
                })
            }
        },
        refreshPage() {
            this.reload()
        },
        viewPic(picUrl) {
            const webSetting = this.$store.state.webSetting
            const url = 'http://' + webSetting.hostName + ':' +webSetting.backendPort + '/' + picUrl
            window.open(url);
        }
    },
    mounted() {
    }
}
</script>

<style lang="less" scoped>
.banner {
    .bannerList {
        width: 800px;
        li {
            display: flex;
            span {
                text-align: center;
            }
            .id {
                width: 15%;
            }
            .title {
                width: 45%;
                span {
                    cursor: pointer;
                }
            }
            .order {
                width: 15%;
            }
            .operate {
                width: 25%;
                span {
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
