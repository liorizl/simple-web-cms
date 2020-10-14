<template>
    <div class="rightCon">
        <now-position v-bind:posList="posiList"></now-position>
        <div class="tag-intro">
            <div class="tag-title">
                <div class="tag-title-left">标签名称</div>
                <div class="tag-title-right">栏目下文章</div>
            </div>
            <div class="tag-format">
                格式：<input type="text" name="" 
                value="[litag]dynamic.artInCol(栏目ID,模版ID,显示条数,标题截取,简介截取,是否分页,时间显示,附加SQL条件,排序)[/litag]" 
                size="100">
            </div>
            <div class="tag-param">
                <table class="table-param" border="1" cellspacing="0" cellpadding="0">
                    <tr class="top"><td >参数</td><td>参数说明</td></tr>
                    <tr ><td width="20%">1、栏目ID</td><td>self代表当前栏目，0代表所有<span class="red">文章</span>，多个栏目用中单引号并以英文的逗号 , 分割，如'1,2'。<br>
                        注：多个栏目栏目名只会显示第一个，要分别显示栏目名请用dynamic.artInCols()标签<br>
                        当为0的时候会跳过检索栏目直接去查找所有文章(artInCols标签会去检索所有栏目)<br>
                        如果该栏目有子栏目，搜索其子栏目的文章
                    </td></tr>
                    <tr ><td >2、模版ID</td><td>模版ID</td></tr>
                    <tr ><td >3、显示条数</td><td>0表示显示全部，缺省则显示10条</td></tr>
                    <tr ><td >4、标题截取</td><td>0表示不截取</td></tr>
                    <tr ><td >5、简介截取</td><td>0表示不截取</td></tr>
                    <tr ><td >
                        6、显示分页器</td><td>0表示不显示,1,2,3表示分页器样式，默认为0(暂时只有等于1的样式),首页不支持分页标签，请用js控制<br>
                        启用分页需要在标签模版中加入 [!--pagelist--],分页样式表在/statics/static/css/style.css
                    </td></tr>
                    <tr ><td >7、时间显示</td><td>0表示不显示时间,1,2,3表示时间格式</td></tr>
                    <tr ><td >8、附加SQL条件</td><td>没有则填0，多个用英文逗号,隔开，并加上单引号,如:'headLine=1,picUrl!=""',<br>字段属性为数字不加引号,其他都要添加双引号</td></tr>
                    <tr ><td >9、文章排序</td><td>多个用英文的逗号,分割并加上单引号 。 如:'hits,id desc'</td></tr>
                    <tr><td colspan="2">
                        注：该标签前2个参数必填，后面的参数可以省略，但是如果要设置后面的某个参数，该参数前面的参数必须要加上，<br>
                        比如：要设置排序参数，栏目ID到排序参数中间的参数必须写上<br>
                        如：[litag]dynamic.artInCol(self,1,0,0,0,0,0,0,'hits,id desc')[/litag]<br>
                        <p class="red">该标签只能显示所选栏目下的文章，用于终极栏目，栏目下有子栏目将不会显示，如果包含子栏目请用dynamic.artInCols()标签</p>
                    </td></tr>
                </table>
            </div>
        </div>
        <div class="tag-intro">
            <div class="tag-title">
                <div class="tag-title-left">标签名称</div>
                <div class="tag-title-right">循环栏目下文章</div>
            </div>
            <div class="tag-format">
                格式：<input type="text" name="" 
                value="[litag]dynamic.artInCols(栏目ID,模版ID,显示条数,标题截取,简介截取,是否分页,时间显示,附加SQL条件,排序,样式类名)[/litag]" 
                size="100">
            </div>
            <div class="tag-param">
                <table class="table-param" border="1" cellspacing="0" cellpadding="0">
                    <tr class="top" ><td >参数</td><td>参数说明</td></tr>
                    <tr ><td width="20%">1、栏目ID</td><td>self代表当前栏目，0表示所有栏目，多个栏目以英文的逗号 , 分割并加上单引号，如'1,2'。
                    </td></tr>
                    <tr ><td >2、模版ID</td><td>模版ID</td></tr>
                    <tr ><td >3、显示条数</td><td>0表示显示全部，缺省则显示10条，-1将不会显示文章</td></tr>
                    <tr ><td >4、标题截取</td><td>0表示不截取</td></tr>
                    <tr ><td >5、简介截取</td><td>0表示不截取</td></tr>
                    <tr ><td >6、显示分页器</td><td>0表示不显示，<span style="color:red">考虑到现实中多层嵌套分页不大可能使用，所以此分页功能没开发</span></td></tr>
                    <tr ><td >7、时间显示</td><td>0表示不显示时间,1,2,3表示时间格式</td></tr>
                    <tr ><td >8、附加SQL条件</td><td>没有则填0，多个用英文逗号,隔开，并加上单引号,如:'headLine=1,picUrl!=""',<br>字段属性为数字不加引号,其他都要添加双引号</td></tr>
                    <tr ><td >9、文章排序</td><td>多个用英文的逗号,分割并加上单引号 。 如:'hits,id desc'</td></tr>
                    <tr ><td >
                        10、样式类名</td><td>多个用英文的逗号,分割并加上单引号 。 如:'class1,class2',第一个为第一层栏目的类名，第二个为第二层，以此类推
                        缺省或不够将会用'class1,class2,...'代替，<br>如果一层栏目有多个类名则加上中括号,如:'[class-1-1,class-1-2],[class-2-1,class-2-2]'
                    </td></tr>
                    <tr ><td >11、栏目排序</td><td>格式跟文章排序一样,多个用英文的逗号,分割并加上单引号 。 如:'hits,id desc'</td></tr>
                    <tr><td colspan="2">
                        注：用法同artInCol标签，但是此标签可以将所有栏目循环显示出来，不管嵌套多少层，如果显示条数为-1将不会显示文章(artInCol无此功能)。<br>
                        <span style="color:red">因为要逐层检索数据并套入模版，所以程序使用同步的方式，如果栏目嵌套较多解析标签的速度会慢很多！</span>
                    </td></tr>
                    <tr>
                        <td colspan="2">
                            <div class="tdDiv">
                                <div class="tdDiv-left">
                                    <div>页面模版</div>
                                    <textarea style="width:96%;height:210px;" v-model="temp"></textarea>
                                    <div>列表模版</div>
                                    <textarea style="width:96%;height:80px;" v-model="listContent"></textarea>
                                </div>
                                <div class="tdDiv-right">
                                    <p>页面模版属性，其中[loop][/loop]这对标签必须要有，</p>
                                    <p> [loopn][/loopn]没有此标签只会循环一次，二级子栏目将会被忽略，</p>
                                    <p> [listtemp]list[/listtemp]用来循环输入列表模版的内容，可省略，如果显示条数为-1将循环显示栏目，反之显示内容</p>
                                    <p>此标签可以用来循环显示栏目，比如导航。</p>
                                    <p>&lt;ul&gt&lt;/ul&gt换成其他标签如果不显示文章的情况下生成的html源码会有多余的空格。</p>
                                    <p>{$class}标签会解析为类名。</p>
                                    <p>列表模版用&lt;li&gt或&lt;a&gt标签输出的html会换行，其他标签则不会。</p>
                                    <p>如果该栏目下没有子栏目会直接将以[loopn][/loopn]中的格式显示文章，[loop][/loop]内的其他内容将忽略。</p>
                                    <p>如果loopn中还有子栏目，loopn中的循环内容为loop中的，<br>没有的话loopn中的内容为原来loopn中的，如示例中的{{temp2}}
                                        <br>如果loopn中的内容结构跟loop中不一样，可以不用loopn,把loopn以及之间的内容换成一个新标签
                                    </p>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="tag-intro">
            <div class="tag-title">
                <div class="tag-title-left">标签名称</div>
                <div class="tag-title-right">当前位置</div>
            </div>
            <div class="tag-format">
                格式：<input type="text" name="" 
                value="[litag]dynamic.position(标签模版id)[/litag]" 
                size="100">
            </div>
            <div class="tag-param">
                <table class="table-param" border="1" cellspacing="0" cellpadding="0">
                    <tr class="top"><td >参数</td><td>参数说明</td></tr>
                    <tr >
                        <td width="20%">1、标签模版ID</td>
                    <td>省略标签模版ID将会采用默认的样式</td>
                    </tr>
                    <tr><td colspan="2">
                        注：默认样式为{{nowPosiTemp}}
                    </td></tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import nowPosition from '../tinyComp/NowPosition.vue'
export default {
    name: 'addTempTag',
    components: {
        nowPosition
    },
    data() {
        return {
            temp: `<div>[!--title--]</div>
[loop]
<div class="{$class}">
    <div class="{$class}">
        [!--title--]
    </div> 
    [loopn]
    <ul>
        [listtemp]list[/listtemp]
    </ul>
    [/loopn]
</div>
[/loop]`,
            temp2:`<ul>[listtemp]list[/listtemp]</ul>`,
            listContent: `<li><a href="[!--arturl--]" target="_blank">[!--title--]</a></li>`,
            posiList: [{ url: { temp: 'dynaTagShow' }, name: '动态标签简介' }],
            nowPosiTemp: `<div class="nowPosi"><a href=[!--colurl--]>[!--title--]</a> >> [!--title--]</div>`,
        }
    },

    created() {
        this.$parent.$data.liClass = ['', 'active', '', '']
    },

    methods: {}
}
</script>
<style  scoped>
.tag-intro {
    width: 830px;
    margin-top: 20px;
    border: 1px solid #4fb4de;
}
.tag-title {
    position: relative;
    height: 40px;
    background-color: #4fb4de;
    color: #fff;
}
.tag-format {
    margin: 5px auto;
    width: 800px;
}
.tag-title-left {
    width: 15%;
    height: 40px;
    font: bold 16px/40px "simsun";
    text-indent: 1em;
}
.tag-title-right {
    position: absolute;
    width: 100%;
    top: 0;
    font-weight: bold;
    text-align: center;
    height: 40px;
    font: bold 20px/40px "microsoft yahei";
}
.table-param {
    width: 800px;
    margin: 20px auto;
    border-color: rgb(151, 205, 228);
    border-collapse: collapse;
    font-size: 14px;
}
.table-param tr.top {
    background-color: rgb(151, 205, 228);
}
.table-param tr td {
    padding: 5px 0 5px 5px;
}
.tdDiv {
    width: 96%;
    margin: 0 auto;
    display: flex;
    align-items: center;
}
.tdDiv-left {
    width: 60%;
}
.tdDiv-right {
    padding-left: 10px;
}
</style>