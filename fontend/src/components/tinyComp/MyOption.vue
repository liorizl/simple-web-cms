<template>
    <option :value="colInfo.cid" ><slot></slot></option>
</template>
<script>
export default {
    props: ['colInfo'],
    data() {
        return {
            opt: 'opt'
        }
    },
    methods: {
        change() {
            //console.log(colInfo.path1)
        }
    }
}
</script>