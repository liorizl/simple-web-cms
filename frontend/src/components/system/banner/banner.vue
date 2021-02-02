<template>
    <div class="rightCon">
        <now-position v-bind:posList="posiList"></now-position>
        <router-view ></router-view>
    </div>
    
</template>

<script>
import nowPosition from '../../tinyComp/NowPosition.vue'
export default {
    name: "banner",
    components: {
        nowPosition
    },
    inject: ['reload'],
    data: function () {
        return {
            posiList: [{ name: '滚动banner' }]
        }
    },

  created() {},

  methods: {}
}
</script>
<style  scoped>
</style>