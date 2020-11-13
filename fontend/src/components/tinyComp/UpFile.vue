<template>
<div class="right-back">
    <div class="file-out">
        <div class="ccon">
            <form name="upfile">
                <div class="input">
                    <span class="input-title"><label for="viceTitle">上传文件</label></span>
                    <span class="input-con">
                        <input type="file" name="upfile" @change="checkFile">
                    </span>
                </div>
            </form>
            <div class="errMes">{{fileErrMes}}</div>
            <div class="input">
                <span><input type="button" value="上传" @click="upfile" v-bind:disabled="disable"></span>
            </div>
            <div class="input">
                <span>当前目录：{{filePath}}</span>
                <span>
                    <select v-model="nowCol" @change="getNowCol($event)">
                        <template v-for="col in colListArr">
                            <my-option v-bind:colInfo="col">{{col.title}}</my-option>
                        </template>
                    </select>
                </span>
            </div>
            <ul class="picUl">
                <template v-if="fileNames.length>0">
                    <template v-for="(fileName, index) in fileListShow">
                        <li >
                            <div class="img"><img :src="filePath + '/' + fileName" ref="pic" @click="getPicPath(filePath+'/'+fileName)"></div>
                            <div>...{{fileName.substr(-10)}}</div>
                            <div @click='getFileMes(index, $event)'>查看图片大小</div><div ref='picSize'></div>
                        </li>
                    </template>
                </template>
                <template v-else>
                    <div class="noPic">该栏目没有图片</div>
                </template>
            </ul>
            <div class="input">
                <my-pagination v-bind:pageMessage="pageMes" v-on:pageT="pageTurn"></my-pagination>
            </div>
            <div class="input padding">
                <span><input type="button" value="关闭" @click="closeUpFile"></span>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import myOption from './MyOption.vue'
import myPagination from './MyPagination.vue'
export default {
    components: {
        myOption,
        myPagination
    },
    props: ['upFileShow', 'terminal', 'colCid'],
    data() {
        return {
            cid: this.$route.query.cid || this.colCid,
            filePath: '',
            fileNames: '',
            fileErrMes: '',
            disable: false,
            colList: '',
            colListArr: '',
            pageMes: { status: 0 },
            fileListShow: [],
            num: 4,
            page: 1,
            sum: null,
            nowCol: this.$route.query.cid || this.colCid,
            nowTer: this.terminal
        }
    },
    watch: {
        colCid(newValue) {
            this.cid = newValue
            this.nowCol = newValue
        },
        terminal(newValue) {
            this.terminal = newValue
            this.nowTer = newValue
        },
        upFileShow(newValue) {
            if (newValue === true) this.getAllMes()
        }
    },
    created() {
    },

    methods: {
        getAllMes() {
            let url
            if (this.terminal) {
                url = '/admin/getUpfiles?cid=banner&terminal=' + this.nowTer
            } else {
                url = '/admin/getUpfiles?cid=' + this.cid
            }
            this.axios({
                method: 'get',
                url
            }).then(res => {
                if (res.status === 200) {
                    const resData = res.data
                    this.filePath = resData.path
                    this.fileNames = resData.files
                    this.sum = resData.files.length
                    this.fileListShow = this.fileNames.slice((this.page - 1) * this.num, this.page * this.num)
                    this.pageMes = {
                        num: this.num,
                        page: this.page,
                        sum: this.sum,
                        pageNum: Math.ceil(this.sum / this.num),
                        status: 1
                    }
                }
            })
            this.colListArr = this.$store.getters.getColArr
            
            if (this.terminal) {
                this.colListArr = [
                    {
                        title: 'banner电脑端',
                        cid: 'pc',
                        path: 'upfiles/banner/pc'
                    },
                    {
                        title: 'banner手机端',
                        cid: 'wap',
                        path: 'upfiles/banner/wap'
                    }
                ].concat(this.colListArr)
            }
        },
        upfile() {
            const formData = new FormData(upfile)
            if (formData.get('upfile').name) {
                let url
                if (this.terminal) {
                    url = '/admin/upfile?cid=banner&terminal=' + this.nowTer
                } else  {
                    url = '/admin/upfile?cid=' + this.cid
                }
                this.axios({
                    method: 'post',
                    url: url,
                    data: formData
                }).then(res => {
                    let reg = /[^\/]+\..+/
                    let exec = reg.exec(res.data)
                    this.fileNames.unshift(exec[0])
                    this.fileListShow = this.fileNames.slice((this.page - 1) * this.num, this.page * this.num)
                })
            } else {
                alert('请选择图片')
            }

        },
        pageTurn(e) {
            this.page = e
            this.fileListShow = this.fileNames.slice((this.page - 1) * this.num, this.page * this.num)
            this.pageMes = {
                num: this.num,
                page: this.page,
                sum: this.sum,
                pageNum: Math.ceil(this.sum / this.num),
                status: 1
            }
        },
        getFileMes(index, e) {
            e.target.innerText = this.$refs.pic[index].naturalWidth + 'x' + this.$refs.pic[index].naturalHeight
        },
        getPicPath(path) {
            this.$emit('get-path', path, this.nowTer || null)
        },
        closeUpFile() {
            this.$emit('get-close')
        },
        checkFile() {
            let formData = new FormData(upfile)
            const fileName = formData.get('upfile').name
            const reg = /\.(jpe?g|png|gif)$/
            const regTest = reg.test(fileName)
            if (!regTest) {
                this.fileErrMes = '图片类型错误，只能传入jpg/jpeg/gif/png格式的图片'
                this.disable = true
            } else {
                this.fileErrMes = ''
                this.disable = false
            }
        },
        getNowCol(e) {
            let num = e.target.selectedIndex, url
            if (this.colListArr[num].cid === 'wap' || this.colListArr[num].cid === 'pc') {
                this.nowTer = this.colListArr[num].cid
                url = '/admin/getUpfiles?cid=banner&terminal=' + this.nowTer
            } else {
                url = '/admin/getUpfiles?cid=' + this.colListArr[num].cid
                this.cid = this.colListArr[num].cid
            }
            this.axios({
                method: 'get',
                url: url
            }).then(res => {
                if (res.status === 200) {
                    this.filePath = this.colListArr[num].path
                    const resData = res.data
                    this.filePath = resData.path
                    this.fileNames = resData.files
                    this.sum = resData.files.length
                    this.fileListShow = this.fileNames.slice((this.page - 1) * this.num, this.page * this.num)
                    this.pageMes = {
                        num: this.num,
                        page: this.page,
                        sum: this.sum,
                        pageNum: Math.ceil(this.sum / this.num),
                        status: 1
                    }
                }
            })
        }
    },
    mounted() {

    }
}
</script>
<style lang="less"  scoped>
.right-back {
    background: rgba(100, 102, 102, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 11;
    display: flex;
    align-items: center;
    justify-content: center;
}
.file-out {
    width: 60%;
    min-width: 800px;
    border: 4px solid #33a0c9;
    position: absolute;
    top: 50px;
    left: 100px;
    background-color: #fff;
    .ccon {
        width: 92%;
        margin: 25px auto;
    }
}
.picUl {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}
.picUl li {
    width: 21%;
    height: 200px;
    margin-left: 3%;
    margin-top: 15px;
    overflow: hidden;
    text-align: center;
    border: 1px solid #ededed;
    .img {
        height: 160px;
        width: 100%;
    }
}
.picUl li img {
    width: 100%;
}
.errMes {
    color: #f00;
}
.noPic {
    width: 400px;
    margin: 10px 0 10px 20px;
}
</style>