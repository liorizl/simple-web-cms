<template>
    <div class="container">
        <div class="left">
            <ul class="singleCol">
                <li :class="liClass[0]" @click="goLink(1)">首页模版</li>
                <li :class="liClass[1]" @click="goLink(2)">封面页模版</li>
                <li :class="liClass[2]" @click="goLink(3)">列表页模版</li>
                <li :class="liClass[3]" @click="goLink(4)">内容页模版</li>
            </ul>
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
    name: "temp",
    data() {
        return {
            id: null,
            liClass: ['active', '', '', '']

        }
    },
    created() {
        if (this.$route.query.type) this.noActive(parseInt(this.$route.query.type))
    },
    methods: {
        noActive(type) {
            this.liClass = this.liClass.map((li, index) => {
                if (type - 1 === index) {
                    return 'active'
                } else {
                    return ''
                }
            })
        },
        goLink(type) {
            this.noActive(type)
            this.$router.push({ name: 'tempList', query: { type: type } })
        }
    },
    mounted() {
        util.addEvent()
    }
}
</script>

<style scoped>
</style>
