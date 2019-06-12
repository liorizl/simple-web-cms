const fs = require('fs');
const config = require("../config/config.json");
const mysql = require('../function/mysql.js');
const redisClient = require('../function/redis.js');
const util = {
    dateFormat: (time = null)=>{
        time = time || new Date();
        const year = time.getFullYear();
        const month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
        const day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
        const hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
        const minute = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        const second = time.getSeconds() < 10? '0' + time.getSeconds() : time.getSeconds();
        const theDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        return theDate
    },
    repalceStr: (str)=>{   //去掉后面的/
        return /.+\/$/.test(str) ? str.substr(0, str.length-1): str
    },
    repalceStr2: (str,resoure)=>{  //后面加上/
        if(resoure === 'art'){
            return str === '/' ? '' : this.repalceStr(str)
        }else{
            return /.*\/$/.test(str) ? str : str + '/'
        }  
    },
    getPath: (dirname)=>{
        const regexp = /\.{2}\//g
        let pathArr = dirname.split('\\')
        const pathDepth = config.staticWebPath.match(regexp)
        if(pathDepth){
            pathArr.splice(-pathDepth.length)
            pathArr = pathArr.join('\\')
            return pathArr + '\\' + config.staticWebName
        }else{
            return dirname + '\\' + config.staticWebName
        }
        
    },
    formatToDate: (string, type)=>{
        const strArr = string.split(' ');
        if(type === 1){
            return strArr[0]
        }
        else if(type === 2){
           const strArr2= strArr[1].split(':');
           return strArr[0] + ' ' + strArr2[0] + ':' + strArr2[2];
        }else{
            return string
        }
    },
    regexpContent: content=>{
        let result = content.replace(/\"/g, '\\"');
        result = result.replace(/\'/g, "\\'");
        return result
    },
    replaceIntro: content =>{
        let result = content.substr(0, 120);
        result = result.replace(/\"/g, '');
        result = result.replace(/\'/g, "");
        result = result.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
        return result
    },
    getPercent: (num, sum)=>{
        return Math.ceil(((num+1)/sum)*100)
    },
    objKeysToLower: content=>{       //将对象（或数组内的对象）键名变为小写
        const iterationArr = arr=>{
            let newArr = arr.map(ar=>{
                if(Array.isArray(ar)){
                    return iterationArr(ar)
                }else{
                    return iterationObj(ar)
                }
            })
            return newArr
        }
        const iterationObj = obj=>{
            obj = replaceObj(obj)
            for(let o in obj){
                if(typeof obj[o] === 'object'){
                    if(Array.isArray(obj[o])){
                        obj[o] = iterationArr(obj[o])
                    }
                    else{
                        obj[o] = replaceObj(obj[o])
                    }
                }else{
                    return obj
                }
            }
            return obj
        }
        const replaceObj = obj=>{
            let reObj = {}
            Object.keys(obj).forEach((o,index)=>{
                reObj[o.toLowerCase()] = obj[Object.keys(obj)[index]];
            })
            return reObj
        }
        if(typeof content === 'object'&&Array.isArray(content)){
            return iterationArr(content)
        }
        else if(typeof content === 'object'&&!Array.isArray(content)&&content!==null){
            return iterationObj(content)
        }else{
            return content
        }
    },
    compare: (property,order,orders)=>{      //重新排序数组orders格式[['id','desc'],['cid','desc'],['title','asc']]
        return function(a,b){
            let v1 = a[property];
            let v2 = b[property];
            const type = (property1,order1)=>{
                if(typeof a[property1] === 'number'&&typeof b[property1] === 'number'){
                    if(order1 === 'desc'){
                        return b[property1]-a[property1]
                    }
                    else if(order1 === 'asc'){
                        return a[property1]-b[property1]
                    }
                }
                else if(typeof a[property1] === 'string'&&typeof b[property1] === 'string'){
                    if(order1 === 'desc'){
                        return a[property1]<b[property1]?1: -1
                    }
                    else if(order1 === 'asc'){
                        return a[property1]<b[property1]?-1: 1
                    }
                }
            }
            if(v1 === v2){
                const compare2 = (property2,order2,index)=>{
                    if(b[property2] === a[property2]){
                        if(orders[index + 1]){
                            return compare2(orders[index + 1][0],orders[index + 1][1],index + 1)
                        }
                    }
                    else{
                        return type(property2,order2)
                    }
                }
                if(orders[1]) return compare2(orders[1][0],orders[1][1],1)
            }
            else{
                return type(property,order)
            }
        }
    },
    changeRedisCols: async (id,act)=>{
        await new Promise((resolve,reject)=>{
            redisClient.get('cols',(err,v)=>{
                if(err) reject(err)
                else resolve(JSON.parse(v))
            })
        }).then(async colArr=>{
            if(act === 'edit'||act === 'add'){
                let newCol = await mysql.nquery('select * from columns where id = '+id);
                newCol = util.objKeysToLower(newCol);
                colArr[id] = newCol[0]
            }
            else if(act === 'dele'){
                delete colArr[id]
            }
            redisClient.set('cols',JSON.stringify(colArr))
        })
    },
    changeIndent: (myStr,oldInd,newInd)=>{
        let arr = [];
        const indent = newInd-oldInd;
        if(indent === 0) return myStr
        arr = myStr.split(/\r\n/);
        arr = arr.map((str,index)=>{
            if(indent>0){
                return index === arr.length-1 || arr.length === 1?new Array(indent + 1).join(' ') + str: new Array(indent + 1).join(' ') + str + '\r\n'
            }else{
                return index === arr.length-1 || arr.length === 1 ? str.substr(-indent) : new Array(indent + 1).join(' ') + str + '\r\n'
            }
        })
        return arr.join('')
    },
    increaseIndent: (myStr, indentNum, i = null)=>{    //给模版每一行增加缩进(str,缩进数，层数)
        let arr = [];
        arr = myStr.split(/\r\n/);
        arr = arr.map((str,index)=>{
            if(i){
                return index === arr.length-1 || arr.length === 1 ? new Array((indentNum*i) + 1).join(' ') + str : new Array((indentNum*i) + 1).join(' ') + str + '\r\n'
            }else{
                return index === arr.length-1||arr.length === 1 ? new Array(indentNum + 1).join(' ') + str : new Array(indentNum + 1).join(' ') + str + '\r\n';
            }
        })
        return arr.join('')
    },
    increaseIndentLi: (myStr, tempIndent)=>{    //给li或a换行
        let arr;
        arr = myStr.match(/\<(li).*?\>.*?\<\/\1\>/g);
        arr = arr?arr: myStr.match(/\<(a) *.*?\>.*?\<\/\1\>/g);
        // console.log(myStr.match(/\<(a) *.*?\>.*?\<\/\1\>/g))
        if(!arr) return false
        arr = arr.map((str,index)=>{
            if(arr.length === 1){
                return str
            }else{
                if(index === 0){
                    //return str.indexOf('\<') === 0?new Array(tempIndent + 1).join(' ') + str + '\r\n':str + '\r\n';
                    return str + '\r\n';
                }
                else if(index === arr.length-1){
                    return new Array(tempIndent + 1).join(' ') + str.replace(/ *$/,'');
                }
                else{
                    return new Array(tempIndent + 1).join(' ') + str + '\r\n';
                }
            }
        })
        return arr.join('')
    },
    makePaging: (num, now, len, type, url, build = null)=>{
        let html;
        const n = now ? parseInt(now) : 1
        const pageCount = Math.ceil(len/num);
        if(build === null){
            url = url.replace(/\&?page\=[0-9]/,'');
        }
        html = '<div class="pageType1"><ul>';
        html += '<li>共' + pageCount + '页</li>';
        if(pageCount > 0){
            if(n === 1){
                html += '<li>第一页</li>';
            }else{
                if(build === null){
                    html += '<li><a href="' + url + '&page = 1">第一页</a></li>'
                }else{
                    html += '<li><a href="./index.html">第一页</a></li>'
                }
            }
            for(let i = 1; i <= pageCount; i++){
                if(i === n){
                    html += '<li class="now">' + i + '</li>'
                }else{
                    if(build === null){
                        html += '<li><a href="' + url + '&page='+i+'">' + i + '</a></li>'
                    }else{
                        if(i === 1){
                            html += '<li><a href="./index.html">' + i + '</a></li>'
                        }else{
                            html += '<li><a href="./index_' + i + '.html">'  + i + '</a></li>'
                        }
                    }
                }
            }
            if(n === pageCount){
                html += '<li>尾页</li>'
            }else{
                if(build === null){
                    html += '<li><a href="' + url + '&page=' + pageCount + '">尾页</a></li>'
                }else{
                    html += '<li><a href="./index_' + pageCount + '.html">尾页</a></li>'
                }
            }
        }
        html += '</ul></div>'
        return html
    },
    buildPath: async (pathStr, path)=>{    //第一个参数为子路径，格式如：a/b/c,后一个参数为父路径，格式如：./web/html
        const pathArr = pathStr.split("/");
        for(let i of pathArr){
            await util.statPath(path + '/' + i, 'isDir',true).then(myStatus=>{
                if(myStatus === 1 || myStatus === 3){
                    //console.log('循环生成路径成功或路径已经存在');
                    path += '/' + i;
                }
                else{
                    console.log('循环创建路径不成功');
                    return 0;
                } 
            });
        }
    },
    statPath: (path, str, create = null)=>{    
        return new Promise(async (resolve, reject)=>{
            fs.stat(path,async (err, stats)=>{
                if(err){
                    if(err.errno === -4058&&create){   //-4058 路径（文件）不存在则创建
                        fs.mkdir(path, {recursive: true}, error=>{
                            if(error){
                                console.log(error)
                                if(error.errno === -4058){
                                    resolve(0)   //因为路径原因创建失败
                                }
                                else{resolve(-1)}//因为其他原因创建失败
                            }else{
                                resolve(3)   //创建成功
                            }
                        })
                    }
                    else if(err.errno === -4058&&!create){
                        resolve(9)   //9,路径(文件)不存在但是不创建
                    }
                    else{
                        resovle(8)   //读取路径(文件)错误
                    }
                }else{
                    if(str === 'isDir' && stats.isDirectory()){resolve(1)}   //1,存在且为路径
                    else{resolve(stats)}
                }
            })
        })
    }
}
module.exports = util