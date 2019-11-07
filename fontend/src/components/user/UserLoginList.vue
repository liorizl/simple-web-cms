<template>
    <div class="rightCon">
        <now-position v-bind:posList="posiList"></now-position>
        <template v-if="this.userList.length>0">
            <ul class="tinyList1">
                <li>
                    <span class="id">登录名</span>
                    <span class="loginTime">登录时间</span>
                    <span class="loginIp">登录IP</span>
                    <span class="loginAddress">登录地址</span>
                </li>
                <template v-for="user in userList">
                    <li>
                        <span class="id">{{user.userName}}</span>
                        <span class="loginTime">{{user.date}}</span>
                        <span class="loginIp">{{user.ip}}</span>
                        <span class="loginAddress">{{user.address}}</span>
                    </li>
                </template>
            </ul>
        </template>
        <template v-else>
            没有登录过
        </template>
        <my-pagination v-bind:pageMessage="pageMes" v-on:pageT="pageTurn"></my-pagination>
    </div>
</template>

<script>
import nowPosition from "../tinyComp/NowPosition.vue";
import myPagination from "../tinyComp/MyPagination.vue";
export default {
    name: "userLoginList",
    components: {
        nowPosition,
        myPagination
    },
    data() {
        return {
            posiList: [{ url: { temp: "userLoginList" }, name: "登录列表" }],
            userList: "加载中...",
            num: 10,
            sum: null,
            pageMes: { status: 0 }
        };
    },
    created() {
        this.num = this.$store.state.webSetting.listNum;
        this.getLoginList();
    },
    watch: {
        $route(to, from) {
            this.num = this.$store.state.webSetting.listNum;
            this.getLoginList();
        }
    },
    methods: {
        pageTurn(e) {
            this.$router.push({ name: "userLoginList", query: { page: e } });
        },
        getLoginList() {
            const url = !this.$route.query.page
                ? "/admin/getUserList?num=" + this.num
                : "/admin/getUserList?num=" +
                this.num +
                "&page=" +
                this.$route.query.page;
            this.axios({
                url: url
            }).then(res => {
                if (res.status === 200) {
                    this.userList = res.data.result;
                    this.sum = res.data.sum;
                    this.pageMes = {
                        num: this.num,
                        page: parseInt(this.$route.query.page) || 1,
                        sum: res.data.sum,
                        pageNum: Math.ceil(res.data.sum / this.num),
                        status: 1
                    };
                }
            });
        }
    }
};
</script>

<style scoped>
</style>
