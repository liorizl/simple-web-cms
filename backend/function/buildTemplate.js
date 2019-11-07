const template = title => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>生成${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<style>
#con{width:800px;margin:30px auto;text-align:center;}
#progress{width:400px;margin:10px auto;}
#nowStatus{margin:10px auto;}
#mes{margin:20px auto;}
.red{color:#F00;}
.failed{text-align:left;}
.failed-title{border-bottom:1px solid #999;height:40px;line-height:40px;font-size:18px;}
</style>
<body>
<div id="con">
    <h1 id="title">${title}生成中...请不要刷新此页面</h1>
    <progress id="progress" value="1" max="100"></progress>
    <div id="nowStatus">id为1的文章生成成功！</div>
    <div id="mes">
        当前第<span class="red" id="nowNum">1</span>篇，共<span class="red" id="sum">(计算中...)</span>篇文章
    </div>
    <div class="failed">
        <div class="failed-title">生成失败的${title}</div>
        <ul class="failed-ul">
            <li>无</li>
        </ul>
    </div>
</div>
<script>
function change(proNum,nowNum,nowStatus,failedMes) {
    if (proNum) document.getElementById("progress").value = proNum;
    if (nowNum) document.getElementById("nowNum").innerHTML = nowNum + 1;
    if (nowStatus) document.getElementById("nowStatus").innerHTML = nowStatus;
    var failedHtml = document.getElementsByClassName("failed-ul")[0];
    if (failedMes){
        if(failedHtml.getElementsByTagName("li")[0].innerText !== "无"){
            document.getElementsByClassName("failed-ul")[0].innerHTML = failedHtml.innerHTML + "<li>" + failedMes + "</li>"
        }else {
            document.getElementsByClassName("failed-ul")[0].innerHTML = "<li>" + failedMes + "</li>"
        }
    } 
}
function getSum(sum){
    document.getElementById("sum").innerHTML = sum;
    if(sum === 0 && nowNum)  document.getElementById("nowNum").innerHTML = 0;
}
function buildEnd(mes){
    document.getElementById("title").innerHTML = "生成${title}完毕";
    document.getElementById("nowStatus").innerHTML = mes;
}
</script>
</body>
</html>`
}
module.exports = template