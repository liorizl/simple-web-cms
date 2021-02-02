<template>
    <div class="page">
        <template v-if="pageMessage.status===1&&pageMessage.pageNum>1" >
            <template v-if="pageMessage.pageNum!==0">
                <span>共{{pageMessage.pageNum}}页</span>&nbsp;&nbsp;
            </template>
            <template v-if="pageMessage.page===1">
                <span class="nolink">第一页</span>
            </template>
            <template v-else>
                <span class="link" @click="pageTurn(1)">第一页</span>
            </template>
            <span class="pageN">
                <ul>
                    <template  v-for="n in pageMessage.pageNum">
                        <template v-if="pageMessage.page===n">
                            <li class="now">{{n}}</li>
                        </template>
                        <template v-else>
                            <li class="link" @click="pageTurn(n)">{{n}}</li>
                        </template>
                    </template>
                </ul>
            </span>
            <template v-if="pageMessage.pageNum===pageMessage.page">
                <span class="nolink">末页</span>
            </template>
            <template v-else>
                <span class="link" @click="pageTurn(pageMessage.pageNum)">末页</span>
            </template>
            <span>
                <select v-model="pageMessage.page"  @change="pageTurn($event.target.value)">
                    <template v-for="n in pageMessage.pageNum">
                        <option :value="n">{{n}}</option>
                    </template>
                </select>
            </span>
        </template>
        <template v-else-if="pageMessage.pageNum===1||pageMessage.pageNum===0">
        </template>
        <template v-else>
           加载中...
        </template>
    </div>
</template>

<script>
export default {
    props: ['pageMessage'],
    data() {
        return {

        }
    },

    created() {
        //console.log(this.$route.query)
    },
    watch: {

    },
    methods: {
        pageTurn(n) {
            this.$emit('pageT', parseInt(n))
        },
    }
}
</script>
<style lang="less"  scoped>
.page {
    margin-top: 10px;
    margin-bottom: 10px;
    text-indent: 0;
    display: flex;
    > span {
        margin-left: 10px;
        display: inline;
    }
    > span.nolink {
        margin-left: 5px;
        color: #888;
    }
    > span.link {
        margin-left: 5px;
        cursor: pointer;
        color: #333;
    }
    > span.pageN ul {
        display: flex;
        margin-right: 5px;
        li {
            width: 20px;
            height: 20px;
            margin-left: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 0;
        }
        li.now {
            background-color: #33a0c9;
            color: #fff;
            cursor: default;
        }
    }
}
</style>