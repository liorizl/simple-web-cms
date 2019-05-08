# 网站后台管理系统
## 安装步骤
* 根据自己的操作系统系统下载安装所需软件nodejs,mysql，redis。本项目使用的nodejs版本为10.15.3,mysql版本为5.7.20,redis为windows64位3.0.503版<br>
* 下载代码,fontend和backend不需要放在一起.分别安装所需的包:在文件目录下进入命令行输入npm install(npm i),如下图<br>
![](http://125.65.109.138:3012/static/otherimg/01.png)<br>
![](http://125.65.109.138:3012/static/otherimg/02.png)
* 使用mysql工具数据库文件lioricms.sql导入到mysql数据库。
* 修改后台配置文件(backend/config/config.json)
```
{
    "version":"v0.1",
    "author":"liori",
    "mysql":{
        "host":"localhost",
        "user":"root",    //数据库用户名
        "password":"123",   //数据库密码
        "prot":"3306",    //数据库端口
        "database":"table"  //数据表名
    },
    "useIdentCode":true,   //登录是否输入认证码
    "identCode":"zyc",     //登录认证码
    "charset":"utf-8",
    "hostName":"localhost",   //后台主机名
    "port":"3010",            //后台端口
    "staticWebName":"web",    //生成静态文件所在文件夹名称
    "staticWebPath":"./",
    "?staticWebPath":"staticWebPath表示相对后台文件夹backend的相对位置"
}
```
## 开始使用
### 本地调试
* 前端目录下运行npm run dev,默认使用3001端口。
* 后端目录下运行node index.js,默认使用3010端口。
* 浏览器输入http://localhost:3001登录，账号:liori,密码:liori1,认证码:zyc。忘记密码将数据库useradmin的userPsd字段值改为597310bd40549241a1a89314c9b55662,密码就为初始的liori1
### 打包上线
* 前端输入npm run build,打包后的文件在/dist下，将这些文件复制到你的服务器上。<br>
![](http://125.65.109.138:3012/static/otherimg/04.png)
* 后端输入npm run build,打包后的文件在/dist下，后台配置文件/config和依赖包/node_modules没有打包，需要将/config文件夹，package.json文件复制到服务器上，并输入npm install安装依赖包,并将打包文件app.js复制到根目录下，运行node app.js.<br>
![](http://125.65.109.138:3012/static/otherimg/05.png)
>>> /web是程序生成的静态网站目录 /statics用来存放使用过程中需要的静态文件，css,js,图片等。
* 用nginx（其他web服务器工具也行）绑定前端地址并设置代理,将
    * http://服务器IP:前端端口/admin代理到http://服务器IP:后端端口/admin<br>
    * http://服务器IP:前端端口/upfiles代理到http://服务器IP:后端端口/upfiles<br>
![](http://125.65.109.138:3012/static/otherimg/03.png)
* 在服务器上打开程序所需端口(已打开请忽略),windows系统在windows防火墙->高级设置->入站规则->新建规则
## 说明
此后台适用于中小型企业及个人的门户网站，功能不是很多，但是使用起来简单方便。推荐将所有页面生成静态文件，再用nginx,iis等工具将静态文件夹绑定到域名。
## 联系我
如果使用过程中有任何疑问可以联系我，当然如果发现有BUG也请联系我修改。
祝使用愉快！
* 邮箱：liori@163.com
* qq：175452504

