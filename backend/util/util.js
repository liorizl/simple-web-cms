const fs = require('fs');
const config = require("../config/config.json");
const mysql = require('../function/mysql.js');
const redisClient = require('../function/redis.js');
const util = {
    dateFormat: (time = null) => {
        time = time || new Date();
        const year = time.getFullYear();
        const month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
        const day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
        const hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
        const minute = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        const second = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
        const theDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        return theDate
    },
    repalceStr: (str) => {   //去掉后面的/
        return /.+\/$/.test(str) ? str.substr(0, str.length - 1) : str
    },
    repalceStr2: (str, resoure) => {  //后面加上/
        if (resoure === 'art') {
            return str === '/' ? '' : util.repalceStr(str)
        } else {
            return /.*\/$/.test(str) ? str : str + '/'
        }
    },
    getPath: (dirname) => {
        const regexp = /\.{2}\//g
        let pathArr = dirname.split('\\')
        const pathDepth = config.staticWebPath.match(regexp)
        if (pathDepth) {
            pathArr.splice(-pathDepth.length)
            pathArr = pathArr.join('\\')
            return pathArr + '\\' + config.staticWebName
        } else {
            return dirname + '\\' + config.staticWebName
        }

    },
    formatToDate: (string, type) => {
        const strArr = string.split(' ');
        if (type === 1) {
            return strArr[0]
        }
        else if (type === 2) {
            const strArr2 = strArr[1].split(':');
            return strArr[0] + ' ' + strArr2[0] + ':' + strArr2[2];
        } else {
            return string
        }
    },
    regexpContent: content => {
        let result = content.replace(/(\<)|(\>)|(\")/g, (match, p1, p2, p3)=> {
            if (p1) {
                return '\<'
            } else if (p2) {
                return '\>'
            } else if(p3) {
                return '\\"'
            }
            
        });
        return result
    },
    replaceIntro: content => {
        const reg = /\<\/?(?!br ?\/?\>+).*?\>/gs;
        // result = result.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
        let result = content.replace(reg, '');
        result = result.substr(0, 120);
        return result
    },
    getPercent: (num, sum) => {
        return Math.ceil(((num + 1) / sum) * 100)
    },
    objKeysToLower: content => {       //将对象（或数组内的对象）键名变为小写
        const iterationArr = arr => {
            let newArr = arr.map(ar => {
                if (Array.isArray(ar)) {
                    return iterationArr(ar)
                } else {
                    return iterationObj(ar)
                }
            })
            return newArr
        }
        const iterationObj = obj => {
            obj = replaceObj(obj)
            for (let o in obj) {
                if (typeof obj[o] === 'object') {
                    if (Array.isArray(obj[o])) {
                        obj[o] = iterationArr(obj[o])
                    }
                    else {
                        obj[o] = replaceObj(obj[o])
                    }
                } else {
                    return obj
                }
            }
            return obj
        }
        const replaceObj = obj => {
            let reObj = {}
            Object.keys(obj).forEach((o, index) => {
                reObj[o.toLowerCase()] = obj[Object.keys(obj)[index]];
            })
            return reObj
        }
        if (typeof content === 'object' && Array.isArray(content)) {
            return iterationArr(content)
        }
        else if (typeof content === 'object' && !Array.isArray(content) && content !== null) {
            return iterationObj(content)
        } else {
            return content
        }
    },
    compare: (property, order, orders) => {      //重新排序数组orders格式[['id','desc'],['cid','desc'],['title','asc']]
        return function (a, b) {
            let v1 = a[property];
            let v2 = b[property];
            const type = (property1, order1) => {
                if (typeof a[property1] === 'number' && typeof b[property1] === 'number') {
                    if (order1 === 'desc') {
                        return b[property1] - a[property1]
                    }
                    else if (order1 === 'asc') {
                        return a[property1] - b[property1]
                    }
                }
                else if (typeof a[property1] === 'string' && typeof b[property1] === 'string') {
                    if (order1 === 'desc') {
                        return a[property1] < b[property1] ? 1 : -1
                    }
                    else if (order1 === 'asc') {
                        return a[property1] < b[property1] ? -1 : 1
                    }
                }
            }
            if (v1 === v2) {
                const compare2 = (property2, order2, index) => {
                    if (b[property2] === a[property2]) {
                        if (orders[index + 1]) {
                            return compare2(orders[index + 1][0], orders[index + 1][1], index + 1)
                        }
                    }
                    else {
                        return type(property2, order2)
                    }
                }
                if (orders[1]) return compare2(orders[1][0], orders[1][1], 1)
            }
            else {
                return type(property, order)
            }
        }
    },
    changeRedisCols: async (id, act) => {
        await new Promise((resolve, reject) => {
            redisClient.get(config.redis.colName, (err, v) => {
                if (err) reject(err)
                else resolve(JSON.parse(v))
            })
        }).then(async colArr => {
            if (act === 'edit' || act === 'add') {
                let newCol = await mysql.nquery('select * from columns where id = ' + id);
                newCol = util.objKeysToLower(newCol);
                colArr[id] = newCol[0]
            }
            else if (act === 'dele') {
                delete colArr[id]
            }
            redisClient.set(config.redis.colName, JSON.stringify(colArr), (err,res) => {
                if(!err){
                    console.log('redis修改成功')
                }
            })
        })
    },
    changeIndent: (myStr, oldInd, newInd) => {   //好像应该再检查下为负的情况
        let arr = [];
        const indent = Math.abs(newInd - oldInd);
        if (indent === 0) return myStr
        arr = myStr.split(/\r\n/);
        arr = arr.map((str, index) => {
            if (indent > 0) {
                return index === arr.length - 1 || arr.length === 1 ? new Array(indent + 1).join(' ') + str : new Array(indent + 1).join(' ') + str + '\r\n'
            } else {
                
                return index === arr.length - 1 || arr.length === 1 ? str.substr(indent) : new Array(indent + 1).join(' ') + str + '\r\n'
            }
        })
        return arr.join('')
    },
    increaseIndent: (myStr, indentNum, i = null) => {    //给模版每一行增加缩进(str,缩进数，层数)
        if (indentNum <= -1) return myStr
        let arr = [];
        arr = myStr.split(/\r\n/);
        arr = arr.map((str, index) => {
            if (i) {
                return index === arr.length - 1 || arr.length === 1 ? 
                                 new Array((indentNum * i) + 1).join(' ') + str : 
                                 new Array((indentNum * i) + 1).join(' ') + str + '\r\n'
            } else {
                return index === arr.length - 1 || arr.length === 1 ?
                                 new Array(indentNum + 1).join(' ') + str : 
                                 new Array(indentNum + 1).join(' ') + str + '\r\n';
            }
        })
        return arr.join('')
    },
    increaseIndentLi: (myStr, tempIndent) => {    //给li或a换行
        if (tempIndent <= -1) return myStr
        let arr;
        arr = myStr.match(/\<(li).*?\>.*?\<\/\1\>/g);
        arr = arr ? arr : myStr.match(/\<(a) *.*?\>.*?\<\/\1\>/g);
        // console.log(myStr.match(/\<(a) *.*?\>.*?\<\/\1\>/g))
        if (!arr) return false
        // arr = arr.map((str, index) => {
        //     if (arr.length === 1) {
        //         return str
        //     } else {
        //         if (index === 0) {
        //             //return str.indexOf('\<') === 0?new Array(tempIndent + 1).join(' ') + str + '\r\n':str + '\r\n';
        //             return str + '\r\n';
        //         }
        //         else if (index === arr.length - 1) {
        //             return new Array(tempIndent + 1).join(' ') + str.replace(/ *$/, '');
        //         }
        //         else {
        //             return new Array(tempIndent + 1).join(' ') + str + '\r\n';
        //         }
        //     }
        // })
        // return arr.join('')
        arr.forEach((str, index) => {
            if (arr.length === 1) {
                return 
            } else {
                if (index !== 0) {
                    let newStr = new Array(tempIndent + 1).join(' ') + str;
                    myStr = myStr.replace(str, newStr)
                }
            }
        })
        return myStr
    },
    makePaging: (num, now, len, type, url, build = null, colids) => {
        let html;
        const n = now ? parseInt(now) : 1
        const pageCount = Math.ceil(len / num);
        const isBuild = build ? 1 : 0;
        if (build === null) {
            url = url.replace(/\&?page\=[0-9]/, '');
        }
        if (type === 1) {
            html = '<div class="pageType1">\r\n'+new Array(4).join(' ')+'<ul>\r\n';
            html += new Array(8).join(' ') + '<li>共' + pageCount + '页</li>\r\n';
            if (pageCount > 0) {
                if (n === 1) {
                    html += new Array(8).join(' ') + '<li>第一页</li>\r\n';
                } else {
                    if (build === null) {
                        html += new Array(8).join(' ') + '<li><a href="' + url + '&page = 1">第一页</a></li>\r\n'
                    } else {
                        html += new Array(8).join(' ') + '<li><a href="./index.html">第一页</a></li>\r\n'
                    }
                }
                for (let i = 1; i <= pageCount; i++) {
                    if (i === n) {
                        html += new Array(8).join(' ') + '<li class="now">' + i + '</li>\r\n'
                    } else {
                        if (build === null) {
                            html += new Array(8).join(' ') + '<li><a href="' + url + '&page=' + i + '">' + i + '</a></li>\r\n'
                        } else {
                            if (i === 1) {
                                html += new Array(8).join(' ') + '<li><a href="./index.html">' + i + '</a></li>\r\n'
                            } else {
                                html += new Array(8).join(' ') + '<li><a href="./index_' + i + '.html">' + i + '</a></li>\r\n'
                            }
                        }
                    }
                }
                if (n === pageCount) {
                    html += new Array(8).join(' ') + '<li>尾页</li>\r\n'
                } else {
                    if (build === null) {
                        html += new Array(8).join(' ') + '<li><a href="' + url + '&page=' + pageCount + '">尾页</a></li>\r\n'
                    } else {
                        html += new Array(8).join(' ') + '<li><a href="./index_' + pageCount + '.html">尾页</a></li>\r\n'
                    }
                }
            }
            html += new Array(4).join(' ') + '</ul>\r\n</div>'
        } else if (type === 2) {
            html = '<div class="pageType2">';
            html += '<span>共' + pageCount + '页</span>';
            html += '<span class="pageDown" data-page="' + now +'" data-build="'+isBuild+'">跳转到';
            html += '<select class="page-select">';
            for (let i = 1; i <= pageCount; i++) {
                html += '<option value=' + i + '>' + i + '</option>';
            }
            html += '</select>';
            html += '页</span>';
            html += '</div>';
        } else if (type === 3) {
            html = '<div class="pageType3" data-sum="' + len + '" data-ids="'+ colids +'" data-build="'+isBuild+'">加载更多</div>';
        }
        return html
    },
    buildPath: async (pathStr, path) => {    //第一个参数为子路径，格式如：a/b/c,后一个参数为父路径，格式如：./web/html
        const pathArr = pathStr.split("/");
        for (let i of pathArr) {
            await util.statPath(path + '/' + i, 'isDir', true).then(myStatus => {
                if (myStatus === 1 || myStatus === 3) {
                    //console.log('循环生成路径成功或路径已经存在');
                    path += '/' + i;
                }
                else {
                    console.log('循环创建路径不成功');
                    return 0;
                }
            });
        }
    },
    statPath: (path, str, create = null) => {
        return new Promise(async (resolve, reject) => {
            fs.stat(path, async (err, stats) => {
                if (err) {
                    if (err.errno === -4058 && create) {   //-4058 路径（文件）不存在则创建
                        fs.mkdir(path, { recursive: true }, error => {
                            if (error) {
                                console.log(error)
                                if (error.errno === -4058) {
                                    resolve(0)   //因为路径原因创建失败
                                }
                                else { resolve(-1) }//因为其他原因创建失败
                            } else {
                                resolve(3)   //创建成功
                            }
                        })
                    }
                    else if (err.errno === -4058 && !create) {
                        resolve(9)   //9,路径(文件)不存在但是不创建
                    }
                    else {
                        resovle(8)   //读取路径(文件)错误
                    }
                } else {
                    if (str === 'isDir' && stats.isDirectory()) { resolve(1) }   //1,存在且为路径
                    else { resolve(stats) }
                }
            })
        })
    },
    //检索出该栏目下所有的终极子栏目
    ultracolsInCols: async (cids, sqlCondition, id) => {
        const allCols = await new Promise((resolve, reject) => {
            redisClient.get(config.redis.colName, (err, v) => {
                if (err) reject(err)
                else {
                    resolve(JSON.parse(v))
                }
            })
        })
        let condition = sqlCondition ? ',' + sqlCondition : '';
        //参数是id,需要转成cid
        if (id) {
            if (Array.isArray(cids)) {
                cids = cids.map(cid => {
                    const tcol = util.filterCol('id=' + cid, allCols)
                    return tcol[0].cid;
                })
            } else {
                const col = util.filterCol('id=' + cids, allCols);
                cids = col[0].cid;
            }
        }
        return new Promise(resolve => {
            let cols = [];
            const iterateCols = colsArr => {
                colsArr.forEach(col => {
                    if (col.ultimate === 'true') {
                        cols.push(col.cid)
                    } else {
                        iterateCols(util.filterCol('aid=' + col.cid + condition, allCols, null)) 
                    }
                })
            }
            if (Array.isArray(cids)) {
                cids.forEach(cid => {
                    let colsArr1 = util.filterCol('aid=' + cid + condition, allCols, null);
                    if (colsArr1.length === 0) {
                        cols.push(cid)
                    }
                    iterateCols(colsArr1)
                })
            } else {
                let colsArr = util.filterCol('aid=' + cids + condition, allCols, null);
                if (colsArr.length === 0) {
                    resolve(cids)
                } else {
                    iterateCols(colsArr)
                }
            }
            if (cols.length > 1) {
                resolve(cols)
            } else {
                resolve(cols[0])
            }
        })
    },
    filterCol: (condition, colObjs, colOrder) => {
        let cols = [];
        let strArr = condition.split(',');
        strArr = strArr.map(string => {
            const objectArr = string.split('=');
            let object = {}, objKey = objectArr[0], objValue = objectArr[1];
            if (/\"/.test(objValue)) {
                objValue = objValue.replace(/\"/g, '');
            } else {
                objValue = parseInt(objValue);
            }
            object[objKey] = objValue;
            return object
        })
        Object.keys(colObjs).forEach(key => {
            if (util.condiJudge(strArr, colObjs[key])) {
                cols.push(colObjs[key]);
            }
        })
        if (colOrder) {
            let orderArr = colOrder.split('\,');
            orderArr = orderArr.map(order => {
                return order.split(/ +/)
            })
            cols.sort(util.compare(orderArr[0][0], orderArr[0][1], orderArr));
        }
        return cols
    },
    condiJudge: (strArr, col) => {
        if (!col) return false
        let num = 0;
        strArr.forEach(obj => {
            let firstKey = Object.keys(obj)[0];
            if (col[firstKey] !== undefined && col[firstKey] === obj[firstKey]) {
                num += 1;
            }
        })
        if (num === strArr.length) {
            return true
        } else {
            return false
        }
    }
}
module.exports = util