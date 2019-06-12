const mysql = require('../function/mysql.js');
const util = require('../util/util.js');
const redisClient = require('../function/redis.js');
const config=require("../config/config.json");
const beginReplace = async (html, ...arg)=>{
    let regMatch, regExpAll, regExpG, promiseArr=[], promiseEnd, sum=null, num=null, pageList=null;
    regExpAll = /\[(litag)\].+\[\/\1\]/;
    regExpG = / *?\[(litag)\].+\[\/\1\]/g;
    regMatch = html.match(regExpG);
    if(regMatch){
        regMatch.forEach((ele, index) => {
            promiseArr[index] = replaceTag(ele, regExpAll, ...arg)
        });
        promiseEnd = await Promise.all(promiseArr);
        regMatch.forEach((ele, index) => {
            html = html.replace(ele, promiseEnd[index].htmlC || promiseEnd[index])
            if(promiseEnd[index].sum){
                num = promiseEnd[index].num;
                sum = promiseEnd[index].sum;
            }
            if(promiseEnd[index].pageList){
                pageList = promiseEnd[index].pageList
            }
        });
    }
    if(arg[4] === 'build'){
        return {htmlC: html, num: num, sum: sum, pageList: pageList}
    }
    else{
        return html
    }
}
const replaceTag = async (tag, regExpAll, ...arg)=>{
    const regExp = /^ *?\[(litag)\](.*)\[\/\1\]$/;
    const tagIndent = tag.indexOf('\[');
    const expTagName = /^[a-zA-Z]+?(?=\.)/;
    return new Promise((resolve)=>{
        let resExec = regExp.exec(tag);
        if(resExec){
            let tagNameExec = expTagName.exec(resExec[2]);
            if(tagNameExec){
                let tagName = tagNameExec[0];
                let tagStr = resExec[2].replace(tagName + '.' , "");
                switch (tagName){
                    case 'temp':
                        replaceHtml(tagStr, regExpAll, tag).then(html=>{
                            html = util.increaseIndent(html, tagIndent);
                            resolve(html)
                        });
                        break;
                    case 'dynamic':
                        replaceDynamicTag(tagStr, regExpAll, tag, ...arg).then(html=>{
                            if(typeof html === 'object'){
                                html.htmlC = util.increaseIndent(html.htmlC, tagIndent);
                            }else{
                                html = util.increaseIndent(html, tagIndent);
                            }
                            resolve(html)
                        });
                        break;
                    case 'sql': 
                        replaceSqlTag(tagStr, regExpAll, tag, ...arg).then(html=>{
                            html = util.increaseIndent(html, tagIndent);
                            resolve(html)
                        });
                        break;
                    default:
                        resolve('没有这种格式的标签：' + tag + '<br>');
                }
            }else{
                resolve('标签' + tag + '的格式不对<br>')
            }
        }else{
            resolve('标签' + tag + '的格式不对<br>')
        }
    })
}
const replaceHtml = async (tagStr, regExpAll, tag)=>{
    return new Promise(async (resolve, reject)=>{
        let result, resExec;
        const sql = 'select * from tag where callName="' + tagStr + '"';
        result = await mysql.nquery(sql);
        if(result.length === 0){
            resolve('<div>没有此标签!' + tag + '</div>')
        }else{
            result = result[0].content;
            resExec = regExpAll.exec(result)
            if(resExec){
                beginReplace(result).then(html=>{
                    resolve(html)
                })
            }else{
                resolve(result)
            }
        }
    })
}
const replaceDynamicTag = async (tagStr, regExpAll, tag, ...arg)=>{
    return new Promise(async (resolve, reject)=>{
        let dynaTagName;
        dynaTagName = /^[a-zA-Z]+?[0-9]?(?=\()/.exec(tagStr);
        if(dynaTagName){
            dynaTagName = dynaTagName[0];
            switch (dynaTagName){
                case 'artInCol':
                    repalaceArtInCol(tagStr, regExpAll, tag, ...arg).then(html=>{
                        resolve(html)
                    }).catch(err=>{
                        reject(err)
                    });
                    break;
                case 'artInCols':
                    repalaceArtInCols(tagStr, regExpAll, tag, ...arg).then(html=>{
                        resolve(html)
                    }).catch(err=>{
                        reject(err)
                    });
                    break;
                case 'position':
                    replacePosition(tagStr, regExpAll, tag, ...arg).then(async colArr=>{
                        let tagParam = /\((.*?)\)/.exec(tagStr);
                        if(!tagParam){
                            resolve("标签参数错误" + tag)
                        }else{
                            tagParam = tagParam[1] === '' ? 0 : parseInt(tagParam[1]);
                            const sql = 'select * from tagtemp where id=' + tagParam;
                            const resultSql = await mysql.nquery(sql);
                            if(resultSql.length === 0){
                                let str = '<div class="position">';
                                let last = colArr.pop();
                                str += await replaceShortTag('<a href=[!--colurl--]>[!--title--]</a>>>' , {self: colArr} , [] , null, null, null, null, arg[5]);
                                str += last;
                                str += '</div>';
                                resolve(str)
                            }else{
                                let temp = resultSql[0].tempcontent;
                                let list = resultSql[0].listcontent;
                                let last = colArr.pop();
                                let tempReg = /\[(listtemp)\]list\[\/\1\]/.exec(temp);
                                if(tempReg){
                                    let str = await replaceShortTag(list, {self: colArr} , [] , null, null, null, null, arg[5]);
                                    str += last;
                                    temp = temp.replace(tempReg[0] , str);
                                }
                                resolve(temp)
                            }
                        }
                    }).catch(err=>{
                        reject(err)
                    });
                    break;
                default:
                    resolve("没有这种标签" + tag)
            }
        }else{
            resolve("标签格式错误:" + tag + "<br>")
        }
    })
}
const replacePosition = async (tagStr, regExpAll, tag, ...arg)=>{
    return new Promise(async (resolve, reject)=>{
        const sql = 'select * from columns where cid = ';
        let colArr = [];
        const getCol = async (sql, aid, i)=>{
            return new Promise(async (resolve1)=>{
                const returnCol = async (sql, aid, i)=>{
                    let sqlEnd = sql + aid;
                    let result = await mysql.nquery(sqlEnd);
                    if(result.length === 0){
                        resolve([])
                    }else{
                        result = result[0]
                        let url = "/" + result.path1 + "/" + result.path2;
                        colArr[i] = {colurl: url, path1: result.path1, path2: result.path2, title: result.title, id: result.id};
                        if(result.aid === 0){
                            colArr.reverse();
                            resolve1(colArr)
                        }else{
                            returnCol(sql, result.aid, ++i);
                        }
                    }

                }
                returnCol(sql, aid, i)
            })
        }
        if(arg[0] === 'index'){
            resolve('首页不要用当前位置标签')
        }
        else if(arg[0] === 'col'){
            const sqlNowCol = 'select title, aid from columns where id = ' + parseInt(arg[1]);
            const reNowCol = await mysql.nquery(sqlNowCol);
            colArr[0] = reNowCol[0].title;
            if(reNowCol[0].aid === 0){
                resolve(colArr)
            }else{
                getCol(sql, reNowCol[0].aid, 1).then(col=>{
                    resolve(col);
                }).catch(err=>{
                    reject(err);
                })
            }
        }
        else if(arg[0] === 'art'){
            colArr[0] = '浏览文章';
            getCol(sql, parseInt(arg[1]) , 1).then(col=>{
                resolve(col);
            }).catch(err=>{
                reject(err)
            })
        }
    })
}
const repalaceArtInCols = async (tagStr, regExpAll, tag, ...arg)=>{
    arg.push('isLoop');
    return await repalaceArtInCol(tagStr, regExpAll, tag, ...arg)
}
const repalaceArtInCol = async (tagStr, regExpAll, tag, ...arg)=>{
    return new Promise(async resolve=>{
        let tagCon, tarConArr;
        tagCon = /\((.+?)\)/.exec(tagStr);
        if(tagCon){
            tagCon = tagCon[1];
            const paramDivi = tagCon.match(/\'.+?\,*.+?\'/g);
            if(paramDivi && paramDivi.length>0){
                paramDivi.forEach(p=>{
                    tagCon = tagCon.replace(p, p.replace(/\,/g, ':').replace(/\'/g, ''))
                })
            }
            const paramArr = tagCon.split(",");
            tarConArr = paramArr.map(p=>{
                if(/\:+/.exec(p)){
                    return p.replace(/\:/g, ',');
                }else{
                    return p
                }
            })
            if(tarConArr[0] === 'self' && arg[0] === 'index'){
                resolve('标签' + tag + '错误：首页标签第一个参数（栏目名）不能用"self"<br>')
            }
            else{
                const tempId = parseInt(tarConArr[1]);
                const num = tarConArr[2] ? parseInt(tarConArr[2]) : 10  //显示条数
                const titleCut = parseInt(tarConArr[3]) >0 ? parseInt(tarConArr[3]) : 0;  //标题截取长度,0为不截取
                const introCut = parseInt(tarConArr[4]) >0 ? parseInt(tarConArr[4]) : 0;  //简介截取长度,0为不截取
                const paging = tarConArr[5] ? parseInt(tarConArr[5]) : 0;
                const timeStyle = tarConArr[6] ? parseInt(tarConArr[6]) : 0;
                const sqlCondition = tarConArr[7] && parseInt(tarConArr[7]) !== 0 ? tarConArr[7] : '';
                const orderBy = tarConArr[8] && parseInt(tarConArr[8]) !== 0 ? tarConArr[8] : '';
                let tagParams = [];
                tagParams = [num, titleCut, introCut, paging, timeStyle, orderBy, sqlCondition];
                const sqlTemp = 'select * from tagtemp where id = ' + tempId;
                const reTemp = await mysql.nquery(sqlTemp);
                if(reTemp.length === 0){
                    resolve('标签' + tag.replace(/^ */,'') + '错误：标签模版找不到<br>')
                }
                else{
                    let sql, idAll, sqlCondi, order;
                    sqlCondi = sqlCondition ? ' and ' + sqlCondition : '';
                    order = orderBy ? ' order by ' + orderBy : ''
                    if(/\,+/.exec(tarConArr[0])){
                        idAll = tarConArr[0].split(',');
                        idAll.forEach((id, index, idAll)=>{
                            idAll[index] = parseInt(id)
                        })
                        sql = 'select * from columns where id in (' + idAll + ')' + sqlCondi + order;
                    }
                    else if(tarConArr[0] === 'self' && arg[0] === 'col'){
                        sql = 'select * from columns where id = ' + parseInt(arg[1]) + sqlCondi + order;
                    }
                    else if(tarConArr[0] === 'self' && arg[0] === 'art'){
                        sql = 'select * from columns where cid = ' + parseInt(arg[1]) + sqlCondi + order;
                    }
                    else{
                        sql = 'select * from columns where id = ' + parseInt(tarConArr[0]) + sqlCondi + order;
                    }
                    const reSql = tarConArr[0] === '0' ? [0] : await mysql.nquery(sql);
                    if(reSql.length === 0 && tarConArr[0] !==  '0'){
                        resolve('没有内容或标签' + tag + '第一个参数（栏目名）或者标签sql条件不正确，导致查询不到栏目！<br>');
                    }else{
                        let cidAll = [];
                        if(reSql.length >= 2){
                            cidAll = reSql.map(re=>{
                                return re.cid
                            })
                        }
                        let temp = reTemp[0].tempcontent;
                        const tempList = reTemp[0].listcontent;
                        if(arg[6]){     //artInCols标签
                            let styleClass = tarConArr[9]?tarConArr[9]:0;
                            if(styleClass !==  0){
                                const styles = styleClass.match(/(?<=\[).+?(?=\])/g)
                                if(styles && styles.length>0){
                                    styleClass = styles.map(style=>{
                                        return style.split(',')
                                    })
                                }else{
                                    styleClass = styleClass.split(',')
                                }
                            }
                            tagParams.push(styleClass);
                            const colOrderBy = tarConArr[10] && parseInt(tarConArr[10]) !== 0 ? tarConArr[10] : '';
                            if(colOrderBy) tagParams.push(colOrderBy);
                            const regExpLoop = / *\[(loop)\](.*)\[\/\1\] */s;
                            let isLoop = regExpLoop.exec(temp);
                            if(!isLoop){
                                resolve('标签' + tag + '标签模版不正确<br>');
                            }else{
                                const loopStr = isLoop[2];
                                const webset = arg[5];
                                if(reSql.length >= 2){
                                    let tempArr = [] , promiseAll = [];
                                    for(let i = 0; i < reSql.length; i++){
                                        tempArr[i] = await replaceShortTag(temp.replace(isLoop[0] , '') , {self: [reSql[i]]});
                                        promiseAll[i] = recurCol(reSql[i].cid, loopStr, tempList, tagParams, webset);
                                    }
                                    let html = ''
                                    Promise.all(promiseAll).then(htmlArr=>{
                                        htmlArr.forEach((h, i)=>{
                                            html += tempArr[i] + h;
                                        })
                                        resolve(html)
                                    })
                                }
                                else if(reSql[0] === 0){
                                    recurCol(0, loopStr, tempList, tagParams, webset).then(html=>{
                                        temp = temp.replace(regExpLoop.exec(temp)[0] , html)
                                        resolve(temp)
                                    })
                                }
                                else{
                                    temp = await replaceShortTag(temp, {self: [reSql[0]]});
                                    recurCol(reSql[0].cid, loopStr, tempList, tagParams, webset).then(html=>{
                                        temp = temp.replace(regExpLoop.exec(temp)[0] , html)
                                        resolve(temp)
                                    })
                                }
                            }
                        }else{
                            let sql2, sqlWhere = '' , sqlOrder = '' , sqlLimit, artLen = null;
                            const havePageTag = /\[\!--pagelist--\]/i.exec(temp);
                            if(tarConArr[0] === '0'){
                                sqlWhere=''
                            }else{
                                sqlWhere = cidAll.length>1 ? ' where fid in (' + cidAll + ')' : ' where fid=' + reSql[0].cid;
                            }
                            if(num>0 && arg[2] >= 2){
                                sqlLimit = ' limit ' + (num*(arg[2]-1)) + ',' + num;
                            }
                            else{
                                sqlLimit = num > 0 ? ' limit ' + num : '';
                            }
                            if(tarConArr[7] && tarConArr[7] !== '0'){
                                sqlWhere += tarConArr[0] === '0' ? ' where ' + tarConArr[7] : ' and ' + tarConArr[7]
                            }
                            if(orderBy){
                                sqlOrder = ' order by ' + tarConArr[8]
                            }
                            if(paging>0 && num>0){
                                const sqlAll = 'select id from article' + sqlWhere;
                                let artAll = await mysql.nquery(sqlAll);
                                artLen= artAll.length;
                            }
                            sql2 = 'select * from article' + sqlWhere + sqlOrder + sqlLimit;
                            let artList = await mysql.nquery(sql2);
                            if(artList.length === 0){
                                resolve("该栏目下没有文章" + tag + '<br>')
                            }else{
                                temp = tarConArr[0] === '0' ? temp : await replaceShortTag(temp, {self: [reSql[0]]} , [num, 0, 0, paging] , artLen, arg[2] , arg[3] , arg[4] , arg[5]);
                                const tempList = reTemp[0].listcontent;
                                const reg1 = / *?\[(listtemp)\]list\[\/\1\]/;
                                const res1 = reg1.exec(temp);
                                const tempIndent = res1[0].indexOf('\[');
                                let listtempContent = '';
                                if(res1){
                                    listtempContent = await replaceShortTag(tempList, {self: artList, parent: reSql[0]} , tagParams, null, null, null, null, arg[5] , 'linefeed');
                                    listtempContent = util.increaseIndent(listtempContent, tempIndent);
                                    temp = temp.replace(res1[0] , listtempContent);
                                }
                                if(regExpAll.exec(temp)){
                                    beginReplace(temp).then(html=>{
                                        if(arg[4] === 'build' && num>0 && paging >= 1 && havePageTag){
                                            resolve({htmlC: html, num: num, sum: artLen, pageList: 'true'})
                                        }else{
                                            resolve({htmlC: html})
                                        }
                                    })
                                }else{
                                    if(arg[4] === 'build' && num>0 && paging >= 1 && havePageTag){
                                        resolve({htmlC: temp, num: num, sum: artLen, pageList: 'true'})
                                    }else{
                                        resolve({htmlC: temp})
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }else{
            resolve("标签没有参数:" + tag + "<br>")
        }
    })
}
const recurCol = async(cid, loopStr, tempList, tagParams, webset)=>{
    let htmlTempAll = '' , x = 0, y = 0, tempIndent, tempListIndent, tempIndentLoopn;
    const sqlCondition = tagParams[6] ? ',' + tagParams[6].toLowerCase() : '';
    const order = tagParams[5] ? ' order by ' + tagParams[5] : '';
    const colOrder = tagParams[8] ? tagParams[8].toLowerCase() : null;
    const condiJudge = (str, col) => {
        if(!col) return false
        let strArr = str.split(','), num = 0;
        strArr = strArr.map(string=>{
            const objectArr = string.split('=')
            let object = {}, objKey = objectArr[0], objValue = objectArr[1];
            if(/\"/.test(objValue)){
                objValue = objValue.replace(/\"/g, '');
            }else{
                objValue = parseInt(objValue);
            }
            object[objKey] = objValue;
            return object
        })
        strArr.forEach(obj=>{
            let firstKey = Object.keys(obj)[0]
            if(col[firstKey] !==  undefined && col[firstKey] === obj[firstKey]){
                num += 1
            }
        })
        if(num === strArr.length){
            return true
        }else{
            return false
        }
    }
    const filterCol = (condition, colObjs)=>{
        let cols = []
        Object.keys(colObjs).forEach(key=>{
            if(condiJudge(condition, colObjs[key])){
                cols.push(colObjs[key]);
            }
        })
        if(colOrder){
            let orderArr = colOrder.split('\,');
            orderArr = orderArr.map(order=>{
                return order.split(/ +/)
            })
            cols.sort(util.compare(orderArr[0][0], orderArr[0][1], orderArr));
        }
        return cols
    }
    const allCols = await new Promise((resolve, reject)=>{
        redisClient.get(config.redis.colName, (err, v)=>{
            if(err) reject(err)
            else {
                resolve(JSON.parse(v))
            }
        })
    })
    loopStr = loopStr.replace(/^\r\n/,'').replace(/\r\n *$/,'')   //去除开始和结束的换行符
    return new Promise(async (resolve)=>{
        const replaceRecurcol = async(cid, loopStr, tempList, nowIndex, temp = null, i = null, j = null, loopEnd = null)=>{
            if(i) x++;
            if(j) y += j;
            const regLoop = new RegExp('\\ *\\[(loop' + (nowIndex-1) + ')\\](.*)\\[\/\\1\\]', 's');
            const exeLoop = regLoop.exec(htmlTempAll);
            if(!exeLoop && nowIndex>1){
                resolve(htmlTempAll);
                return
            }
            const haveLoopn = /\[(loopn)\].*?\[\/\1\]/s.test(loopStr);
            const expList = /\[(listtemp)\]list\[\/\1\]/;
            const expList1 = / *\[(listtemp)\]list\[\/\1\]/;
            // const sql = 'select * from columns where aid=' + cid + ' and isUse="true"' + sqlCondition + order;
            // const resCol = await mysql.nquery(sql);
            const resCol = filterCol('aid=' + cid + ',isuse="true"' + sqlCondition, allCols);
            if(resCol.length === 0){
                let htmlCon;
                if(tagParams[0] === -1){
                    htmlCon = '';
                }else{
                    let sqlArt;
                    if(tagParams[0] > -1 && tagParams[0] !==  0){
                        sqlArt = 'select * from article where fid=' + cid + order + ' limit ' + tagParams[0];
                    }else{
                        sqlArt = 'select * from article where fid=' + cid + order;
                    }
                    const resArt = await mysql.nquery(sqlArt);
                    htmlCon = resArt.length === 0?
                            '<li>该栏目没有文章!</li>':
                            await replaceShortTag(tempList, {self: resArt},tagParams, null, null, null, null, webset);
                }
                if(nowIndex === 0){
                    let noColTemp = /\[(loopn)\](.*)\[\/\1\]/s.exec(loopStr);
                    if(noColTemp){
                        noColTemp = noColTemp[2]
                        htmlTempAll = noColTemp.replace(expList, htmlCon);
                    }
                    resolve(htmlTempAll)
                }
                else if(nowIndex === 1){
                    temp = temp.replace(/\[loopn\](\r\n)* */, '').replace(/(\r\n)* *\[\/loopn\] */, '');
                    if(!loopEnd) temp = temp + '\r\n';
                    if(expList1.exec(temp)){
                        tempListIndent = expList1.exec(temp)[0].indexOf('\[');
                        htmlCon = util.increaseIndentLi(htmlCon, tempListIndent, 4) ? util.increaseIndentLi(htmlCon, tempListIndent) : htmlCon;
                    }
                    temp = temp.replace(expList, htmlCon);
                    if(loopEnd){
                        htmlTempAll = htmlTempAll.replace(/\[loop0\]\[\/loop0\]/, temp);
                    }else{
                        htmlTempAll = htmlTempAll.replace('[loop0][/loop0]',temp) + '[loop0][/loop0]';
                    }
                }
                else{
                    tempindent = temp.indexOf('\<');
                    temp = temp.replace(/\[loopn\](\r\n) */, '').replace(/(\r\n)* *\[\/loopn\] */, '');
                    tempIndentLoopn = regLoop.exec(htmlTempAll) ? regLoop.exec(htmlTempAll)[0].indexOf('\[') : 0;
                    temp = tempIndentLoopn !== 0 ? util.changeIndent(temp, tempindent, tempIndentLoopn) : temp;
                    tempListIndent = expList1.exec(temp)[0].indexOf('\[')
                    htmlCon = util.increaseIndentLi(htmlCon, tempListIndent, 4) ? util.increaseIndentLi(htmlCon, tempListIndent) : htmlCon;
                    if(loopEnd){
                        temp = temp.replace(/\r\n$/, '')
                        temp = temp.replace(expList, htmlCon)
                    }else{
                        temp = temp.replace(expList, htmlCon) + '\r\n' + new Array(tempIndentLoopn + 1).join(' ') + '[loop' + (nowIndex-1) + '][/loop' + (nowIndex-1) + ']';
                    }
                    if(exeLoop) htmlTempAll = htmlTempAll.replace(exeLoop[0], temp);
                }
                if(x === y){
                    if(tagParams[0] === -1){
                        htmlTempAll = htmlTempAll.replace(/\ *\<(ul)\>.+?\<\/\1\>(\r\n)*/sg, '');
                    }
                    resolve(htmlTempAll)
                }
            }else{
                let htmlTemp = '';
                if(!temp){
                    if(haveLoopn){
                        htmlTempAll = '[loop0][/loop0]'
                    }else{
                        htmlTempAll = await replaceShortTag(loopStr, {self: resCol}, tagParams, null, null, null, null, webset);
                        tempIndent = htmlTempAll.indexOf('\<');
                        htmlTempAll = util.increaseIndentLi(htmlTempAll, tempIndent) ? util.increaseIndentLi(htmlTempAll, tempIndent) : htmlTempAll;
                        resolve(htmlTempAll)
                    }
                }else{
                    tempIndentLoopn = regLoop.exec(htmlTempAll) ? regLoop.exec(htmlTempAll)[0].indexOf('\[') : 0;
                    tempindent = temp.indexOf('\<');
                    temp = tempIndentLoopn !== 0 ? util.changeIndent(temp, tempindent, tempIndentLoopn) : temp;
                    temp = temp.replace(/\r\n$/, '')
                    temp = temp.replace('[loopn]', '[loop' + nowIndex + ']').replace('[/loopn]', '[/loop' + nowIndex + ']');
                    if(!loopEnd){
                        temp = temp + '\r\n' + new Array(tempIndentLoopn + 1).join(' ') + '[loop' + (nowIndex-1) + '][/loop' + (nowIndex-1) + ']';
                    }
                    if(exeLoop) htmlTempAll = htmlTempAll.replace(exeLoop[0], temp);
                }
                //for(let k = 0;k<resCol.length;k++){
                for(let [k, col] of resCol.entries()){
                    htmlTemp = await replaceShortTag(loopStr, {self: [resCol[k]]}, [], null, null, null, null, webset);
                    let styles = htmlTemp.match(/\{\$class\}/g);
                    if(Array.isArray(styles) && styles.length>0){   //一层有1个及以上的类
                        styles.forEach((style, i)=>{
                            if(tagParams[7][nowIndex] && tagParams[7][nowIndex][i]){
                                htmlTemp = htmlTemp.replace(/\{\$class\}/, tagParams[7][nowIndex][i])
                            }else{
                                htmlTemp = htmlTemp.replace(/\{\$class\}/g, 'class' + (nowIndex + 1))
                            }
                        })
                    }else{
                        if(tagParams[7][nowIndex]){
                            htmlTemp = htmlTemp.replace(/\{\$class\}/g, tagParams[7][nowIndex])
                        }else{
                            htmlTemp = htmlTemp.replace(/\{\$class\}/g, 'class' + (nowIndex + 1))
                        }
                    }
                    if(k === 0 && k === resCol.length-1){
                        await replaceRecurcol(resCol[k].cid, loopStr, tempList, nowIndex + 1, htmlTemp, true, resCol.length, true);
                    }
                    else if(k === 0){
                        await replaceRecurcol(resCol[k].cid, loopStr, tempList, nowIndex + 1, htmlTemp, true, resCol.length, null);
                    }
                    else if(k === resCol.length-1){
                        await replaceRecurcol(resCol[k].cid, loopStr, tempList, nowIndex + 1, htmlTemp, true, null, true);
                    }
                    else{
                        await replaceRecurcol(resCol[k].cid, loopStr, tempList, nowIndex + 1, htmlTemp, true, null, null);
                    }
                }
            }
        }
        replaceRecurcol(cid, loopStr, tempList, 0, null)
    })
}

/*
模版格式
[!--title--]
[loop]
    <div class="{$class}">
        <div class="{$class}">[!--title--]</div> 
        [loopn]
        <ul>
            [listtemp]list[/listtemp]
        </ul>
        [/loopn]
    </div>
[/loop]
*/
const replaceSqlTag = async (tagStr, regExpAll, tag)=>{
    return new Promise(async resolve=>{
        let sqlTagName, paramArr;
        sqlTagName = /^[a-zA-Z]+?(?=\()/.exec(tagStr);
        if(sqlTagName){
            sqlTagName = sqlTagName[0];
            paramArr = /\((.+?)\)$/.exec(tagStr);
            if(paramArr){
                paramArr = paramArr[1];
                const paramDivi = paramArr.match(/\'.+?\,*.+?\'/g);
                if(paramDivi && paramDivi.length>0){
                    paramDivi.forEach(p=>{
                        paramArr = paramArr.replace(p, p.replace(/\,/g, ':').replace(/\'/g, ''))
                    })
                }
                paramArr = paramArr.split(",");
                paramArr = paramArr.map(p=>{
                    if(/\:+/.exec(p)){
                        return p.replace(/\:/g, ',');
                    }else{
                        return p
                    }
                })
                const sql = 'select * from sqltag where callname="' + sqlTagName + '"';
                const sqlRes = await mysql.nquery(sql);
                if(sqlRes.length === 0){
                    resolve('SQL标签：没有此调用名！' + tag + "<br>");
                }else{
                    const sqlStr = sqlRes[0].sqlcontent;
                    const listStr = sqlRes[0].listcontent;
                    replaceSql(sqlStr, paramArr, tag).then(async sqlStrEnd=>{
                        if(/^select/.test(sqlStrEnd)){
                            await mysql.nquery(sqlStrEnd).then(async sqlResEnd=>{
                                if(sqlResEnd.length>0){
                                    replaceShortTag(listStr, {self: sqlResEnd}, [], null, null, null, null, null, 'linefeed').then(html=>{
                                        resolve(html)
                                    });
                                }else{
                                    resolve('SQL标签：该栏目下没有文章！' + tag + "<br>");
                                }
                            }).catch(err=>{
                                resolve('SQL查询语句错误！' + tag + "<br>");
                            });
                        }else{
                            resolve('SQL标签只支持查询语句！' + tag + "<br>")
                        }
                    });
                }
            }else{
                resolve('sql标签格式不正确' + tag + "<br>")
            }
        }else{
            resolve('sql标签名不正确' + tag + "<br>")
        }
    })
}
const replaceSql = (sqlStr, paramArr, tag)=>{
    const regSql = /\$\{param([0-9])\}/;
    const reqMatch = /\$\{param([0-9])\}/g;
    const resMatch = sqlStr.match(reqMatch);
    return new Promise(resolve=>{
        if(resMatch.length>paramArr.length){
            resolve("SQL标签传入的参数少于SQL语句中用到的参数" + tag + "<br>")
        }else{
            const replaceSqlAg = (sqlStr, paramArr)=>{
                let sqlExec = regSql.exec(sqlStr);
                if(!sqlExec){
                    resolve(sqlStr);
                }else{
                    sqlStr = sqlStr.replace(sqlExec[0], paramArr[parseInt(sqlExec[1])]);
                    replaceSqlAg(sqlStr, paramArr);
                }
            }
            replaceSqlAg(sqlStr, paramArr)
        }
    })
}
const replaceField = async (html, sqlResult, tempNameList = null, webSetting = [], ...args)=>{
    const regexp = / *\[(listtemp)\]list\[\/\1\]/;
    const regexpPage = /\[\!--pagelist--\]/i.exec(html);
    const reExec = regexp.exec(html);
    const num = tempNameList?tempNameList.num: null;
    sqlResult = sqlResult.parent === undefined ? {self: sqlResult, parent: {}}: sqlResult;
    if(reExec){
        const listtempIndent = reExec[0].indexOf('\[');
        const sqlAll = 'select * from article  where fid=' + sqlResult.self[0].cid;
        let resAll = await mysql.nquery(sqlAll)
        resAll = resAll.length;
        let limit;
        if(num > 0){
            if(args[0] >= 2){
                limit = 'limit ' + num*(args[0]-1) + ',' + num;
            }else{
                limit = 'limit ' + tempNameList.num;
            }
        }else{
            limit = ''
        }
        html = await replaceShortTag(html, sqlResult, [num, 0, 0, 1], resAll, args[0], args[1], args[2], webSetting);
        const titleCut = tempNameList.titleCut === 0 ? null : tempNameList.titleCut;
        const introCut = tempNameList.introCut === 0 ? null : tempNameList.introCut;
        const tempList = tempNameList.contentList;
        const params = [0, titleCut, introCut]
        const sql = 'select * from article  where fid=' + sqlResult.self[0].cid + ' order by orderBy, id desc ' + limit;
        const artList = await mysql.nquery(sql);
        if(artList.length === 0){
            html = html.replace(reExec[0], '该栏目下没有文章<br>');
            if(args[2] === 'build' && regexpPage){
                return {htmlC: html, num: num, sum: resAll, pageList: 'true'}
            }else{
                return {htmlC: html}
            }
        }else{
            let listDone = await replaceShortTag(tempList, {self:artList}, params, null, null, null, null, webSetting, 'linefeed');
            listDone = util.increaseIndent(listDone, listtempIndent)
            html = html.replace(reExec[0], listDone);
            html = await  replaceShortTag(html, sqlResult);
            if(args[2] === 'build' && regexpPage){
                return {htmlC: html, num: num, sum: resAll, pageList: 'true'}
            }else{
                return {htmlC: html}
            }
        }
    }else{
        return  await replaceShortTag(html, sqlResult, [], null, null, null, null, webSetting);
    }
}
const replaceShortTag = (temp, reSql, argArr = [], ...args)=>{   //参数temp, {self:[obj], parent:obj}, [num, titleCut, introCut, paging, timeStyle], artLen, page, url, 'build', webSetting=[obj], linefeed
    return new Promise(async resolve=>{
        const regExec = /\[\!--(\w+)--\]/;
        let resEnd = '',newReSql, webset;
        newReSql = util.objKeysToLower(reSql);
        if(!newReSql){resolve('内容对象参数不正确')}
        reSql = {};
        webset = args[4] ? args[4][0] : null;
        //temp = temp.toLowerCase();
        const reShortTag = async (tempStr, reSqlObj, parent)=>{
            return new Promise(resolve=>{
                const rShortTag = (tempStr, reSqlObj, parent)=>{
                    let resReg = regExec.exec(tempStr);
                    if(resReg){
                        const fieldString = resReg[0];
                        const field = resReg[1].toLowerCase();
                        switch (field){
                            case 'title':
                                tempStr = argArr[1] ?
                                        tempStr.replace(fieldString, reSqlObj[field].substring(0, argArr[1])):
                                        tempStr.replace(fieldString, reSqlObj[field]);
                                break;
                            case 'intro':
                                tempStr = argArr[2] ?
                                        tempStr.replace(fieldString, reSqlObj[field].substring(0, argArr[2])):
                                        tempStr.replace(fieldString, reSqlObj[field]);
                                break;
                            case 'colurl':  //栏目数据库的路径前面没有'/',文章的路径有'/'
                                if(reSqlObj['outurl']){
                                    tempStr = tempStr.replace(fieldString, reSqlObj['outurl']);
                                }
                                else if(webset && webset.pagemodel === 1){
                                    tempStr = tempStr.replace(fieldString, util.repalceStr2(webset.pagepath, 'col') + reSqlObj['path1'] + '/' + reSqlObj['path2']);
                                }
                                else if(webset && webset.pagemodel === 2){
                                    tempStr = tempStr.replace(fieldString, util.repalceStr(webset.weburl) + '/showColumn?id=' + reSqlObj['id']);
                                }
                                else{
                                    tempStr = tempStr.replace(fieldString, '/showColumn?id=' + reSqlObj['id']);
                                }
                                break;
                            case 'arturl':  //栏目数据库的路径前面没有'/',文章的路径有'/'
                                if(reSqlObj['outurl']){
                                    tempStr = tempStr.replace(fieldString, reSqlObj['outurl']);
                                }
                                else{
                                    if(webset && webset.pagemodel === 1){
                                        tempStr = tempStr.replace(fieldString, util.repalceStr(webset.weburl) + util.repalceStr2(webset.pagepath, 'art') + reSqlObj['path'] + '/' + reSqlObj['articlename'] + '.html');
                                    }
                                    else if(webset && webset.pagemodel === 2){
                                        tempStr = tempStr.replace(fieldString, util.repalceStr(webset.weburl) + '/showArticle?id=' + reSqlObj['id']);
                                    }
                                    else{
                                        tempStr = tempStr.replace(fieldString, '/showArticle?id=' + reSqlObj['id']);
                                    }
                                }
                                break;
                            case 'uptime':
                                if(argArr[4]){
                                    tempStr = tempStr.replace(fieldString, util.formatToDate(reSqlObj[field], argArr[4]));
                                }else{
                                    tempStr = tempStr.replace(fieldString, reSqlObj[field])
                                }
                                break;
                            case 'pagelist':
                                if(args[3] === 'build' && argArr[0]>0 && argArr[3]>0){
                                    tempStr = tempStr.replace(fieldString, util.makePaging(argArr[0], args[1], args[0], argArr[4], args[2], args[3]));
                                }
                                else if(argArr[0]>0 && argArr[3]>0){
                                    tempStr = tempStr.replace(fieldString, util.makePaging(argArr[0], args[1], args[0], argArr[4], args[2]));
                                }
                                else{
                                    tempStr = tempStr.replace(fieldString, '该分页没有设置显示条数或者分页样式！');
                                }
                                break;
                            case 'webkeyword':
                                if(webset){
                                    tempStr = tempStr.replace(fieldString, webset.keyword);
                                }else{
                                    tempStr = tempStr.replace(fieldString, resReg[1]);
                                }
                                break;
                            case 'webdescription':
                                if(webset){
                                    tempStr = tempStr.replace(fieldString, webset.description);
                                }else{
                                    tempStr = tempStr.replace(fieldString, resReg[1]);
                                }
                                break;
                            case 'artdescription':
                                if(reSqlObj.description){
                                    tempStr = tempStr.replace(fieldString, reSqlObj.description);
                                }else{
                                    tempStr = tempStr.replace(fieldString, reSqlObj.intro.replace(/\<.*?\>/g, ''));
                                }
                                break;
                            case 'webtitle':
                                if(webset){
                                    tempStr = tempStr.replace(fieldString, webset.webname);
                                }else{
                                    tempStr = tempStr.replace(fieldString, resReg[1]);
                                }
                                break;
                            case 'webauthor':
                                if(webset){
                                    tempStr = tempStr.replace(fieldString, webset.author);
                                }else{
                                    tempStr = tempStr.replace(fieldString, resReg[1]);
                                }
                                break;    
                            case 'keywords':
                                if(!reSqlObj.keywords && webset.keyword){
                                    tempStr = tempStr.replace(fieldString, webset.keyword);
                                }
                                else if(reSqlObj.keywords){
                                    tempStr = tempStr.replace(fieldString, reSqlObj.keywords);
                                }
                                else{
                                    tempStr = tempStr.replace(fieldString, field);
                                }
                                break;
                            case 'author':
                                if(reSqlObj[field]){
                                    tempStr = tempStr.replace(fieldString, '作者:' + reSqlObj[field]);
                                }
                                else{
                                    tempStr = tempStr.replace(fieldString, '');
                                }
                                break;
                            case 'source':
                                if(reSqlObj[field]){
                                    if(reSqlObj['usesourceurl'] === 'true'){
                                        tempStr = tempStr.replace(fieldString, '来源：<a href="' + reSqlObj['sourceurl'] + '" target="_blank">' + reSqlObj['source'] + '</a>');
                                    }else{
                                        tempStr = tempStr.replace(fieldString, '来源：' + reSqlObj['source']);
                                    }
                                }else{
                                    tempStr = tempStr.replace(fieldString, '');
                                }
                                break;
                            default:
                                let parentField = /^parent(.+)/.exec(field)
                                if(parentField){
                                    if(parent && (parent[parentField[1]] || parentField[1] === 'url')){
                                        if(parentField[1] === 'url'){
                                            if(webset && webset.pagemodel === 1){
                                                tempStr = tempStr.replace(fieldString, util.repalceStr2(webset.pagepath, 'col') + parent['path1'] + '/' + parent['path2']);
                                            }
                                            else if(webset && webset.pagemodel === 2){
                                                tempStr = tempStr.replace(fieldString, util.repalceStr(webset.weburl) + '/showColumn?id=' + parent['id']);
                                            }
                                            else{
                                                tempStr = tempStr.replace(fieldString, '/showColumn?id=' + parent['id']);
                                            }
                                        }
                                        tempStr = tempStr.replace(fieldString, parent[parentField[1]]);
                                    }else{
                                        tempStr = tempStr.replace(fieldString, parentField[0]);
                                    }
                                }else{
                                    if(!reSqlObj[field] && reSqlObj[field]!=0 && reSqlObj[field]!==''){
                                        tempStr = tempStr.replace(fieldString, field);
                                    }
                                    else{
                                        tempStr = tempStr.replace(fieldString, reSqlObj[field]);
                                    }
                                }  
                        }
                        // else if(argArr[2] && resReg[1] === 'intro'){
                        //     tempStr = tempStr.replace(fieldString, reSqlObj[resReg[1]].substring(0, argArr[2]));
                        // }
                        rShortTag(tempStr, reSqlObj, parent);
                    }else{
                        resolve(tempStr);
                    }
                }
                rShortTag(tempStr, reSqlObj, parent);
            })
        }
        for(let [i, re] of newReSql.self.entries()){
            let reTemp = await reShortTag(temp, re, newReSql.parent);
            if(i !==  newReSql.self.length - 1 && args[5]){
                reTemp = reTemp + '\r\n';
            }
            resEnd += reTemp;
        }
        resolve(resEnd)
    })
}
module.exports = {
    beginReplace, 
    replaceTag, 
    replaceField
}