<template>
    <div class="right-back" v-if="subData.showSub">
        <div class="subOk">
            <div class="subOk-c">
                <template v-if="subData.status===0">
                    <div class="subMes">数据提交中...</div>
                </template>
                <template v-else>
                    <div class="subMesRow">
                        <font class="sub-icon iconfont" :class="subData.resStatus===1?'lright':'wrong'"></font>
                        <font class="sub-con" :class="subData.resStatus===1?'rightColor':'wrongColor'">
                            {{subData.act}}{{subData.pageName}}{{subData.resStatus===1?'成功':'失败'}}
                        </font>
                    </div>
                    <div class="subMes" v-if="subData.err">{{subData.err}}</div>
                    <template  v-if="subData.copy">
                        <div class="subMes" v-if="subData.copy.num">共{{subData.act}}{{subData.copy.num}}篇文章</div>
                        <div class="subMes" v-else>原因:{{subData.copy.errMes}}</div>
                    </template>
                    <template v-if="subData.build&&subData.build.status===2">
                        <div class="subMes">正在生成{{subData.build.name}}...</div>
                    </template>
                    <template v-else-if="subData.build&&subData.build.status===1">
                        <div class="subMes">ID为{{subData.build.id}}的{{subData.build.name}}生成成功!</div>
                    </template>
                    <template v-else-if="subData.build&&subData.build.status===0">
                        <div class="subMes">ID为{{subData.build.id}}的{{subData.build.name}}生成失败!</div>
                    </template>
                    <div class="subMes" v-if="subData.errMes">原因：{{subData.errMes}}</div>
                    <template v-if="subData.act==='删除'&&subData.resStatus===1&&subData.deleNum">
                        <div class="subMes">共删除栏目{{subData.deleNum.col}}个，文章{{subData.deleNum.art}}篇</div>
                    </template>
                    <template v-if="subData.resStatus===1">
                        <template v-if="subData.act==='添加'">
                            <div class="subMes">继续添加？</div>
                            <div class="twoBtn"><input class="btn" type="button" value="是" @click="redirPage('refresh')"><input class="btn" type="button" value="否" @click="redirPage()"></div>
                        </template>
                        <template v-else-if="subData.act==='编辑'">
                            <div class="button"><input class="btn" type="button" value="确定" @click="redirPage"></div>
                        </template>
                        <template v-else>
                            <div class="button"><input class="btn" type="button" value="确定" @click="redirPage('refresh')"></div>
                        </template>
                    </template>
                    <template v-else>
                        <template v-if="subData.act==='删除'">
                            <div class="button"><input class="btn" type="button" value="确定" @click="redirPage()"></div>
                        </template>
                        <template v-else>
                            <div class="button"><input class="btn" type="button" value="继续修改" @click="returnEdit"></div>
                        </template>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    /*
    subData:{
        status:0,//0数据提交中，1数据提交结束前端收到信息
        pageName:   //页面名称
        resStatus:0 //1数据提交成功
        act:add   //数据提交方式：添加或修改
        router：   //页面返回路由名称
        query:
        }
    }
    */
    props: {
        subData: {
            status: Number,
            pageName: String,
            resStatus: Number,
            act: String,
            router: String,
            query: Object
        }
    },
    data() {
        return {
            showSub: false
        }
    },
    created() { },
    methods: {
        redirPage(act) {
            if (act === 'refresh') {
                this.$emit('refresh')
            } else {
                const routerName = this.subData.router
                if (this.subData.query) {
                    const query = this.subData.query
                    if (this.$parent.$parent.$parent.$refs.appCon) this.$parent.$parent.$parent.$refs.appCon.scrollIntoView()
                    this.$router.push({ name: routerName, query: query })

                } else {
                    this.$router.push({ name: routerName })
                }
            }
        },
        returnEdit() {
            this.$emit('returnEdit')
        }
    }
}
</script>
<style  lang="less" scoped>
@rightColor: green;
@wrongColor: #f00;
.right-back {
    background: rgba(100, 102, 102, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 11;
    display: flex;
    align-items: center;
    justify-content: center;
}
.subOk {
    width: 400px;
    background-color: #fff;
    opacity: 1;
    border-radius: 10px;
    .subOk-c {
        width: 80%;
        margin: 10px auto 30px auto;
        .subMesRow {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 60px;
            .iconfont {
                font-size: 24px;
            }
            .sub-icon {
                width: 10%;
            }
            .rightColor {
                color: @rightColor;
            }
            .wrongColor {
                color: @wrongColor;
            }
            .sub-icon.lright:before {
                content: "\e611";
                color: @rightColor;
            }
            .sub-icon.wrong:before {
                content: "\e616";
                color: @wrongColor;
            }
            .sub-con {
                margin-left: 15px;
                font-size: 16px;
            }
        }
    }
    .subMes {
        width: 100%;
        text-align: center;
        height: 24px;
        line-height: 24px;
    }
    .twoBtn {
        width: 80%;
        margin: 20px auto;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .button {
        margin: 20px auto;
        text-align: center;
    }
}
</style>