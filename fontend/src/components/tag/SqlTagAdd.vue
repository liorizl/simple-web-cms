<template>
    <div class="rightCon">
        <now-position v-bind:posList="posiList"></now-position>
        <div class="ccon">
            <form name='sqlTag'>
                <div class="input">
                    <span class="input-title"><label for="title">标签名称</label></span>
                    <span class="input-con">
                        <input type="text" id="title" v-model="title" name="title">
                    </span>
                </div>
                <div class="input">
                    <span class="input-title"><label for="callName">标签调用名</label></span>
                    <span class="input-con">
                        <input type="text" id="callName" v-model="callName" name="callName">
                        调用格式[litag]sql.nav(param0,param1,param2)[/litag]
                    </span>
                </div>
                <div class="input">
                    <span class="input-title"><label for="sqlContent">SQL查询语句</label></span>
                    <span class="input-con padding">
                        <textarea name="sqlContent" id="sqlContent" cols="100" rows="10" v-model="sqlContent"></textarea><br>
                        <span  class="noCon">需要有一定的sql基础，只能做简单的查询，只支持select语句</span>
                    </span>
                </div>
                <div class="input">
                    <span class="input-title"><label for="sqlListContent">输出字段</label></span>
                    <span class="input-con padding">
                        <textarea name="sqlListContent" id="sqlListContent" cols="100" rows="15" v-model="sqlListContent"></textarea>
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
    name: 'addSqlTag',
    components: {
        nowPosition,
        subOk
    },
    inject: ['reload'],
    data() {
        return {
            act: this.$route.params.act,
            id: this.$route.query.id || null,
            title: null,
            callName: null,
            sqlContent: null,
            sqlListContent: null,
            posiList: [{ url: { temp: 'tagList', query: { type: 3 } }, name: 'SQL标签' }],
            propData: { showSub: false, status: 0, pageName: 'SQL标签', router: 'tagList', query: { type: 3 } },
        }
    },

    created() {
        if (this.act === 'edit') {
            this.propData.act = '编辑'
            this.axios({
                method: 'get',
                url: '/admin/getSqlTag?id=' + this.id
            }).then(res => {
                if (res.status === 200) {
                    let resData = res.data[0]
                    this.title = resData.title
                    this.callName = resData.callname
                    this.sqlContent = resData.sqlcontent
                    this.sqlListContent = resData.listcontent
                    this.posiList.push({ name: '编辑标签' })
                    this.posiList.push({ name: resData.title })
                }
            })
        } else {
            this.posiList.push({ name: '添加标签' })
            this.propData.act = '添加'
        }
    },
    methods: {
        goSubmit() {
            let url, formData;
            this.propData.showSub = true
            if (this.act === 'add') {
                url = '/admin/upSqlTag?act=add'
            }
            else if (this.act === 'edit') {
                url = '/admin/upSqlTag?act=edit&id=' + this.id
            } else {
                console.error('获取的参数不对')
            }
            formData = new FormData(sqlTag)
            this.axios({
                method: 'post',
                url: url,
                data: formData
            }).then(res => {
                if (res.status === 200) {
                    this.propData.status = 1
                    this.propData.resStatus = 1
                }
            }).catch(err => {
                this.propData.status = 1
                this.propData.resStatus = 2
            })
        },
        refreshPage() {
            this.reload()
        },
        reEdit() {
            this.propData.showSub = false
        },
    }
}
</script>
<style  scoped>
</style>