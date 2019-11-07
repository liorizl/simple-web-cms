<template>
    <div>
        <Editor  id="tinymce" v-model="tinymceHtml" :init="editorInit" @input="emitCon"></Editor>{{watchCon}}
    </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
export default {
    //name: "about",
    components: {
        Editor
    },
    props: ['path', 'tinyHtml', 'cready'],
    data: function () {
        return {
            editorInit: {
                language_url: '/static/tinymce/langs/zh_CN.js',
                language: 'zh_CN',
                skin_url: '/static/tinymce/skins/lightgray',
                height: 300,
                fontsize_formats: '14px 15px 16px 17px 18px 19px 20px 22px 24px 26px 28px 30px 32px 48px',
                selector: 'textarea',
                relative_urls: false,
                image_dimensions: false,
                block_formats: 'Paragraph=p;Div=div;Header 1=h1;Header 2=h2;Header 3=h3;Header 4=h4;Header 5=h5;Header 6=h6',
                plugins: 'code link lists image table colorpicker textcolor wordcount contextmenu',
                toolbar: 'code bold italic underline strikethrough formatselect | fontsizeselect | forecolor backcolor | image alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink  removeformat',
                branding: false,
                images_upload_handler: (blobInfo, success, fail) => {
                    let formData = new FormData()
                    formData.append('upfile', blobInfo.blob())
                    let data = { path: this.path, formData: formData }
                    this.axios({
                        method: 'post',
                        url: '/admin/upArtFile?path=' + this.path,
                        data: formData
                    }).then(res => {
                        success(res.data)
                    }).catch(err => {
                        fail(err)
                    })

                }
            },
            tinymceHtml: ''
        }
    },
    created() {
        //this.$set(this.editorInit, 'document_base_url', this.$store.state.webSetting.webUrl)
    },
    computed: {
        watchCon() {
            if (this.cready) {
                this.tinymceHtml = this.tinyHtml
            }
        }
    },
    mounted() {
        tinymce.init({})

    },
    methods: {
        emitCon() {
            this.$emit('edit-input', this.tinymceHtml)
        }
    }
}
</script>

<style scoped>
</style>