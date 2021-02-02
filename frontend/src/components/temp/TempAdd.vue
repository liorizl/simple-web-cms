<template>
    <div class="rightCon">
        <now-position v-bind:posList="posiList"></now-position>
        <div class="ccon">
            <form method="post" name="formTemp">
                <div class="input">
                    <span class="input-title"><label for="title">模版标题</label></span>
                    <span class="input-con">
                        <input type="text" id="title" v-model="title" name="title">
                    </span>
                </div>
                <div class="input">
                    <span class="input-title"><label for="type">模版所属</label></span>
                    <span class="input-con">
                        <select name="type" id="type" v-model="type">
                            <option value="1" disabled>首页模版</option>
                            <option value="2" disabled>封面页模版</option>
                            <option value="3" disabled>列表页模版</option>
                            <option value="4" disabled>内容页模版</option>
                        </select>
                    </span>
                </div>
                <div class="input">
                    <span class="input-title"><label for="isUse">是否启用</label></span>
                    <span class="input-con">
                        <input type="checkbox" name="isUse" id="isUse" v-model="isUse">{{isUse?'是':'否'}}
                    </span>
                </div>
                <template v-if="type===3">
                    <div class="input">
                        <span class="input-title"><label for="title">标题截取字数</label></span>
                        <span class="input-con">
                            <input type="number" id="titleCut" class="inputNumber" v-model:number="titleCut" name="titleCut" min="0">
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="title">简介截取字数</label></span>
                        <span class="input-con">
                            <input type="number" id="introCut" v-model:number="introCut" name="introCut" class="inputNumber" min="0">
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="title">显示条数</label></span>
                        <span class="input-con">
                            <input type="number" id="num" v-model:number="num" name="num" class="inputNumber" min="0">
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="sqlCondi">sql条件</label></span>
                        <span class="input-con">
                            <input type="text" id="sqlCondi" v-model="sqlCondi" name="sqlCondi">
                            <span>多个用逗号隔开,等号后面的字符串用双引号",（数据库文章表的搜索条件，栏目表只要启用都会搜索）</span>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="sqlOrder">排序</label></span>
                        <span class="input-con">
                            <input type="text" id="sqlOrder" v-model="sqlOrder" name="sqlOrder">
                            <span>多个用逗号隔开</span>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="pagination">分页样式</label></span>
                        <span class="input-con">
                            <select name="pagination" id="pagination" v-model="pagination">
                                <option :value.number="0">不分页</option>
                                <option :value.number="1">上一页 1 2 3  下一页</option>
                                <option :value.number="2">当前第1页 跳转到2页</option>
                                <option :value.number="3">点击查看更多</option>
                            </select>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="dateTypeText">时间格式</label></span>
                        <span class="input-con">
                            <input type="text" id="dateTypeText" v-model="dateTypeText" >
                            <select  id="dateType" v-model="dateType" name="dateType">
                                <option value="1" >y-m-d</option>
                                <option value="2">y-m-d h:m</option>
                                <option value="3">y-m-d h:m:s</option>
                            </select>{{getDateType}}
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="content">模版内容</label></span>
                        <span class="input-con padding">
                            <textarea name="content" id="content" v-model="content" cols="120" rows="18"></textarea>
                            <br>
                            <span style="margin-left:20px;">可以使用：[listtemp]list[/listtemp],分页需要加上标签[!--pagelist--]</span>
                        </span>
                    </div>
                    <div class="input">
                        <span class="input-title"><label for="contentList">循环内容列表</label></span>
                        <span class="input-con padding">
                            <textarea name="contentList" id="contentList" v-model="contentList" cols="120" rows="12"></textarea>
                            <br>
                            <span style="margin-left:20px;">[!--picurl--] [!--title--] [!--intro--]</span>
                        </span>
                    </div>
                </template>
                <template v-else>
                    <div class="input">
                        <span class="input-title"><label for="content">模版内容</label></span>
                        <span class="input-con padding">
                            <textarea name="content" id="content" v-model="content" cols="120" rows="40"></textarea>
                        </span>
                    </div>
                </template>
                <div class="input padding">
                    <input type="button" class="btn marginLeft" @click="subTemp" value="提交">
                </div>
            </form>
        </div>
        <sub-ok v-bind:subData="propData" v-on:refresh="refreshPage"></sub-ok>
    </div>
</template>

<script>
import subOk from '../tinyComp/SubOk.vue'
import nowPosition from '../tinyComp/NowPosition.vue'
export default {
    components: {
        subOk,
        nowPosition
    },
    inject: ['reload'],
    data() {
        return {
            id: null,
            type: this.$route.query.type,
            act: this.$route.params.act,
            tempType: null,
            title: null,
            isUse: true,
            num: 0,
            titleCut: 0,
            introCut: 0,
            sqlCondi: 0,
            sqlOrder: 0,
            pagination: 0,
            dateTypeText: 'y-m-d',
            dateType: '1',
            content: null,
            contentList: null,
            posiList: '加载中。。。',
            propData: { showSub: false, status: 0, pageName: '模版', router: 'tempList', query: { type: this.$route.query.type } }
        }
    },
    created() {
        this.getPos()
        if (this.act === 'edit') {
            this.id = this.$route.query.id
            this.propData.act = '编辑'

            this.axios({
                method: 'get',
                url: '/admin/getEditTemp?id=' + this.id
            }).then(res => {
                if (res.status === 200) {
                    let resData = res.data[0]
                    this.id = resData.id
                    this.title = resData.title
                    this.type = resData.type
                    this.isUse = resData.isUse === 'true' ? true : false
                    this.content = resData.content
                    if (this.type === 3) {
                        this.num = resData.num
                        this.titleCut = resData.titleCut
                        this.introCut = resData.introCut
                        this.contentList = resData.contentList
                        this.sqlCondi = resData.sqlCondi
                        this.sqlOrder = resData.sqlOrder
                        this.pagination = resData.pagination
                        this.dateType = resData.dateType.toString()
                    }
                    this.posiList.push({ name: '编辑模版' })
                    this.posiList.push({ name: resData.title })
                }
            })
        } else {
            this.propData.act = '添加'
            this.posiList.push({ name: '添加模版' })
        }
    },
    computed: {
        getDateType() {
            if (this.dateType === '1') {
                this.dateTypeText = 'y-m-d'
            }
            else if (this.dateType === '2') {
                this.dateTypeText = 'y-m-d h:m'
            }
            else if (this.dateType === '3') {
                this.dateTypeText = 'y-m-d h:m:s'
            }
        },
    },
    methods: {
        subTemp() {
            if (this.pagination && this.num < 1) {
                alert('启用分页一定要设置显示的数量！')
                return
            }
            this.propData.showSub = true
            let formData = new FormData(formTemp);
            if (formData.get('isUse') !== 'on') {
                formData.append('isUse', 'off')
            }
            formData.append('type', this.type)
            if (this.type === '2') formData.set('sqlCondi', this.sqlCondi.replace(/\"/g, '\\"'))
            this.axios({
                method: 'post',
                url: this.id ? '/admin/upTemp?act=' + this.act + '&id=' + this.id : '/admin/upTemp?act=' + this.act,
                data: formData
            }).then(res => {
                this.propData.status = 1
                this.propData.resStatus = 1
            }).catch(err => {
                this.propData.status = 1
                this.propData.resStatus = 2
            })
        },
        getPos() {
            switch (parseInt(this.$route.query.type)) {
                case 1:
                    this.tempType = '首页模版'
                    break
                case 2:
                    this.tempType = '封面页模版'
                    break
                case 3:
                    this.tempType = '列表页模版'
                    break
                case 4:
                    this.tempType = '内容页模版'
                    break
                default:
                    this.tempType = '首页模版'
            }
            this.posiList = [{ url: { temp: 'tempList', query: { type: this.$route.query.type } }, name: this.tempType }]
        },
        refreshPage() {
            this.reload()
        }
    }
}
</script>
<style  scoped>
</style>