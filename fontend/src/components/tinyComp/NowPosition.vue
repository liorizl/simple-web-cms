<template>
    <div class="nowPosition">当前位置:
        <template v-for="(pos, index) in posList">
            <template v-if="index<posList.length-1">
                <template v-if="pos.url">
                    <a href="javascript:void(0)" @click="goLink(pos)">{{pos.name}}</a>>
                </template>
                <template v-else>
                    {{pos.name}}>
                </template>
            </template>
            <template v-else>
                <template v-if="pos.url">
                    <a href="javascript:void(0)" @click="goLink(pos)">{{pos.name}}</a>
                </template>
                <template v-else>
                    {{pos.name}}
                </template>
            </template>
        </template>
    </div>
</template>

<script>
export default {
    props: ['posList'],
    data () {
        return {
        }
    },

    created(){
        //console.log(this.posList)
    },

    methods: {
        goLink(pos){
            this.$router.push({name:pos.url.temp, query:pos.url.query})
        }
    }
}
</script>
<style  scoped>
</style>