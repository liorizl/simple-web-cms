<template>
    <div>
        <div class="editor" contentEditable="true" @input="showMes"></div>
    </div>
</template>

<script>

export default {
    props: ['value'],
    data() {
        return {
            inner: this.value
        }
    },

    created() { },
    computed: {
        getInner() {

        },
    },
    methods: {
        showMes() {
            this.inner = this.$el.innerHTML
            this.$emit('input', this.inner)
        },
    }
}
</script>
<style  scoped>
.editor {
    width: 800px;
    height: 500px;
    border: 1px solid #f00;
}
</style>