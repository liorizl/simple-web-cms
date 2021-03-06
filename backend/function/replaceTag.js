const mysql = require('../function/mysql.js');
const util = require('../util/util.js');
const redisClient = require('../function/redis.js');
const config = require("../config/config.json");
//...arg[0]: 'index or art or col' arg[1]: 'id or fid' arg[2]: page页数
//arg[3]:url  arg[4]:build是否生成文件  arg[5]:webSetting
const beginReplace = async (html, ...arg) => {  
    let regMatch, regExpAll, regExpG, promiseArr = [], promiseEnd, sum = null, num = null, pageList = null;
    regExpAll = /\[(litag)\].+\[\/\1\]/;
    regExpG = / *?\[(litag)\].+\[\/\1\]/g;
    regMatch = html.match(regExpG);
    if (regMatch) {
        regMatch.forEach((ele, index) => {
            promiseArr[index] = replaceTag(ele, regExpAll, ...arg)
        });
        promiseEnd = await Promise.all(promiseArr);
        regMatch.forEach((ele, index) => {
            html = html.replace(ele, promiseEnd[index].htmlC || promiseEnd[index])
            if (promiseEnd[index].sum) {
                num = promiseEnd[index].num;
                sum = promiseEnd[index].sum;
            }
            if (promiseEnd[index].pageList) {
                pageList = promiseEnd[index].pageList
            }
        });
    }
    if (arg[4] === 'build') {
        return { htmlC: html, num: num, sum: sum, pageList: pageList }
    }
    else {
        return html
    }
}
const replaceTag = async (tag, regExpAll, ...arg) => {
    const regExp = /^ *?\[(litag)\](.*)\[\/\1\]$/;
    const tagIndent = tag.indexOf('\[');
    const expTagName = /^[a-zA-Z]+?(?=\.)/;
    return new Promise((resolve) => {
        let resExec = regExp.exec(tag);
        if (resExec) {
            let tagNameExec = expTagName.exec(resExec[2]);
            if (tagNameExec) {
                let tagName = tagNameExec[0];
                let tagStr = resExec[2].replace(tagName + '.', "");
                switch (tagName) {
                    case 'temp':
                        replaceHtml(tagStr, regExpAll, tag, ...arg).then(html => {
                            html = util.increaseIndent(html, tagIndent);
                            resolve(html)
                        });
                        break;
                    case 'dynamic':
                        replaceDynamicTag(tagStr, regExpAll, tag, ...arg).then(html => {
                            if (typeof html === 'object') {
                                html.htmlC = util.increaseIndent(html.htmlC, tagIndent);
                            } else {
                                html = util.increaseIndent(html, tagIndent);
                            }
                            resolve(html)
                        });
                        break;
                    case 'sql':
                        replaceSqlTag(tagStr, regExpAll, tag, ...arg).then(html => {
                            html = util.increaseIndent(html, tagIndent);
                            resolve(html)
                        });
                        break;
                    default:
                        resolve('没有这种格式的标签：' + tag + '<br>');
                }
            } else {
                resolve('标签' + tag + '的格式不对<br>')
            }
        } else {
            resolve('标签' + tag + '的格式不对<br>')
        }
    })
}
const replaceHtml = async (tagStr, regExpAll, tag, ...arg) => {
    return new Promise(async (resolve, reject) => {
        let result, resExec;
        const sql = 'select * from tag where callName="' + tagStr + '"';
        result = await mysql.nquery(sql);
        if (result.length === 0) {
            resolve('<div>没有此标签!' + tag + '</div>')
        } else {
            result = result[0].content;
            resExec = regExpAll.exec(result)
            if (resExec) {
                beginReplace(result, ...arg).then(html => {
                    resolve(html)
                }).catch(err => {
                    reject(err)
                })
            } else {
                resolve(result)
            }
        }
    })
}
const replaceDynamicTag = async (tagStr, regExpAll, tag, ...arg) => {
    return new Promise(async (resolve, reject) => {
        let dynaTagName;
        dynaTagName = /^[a-zA-Z]+?[0-9]?(?=\()/.exec(tagStr);
        if (dynaTagName) {
            dynaTagName = dynaTagName[0];
            switch (dynaTagName) {
                case 'artInCol':
                    repalaceArtInCol(tagStr, regExpAll, tag, ...arg).then(html => {
                        resolve(html)
                    }).catch(err => {
                        reject(err)
                    });
                    break;
                case 'artInCols':
                    repalaceArtInCols(tagStr, regExpAll, tag, ...arg).then(html => {
                        resolve(html)
                    }).catch(err => {
                        reject(err)
                    });
                    break;
                // case 'allArtCols':
                //     break;
                case 'position':
                    replacePosition(tagStr, regExpAll, tag, ...arg).then(async colArr => {
                        let tagParam = /\((.*?)\)/.exec(tagStr);
                        if (!tagParam) {
                            resolve("标签参数错误" + tag)
                        } else {
                            tagParam = tagParam[1] === '' ? 0 : parseInt(tagParam[1]);
                            const sql = 'select * from tagtemp where id=' + tagParam;
                            const resultSql = await mysql.nquery(sql);
                            if (resultSql.length === 0) {
                                let str = '<div class="nowPosi">';
                                let last = colArr.pop();
                                str += await replaceShortTag('<a href=[!--colurl--]>[!--title--]</a>>>', { self: colArr }, [], null, null, null, null, arg[5]);
                                str += last;
                                str += '</div>';
                                resolve(str)
                            } else {
                                let temp = resultSql[0].tempcontent;
                                let list = resultSql[0].listcontent;
                                let last = colArr.pop();
                                let tempReg = /\[(listtemp)\]list\[\/\1\]/.exec(temp);
                                if (tempReg) {
                                    let str = await replaceShortTag(list, { self: colArr }, [], null, null, null, null, arg[5]);
                                    str += last;
                                    temp = temp.replace(tempReg[0], str);
                                }
                                resolve(temp)
                            }
                        }
                    }).catch(err => {
                        reject(err)
                    });
                    break;
                default:
                    resolve("没有这种标签" + tag)
            }
        } else {
            resolve("标签格式错误:" + tag + "<br>")
        }
    })
}
const replacePosition = async (tagStr, regExpAll, tag, ...arg) => {
    return new Promise(async (resolve, reject) => {
        const sql = 'select * from columns where cid = ';
        let colArr = [];
        const getCol = async (sql, aid, i) => {
            return new Promise(async (resolve1) => {
                const returnCol = async (sql, aid, i) => {
                    let sqlEnd = sql + aid;
                    let result = await mysql.nquery(sqlEnd);
                    if (result.length === 0) {
                        resolve([])
                    } else {
                        result = result[0]
                        let url = "/" + result.path1 + "/" + result.path2;
                        colArr[i] = { colurl: url, path1: result.path1, path2: result.path2, title: result.title, id: result.id };
                        if (result.aid === 0) {
                            colArr.reverse();
                            resolve1(colArr)
                        } else {
                            returnCol(sql, result.aid, ++i);
                        }
                    }
                }
                returnCol(sql, aid, i)
            })
        }
        if (arg[0] === 'index') {
            resolve('首页不要用当前位置标签')
        }
        else if (arg[0] === 'col') {
            const sqlNowCol = 'select title, aid from columns where id = ' + parseInt(arg[1]);
            const reNowCol = await mysql.nquery(sqlNowCol);
            colArr[0] = reNowCol[0].title;
            if (reNowCol[0].aid === 0) {
                resolve(colArr)
            } else {
                getCol(sql, reNowCol[0].aid, 1).then(col => {
                    resolve(col);
                }).catch(err => {
                    reject(err);
                })
            }
        }
        else if (arg[0] === 'art') {
            colArr[0] = '浏览文章';
            getCol(sql, parseInt(arg[1]), 1).then(col => {
                resolve(col);
            }).catch(err => {
                reject(err)
            })
        }
    })
}
const repalaceArtInCols = async (tagStr, regExpAll, tag, ...arg) => {
    arg.push('artInCols');
    return await repalaceArtInCol(tagStr, regExpAll, tag, ...arg)
}
const repalaceArtInCol = async (tagStr, regExpAll, tag, ...arg) => {
    return new Promise(async resolve => {
        let tagCon, tarConArr, colSqlCondition;
        tagCon = /\((.+?)\)/.exec(tagStr);
        if (tagCon) {
            tagCon = tagCon[1];
            const paramDivi = tagCon.match(/\'.+?\,*.+?\'/g);
            if (paramDivi && paramDivi.length > 0) {
                paramDivi.forEach(p => {
                    tagCon = tagCon.replace(p, p.replace(/\,/g, ':').replace(/\'/g, ''))
                })
            }
            const paramArr = tagCon.split(",");
            tarConArr = paramArr.map(p => {
                if (/\:+/.exec(p)) {
                    return p.replace(/\:/g, ',');
                } else {
                    return p
                }
            })
            if (tarConArr[0] === 'self' && arg[0] === 'index') {
                resolve('标签' + tag + '错误：首页标签第一个参数（栏目名）不能用"self"<br>')
            }
            else {
                const tempId = parseInt(tarConArr[1]);
                const num = tarConArr[2] ? parseInt(tarConArr[2]) : 10  //显示条数
                const titleCut = parseInt(tarConArr[3]) > 0 ? parseInt(tarConArr[3]) : 0;  //标题截取长度,0为不截取
                const introCut = parseInt(tarConArr[4]) > 0 ? parseInt(tarConArr[4]) : 0;  //简介截取长度,0为不截取
                const paging = tarConArr[5] ? parseInt(tarConArr[5]) : 0;
                const timeStyle = tarConArr[6] ? parseInt(tarConArr[6]) : 0;
                let sqlCondition = tarConArr[7] && parseInt(tarConArr[7]) !== 0 ? tarConArr[7] : '';
                if (/\,/.test(sqlCondition)) {
                    sqlCondition = sqlCondition.split(',').join(' and ')
                }
                const orderBy = tarConArr[8] && parseInt(tarConArr[8]) !== 0 ? tarConArr[8] : '';
                let tagParams = [];
                tagParams = [num, titleCut, introCut, paging, timeStyle, orderBy, sqlCondition];
                const sqlTemp = 'select * from tagtemp where id = ' + tempId;
                const reTemp = await mysql.nquery(sqlTemp);
                if (reTemp.length === 0) {
                    resolve('标签' + tag.replace(/^ */, '') + '错误：标签模版找不到<br>')
                }
                else {
                    let sql, idAll, sqlCondi, order;
                    order = orderBy ? ' order by ' + orderBy : '';
                    if (arg[6]) {
                        colSqlCondition = tarConArr[11] && parseInt(tarConArr[11]) !== 0 ? tarConArr[11] : '';
                    } else {
                        colSqlCondition = tarConArr[9] && parseInt(tarConArr[9]) !== 0 ? tarConArr[9] : '';
                    }
                    sqlCondi = colSqlCondition ? ' and ' + colSqlCondition.replace(',', ' and ') : '';
                    if (/\,+/.exec(tarConArr[0])) {
                        idAll = tarConArr[0].split(',');
                        idAll.forEach((id, index, idAll) => {
                            idAll[index] = parseInt(id)
                        })
                        sql = 'select * from columns where id in (' + idAll + ')' + sqlCondi + order;
                    }
                    else if (tarConArr[0] === 'self' && arg[0] === 'col') {
                        sql = 'select * from columns where id = ' + parseInt(arg[1]) + sqlCondi + order;
                    }
                    else if (tarConArr[0] === 'self' && arg[0] === 'art') {
                        sql = 'select * from columns where cid = ' + parseInt(arg[1]) + sqlCondi + order;
                    }
                    else {
                        sql = 'select * from columns where id = ' + parseInt(tarConArr[0]) + sqlCondi + order;
                    }
                    const reSql = tarConArr[0] === '0' ? [0] : await mysql.nquery(sql).catch(err => {
                        console.error(err);
                        resolve(tag + '标签不正确');
                    });
                    if (reSql.length === 0 && tarConArr[0] !== '0') {
                        resolve('没有内容或标签' + tag + '第一个参数（栏目名）或者标签sql条件不正确，导致查询不到栏目！<br>');
                    } else {
                        let cidAll = [];
                        if (reSql.length >= 2) {
                            cidAll = reSql.map(re => {
                                return re.cid
                            })
                        }
                        let temp = reTemp[0].tempcontent;
                        const tempList = reTemp[0].listcontent;
                        if (arg[6]) {     //artInCols标签
                            let styleClass = tarConArr[9] ? tarConArr[9] : 0;
                            if (styleClass !== 0) {
                                const styles = styleClass.match(/(?<=\[).+?(?=\])/g)
                                if (styles && styles.length > 0) {
                                    styleClass = styles.map(style => {
                                        return style.split(',')
                                    })
                                } else {
                                    styleClass = styleClass.split(',')
                                }
                            }
                            tagParams.push(styleClass);
                            const colOrderBy = tarConArr[10] && parseInt(tarConArr[10]) !== 0 ? tarConArr[10] : '';
                            tagParams.push(colOrderBy);
                            if (colSqlCondition) tagParams.push(colSqlCondition);
                            const regExpLoop = / *\[(loop)\](.*)\[\/\1\] */s;
                            let isLoop = regExpLoop.exec(temp);
                            if (!isLoop) {
                                resolve('标签' + tag + '标签模版不正确<br>');
                            } else {
                                const loopStr = isLoop[2];
                                const webset = arg[5];
                                if (reSql.length >= 2) {
                                    let tempArr = [], promiseAll = [];
                                    for (let i = 0; i < reSql.length; i++) {
                                        tempArr[i] = await replaceShortTag(temp, { self: [reSql[i]] }, [], null, null, null, null, webset);
                                        promiseAll[i] = recurCol(reSql[i].cid, loopStr, tempList, tagParams, webset);
                                    }
                                    let html = ''
                                    Promise.all(promiseAll).then(htmlArr => {
                                        htmlArr.forEach((h, i) => {
                                            html += tempArr[i].replace(regExpLoop.exec(temp)[0], h);
                                        })
                                        resolve(html)
                                    }).catch(err => {
                                        console.error(err);
                                        resolve(tag + '标签错误！');
                                    })
                                }
                                else if (reSql[0] === 0) {
                                    temp = await replaceShortTag(temp, {self: webset}, [], null, null, null, null, arg[5]);
                                    recurCol(0, loopStr, tempList, tagParams, webset).then(html => {
                                        temp = temp.replace(regExpLoop.exec(temp)[0], html)
                                        resolve(temp)
                                    }).catch(err => {
                                        console.error(err);
                                        resolve(tag + '标签错误！');
                                    })
                                }
                                else {
                                    temp = await replaceShortTag(temp, { self: [reSql[0]] }, [], null, null, null, null, arg[5]);
                                    recurCol(reSql[0].cid, loopStr, tempList, tagParams, webset).then(html => {
                                        temp = temp.replace(regExpLoop.exec(temp)[0], html)
                                        resolve(temp)
                                    }).catch(err => {
                                        console.error(err);
                                        resolve(tag + '标签错误！');
                                    })
                                }
                            }
                        } else {   //artInCol标签
                            const cids = cidAll.length > 1 ? cidAll : reSql[0].cid;
                            let colCid
                            //检查栏目下是否有子栏目  tarConArr[7]是sql查询条件
                            await util.ultracolsInCols(cids).then(reCids => {
                                if (Array.isArray(reCids)) {
                                    cidAll = reCids
                                } else {
                                    colCid = reCids
                                }
                            })
                            let sql2, sqlWhere = '', sqlOrder = '', sqlLimit = '', artLen = null;
                            const havePageTag = /\[\!--pagelist--\]/i.exec(temp);
                            if (tarConArr[0] === '0') {
                                sqlWhere = ''
                            } else {
                                sqlWhere = cidAll.length > 1 ? ' where fid in (' + cidAll + ')' : ' where fid=' + colCid;
                            }
                            sqlWhere = sqlCondition ? sqlWhere + ' and ' + sqlCondition : sqlWhere;
                            if (/\[\!--pagelist--\]/.test(temp)) {   //模版里有分页标签才考虑分页
                                if (num > 0 && arg[2] >= 2) {
                                    sqlLimit = ' limit ' + (num * (arg[2] - 1)) + ',' + num;
                                }
                                else {
                                    sqlLimit = num > 0 ? ' limit ' + num : '';
                                }
                            }
                            if (orderBy) {
                                sqlOrder = ' order by ' + tarConArr[8]
                            }
                            if (paging > 0 && num > 0) {
                                const sqlAll = 'select id from article' + sqlWhere;
                                let artAll = await mysql.nquery(sqlAll);
                                artLen = artAll.length;
                            }
                            sql2 = 'select * from article' + sqlWhere + sqlOrder + sqlLimit;
                            let artList = await mysql.nquery(sql2).catch(err => {
                                console.error(err);
                                resolve(tag + '标签不正确');
                            });
                            if (artList.length === 0) {
                                resolve("该栏目下没有文章" + tag + '<br>')
                            } else {
                                const colids = tarConArr[0] === 'self' ? reSql[0].id : tarConArr[0];
                                temp = tarConArr[0] === '0' ? temp : await replaceShortTag(temp, { self: [reSql[0]] }, [num, 0, 0, paging], artLen, arg[2], arg[3], arg[4], arg[5], null, null, colids);
                                const tempList = reTemp[0].listcontent;
                                const reg1 = / *?\[(listtemp)\]list\[\/\1\]/;
                                const res1 = reg1.exec(temp);
                                const tempIndent = res1[0].indexOf('\[');
                                let listtempContent = '';
                                if (res1) {
                                    listtempContent = await replaceShortTag(tempList, { self: artList, parent: reSql[0] }, tagParams, null, null, null, null, arg[5], 'linefeed');
                                    listtempContent = util.increaseIndent(listtempContent, tempIndent);
                                    temp = temp.replace(res1[0], listtempContent);
                                }
                                if (regExpAll.exec(temp)) {
                                    beginReplace(temp).then(html => {
                                        if (arg[4] === 'build' && num > 0 && paging >= 1 && havePageTag) {
                                            resolve({ htmlC: html, num: num, sum: artLen, pageList: 'true' })
                                        } else {
                                            resolve({ htmlC: html })
                                        }
                                    })
                                } else {
                                    if (arg[4] === 'build' && num > 0 && paging >= 1 && havePageTag) {
                                        resolve({ htmlC: temp, num: num, sum: artLen, pageList: 'true' })
                                    } else {
                                        resolve({ htmlC: temp })
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            resolve("标签没有参数:" + tag + "<br>")
        }
    })
}
const recurCol = async (cid, loopStr, tempList, tagParams, webset) => {
    let htmlTempAll = '', x = 0, y = 0, tempIndent, tempListIndent, tempIndentLoopn;
    const sqlCondition = tagParams[6] ? ' and ' + tagParams[6].toLowerCase() : '';
    const order = tagParams[5] ? ' order by ' + tagParams[5] : '';
    const colOrder = tagParams[8] ? tagParams[8].toLowerCase() : null;
    const colSqlCondition = tagParams[9] ? ',' + tagParams[9].toLowerCase() : '';
    const allCols = await new Promise((resolve, reject) => {
        redisClient.get(config.redis.colName, (err, v) => {
            if (err) reject(err)
            else {
                resolve(JSON.parse(v))
            }
        })
    })
    loopStr = loopStr.replace(/^\r\n/, '').replace(/\r\n *$/, '')   //去除开始和结束的换行符
    return new Promise(async (resolve) => {
        const replaceRecurcol = async (cid, loopStr, tempList, nowIndex, temp = null, i = null, j = null, loopEnd = null) => {
            if (i) x++;
            if (j) y += j;
            const regLoop = new RegExp('\\ *\\[(loop' + (nowIndex - 1) + ')\\](.*)\\[\/\\1\\]', 's');
            const exeLoop = regLoop.exec(htmlTempAll);
            if (!exeLoop && nowIndex > 1) {
                resolve(htmlTempAll);
                return
            }
            const haveLoopn = /\[(loopn)\].*?\[\/\1\]/s.test(loopStr);
            const expList = /\[(listtemp)\]list\[\/\1\]/;
            const expList1 = / *\[(listtemp)\]list\[\/\1\]/;
            // const sql = 'select * from columns where aid=' + cid + ' and isUse="true"' + sqlCondition + order;
            // const resCol = await mysql.nquery(sql);
            // 我也不知道当初为什么会写出这么错误的一句
            // const condi = cid === 0 ? colSqlCondition.slice(1) : 'aid=' + cid + colSqlCondition;
            const condi = 'aid=' + cid + colSqlCondition;
            const resCol = util.filterCol(condi, allCols, colOrder);
            if (resCol.length === 0) {
                let htmlCon;
                if (tagParams[0] === -1) {
                    htmlCon = '';
                } else {
                    let sqlArt;
                    if (tagParams[0] > -1 && tagParams[0] !== 0) {
                        sqlArt = 'select * from article where fid=' + cid + sqlCondition + order + ' limit ' + tagParams[0];
                    } else {
                        sqlArt = 'select * from article where fid=' + cid + sqlCondition + order;
                    }
                    const resArt = await mysql.nquery(sqlArt).catch(err => {
                        console.error(err);
                        resolve('标签sql不正确');
                    });
                    htmlCon = resArt.length === 0 ?
                        '<li>该栏目没有文章!</li>' :
                        await replaceShortTag(tempList, { self: resArt }, tagParams, null, null, null, null, webset, 'linefeed');
                }
                if (nowIndex === 0) {
                    let noColTemp = /\[(loopn)\](.*)\[\/\1\]/s.exec(loopStr);
                    let haveListTemp = expList.exec(loopStr)
                    const listtempIndent = haveListTemp ? expList1.exec(loopStr)[0].indexOf('\[') : 0;
                    htmlCon = util.increaseIndentLi(htmlCon, listtempIndent) ? util.increaseIndentLi(htmlCon, listtempIndent) : htmlCon;
                    if (noColTemp) {
                        noColTemp = noColTemp[2]
                        htmlTempAll = noColTemp.replace(expList, htmlCon);
                    } else if (haveListTemp) {   //有listtemp标签就将它替换为文章
                        htmlTempAll = loopStr.replace(expList, htmlCon);
                    }
                    resolve(htmlTempAll)
                }
                else if (nowIndex === 1) {
                    temp = temp.replace(/\[loopn\](\r\n)* */, '').replace(/(\r\n)* *\[\/loopn\] */, '');
                    if (!loopEnd) temp = temp + '\r\n';
                    if (expList1.exec(temp)) {
                        tempListIndent = expList1.exec(temp)[0].indexOf('\[');
                        //增加空格为源代码对齐
                        htmlCon = util.increaseIndentLi(htmlCon, tempListIndent) ? util.increaseIndentLi(htmlCon, tempListIndent) : htmlCon;
                    }
                    temp = temp.replace(expList, htmlCon);
                    if (loopEnd) {
                        htmlTempAll = htmlTempAll.replace(/\[loop0\]\[\/loop0\]/, temp);
                    } else {
                        htmlTempAll = htmlTempAll.replace('[loop0][/loop0]', temp) + '[loop0][/loop0]';
                    }
                }
                else {
                    tempIndent = temp.indexOf('\<');
                    temp = temp.replace(/\[loopn\](\r\n) */, '').replace(/(\r\n)* *\[\/loopn\] */, '');
                    tempIndentLoopn = regLoop.exec(htmlTempAll) ? regLoop.exec(htmlTempAll)[0].indexOf('\[') : 0;
                    temp = tempIndentLoopn !== 0 ? util.changeIndent(temp, tempIndent, tempIndentLoopn) : temp;
                    tempListIndent = expList1.exec(temp)[0].indexOf('\[')
                    htmlCon = util.increaseIndentLi(htmlCon, tempListIndent) ? util.increaseIndentLi(htmlCon, tempListIndent) : htmlCon;
                    if (loopEnd) {
                        temp = temp.replace(/\r\n$/, '')
                        temp = temp.replace(expList, htmlCon)
                    } else {
                        temp = temp.replace(expList, htmlCon) + '\r\n' + new Array(tempIndentLoopn + 1).join(' ') + '[loop' + (nowIndex - 1) + '][/loop' + (nowIndex - 1) + ']';
                    }
                    if (exeLoop) htmlTempAll = htmlTempAll.replace(exeLoop[0], temp);
                }
                if (x === y) {
                    if (tagParams[0] === -1) {
                        htmlTempAll = htmlTempAll.replace(/\ *\<(ul).*?\>.+?\<\/\1\>(\r\n)*/sg, '');
                    }
                    resolve(htmlTempAll)
                }
            } else {
                let htmlTemp = '';
                if (!temp) {
                    if (haveLoopn) {
                        htmlTempAll = '[loop0][/loop0]'
                    } else {
                        if (expList.test(loopStr)) {  
                            const resCols = util.filterCol('aid=' + cid + ',isuse="true"' + colSqlCondition, allCols, colOrder);
                            let htmlColStr = await replaceShortTag(tempList, { self: resCols }, tagParams, null, null, null, null, webset, 'linefeed', 'tagInTagtemp');
                            htmlTempAll = loopStr.replace(expList, htmlColStr);
                        } else {
                            htmlTempAll = htmlTempAll || loopStr;
                            htmlTempAll = await replaceShortTag(htmlTempAll, { self: resCol }, tagParams, null, null, null, null, webset, 'linefeed', 'tagInTagtemp');
                        }
                        resolve(htmlTempAll)
                    }
                } else {
                    tempIndentLoopn = regLoop.exec(htmlTempAll) ? regLoop.exec(htmlTempAll)[0].indexOf('\[') : 0;
                    tempIndent = temp.indexOf('\<');
                    temp = tempIndentLoopn !== 0 ? util.changeIndent(temp, tempIndent, tempIndentLoopn) : temp;
                    temp = temp.replace(/\r\n$/, '')
                    temp = temp.replace('[loopn]', '[loop' + nowIndex + ']').replace('[/loopn]', '[/loop' + nowIndex + ']');
                    if (!loopEnd) {
                        temp = temp + '\r\n' + new Array(tempIndentLoopn + 1).join(' ') + '[loop' + (nowIndex - 1) + '][/loop' + (nowIndex - 1) + ']';
                    }
                    if (exeLoop) htmlTempAll = htmlTempAll.replace(exeLoop[0], temp);
                }
                for (let [k, col] of resCol.entries()) {
                    htmlTemp = await replaceShortTag(loopStr, { self: [resCol[k]] }, [], null, null, null, null, webset);
                    let styles = htmlTemp.match(/\{\$class\}/g);
                    if (Array.isArray(styles) && styles.length > 0) {   //一层有1个及以上的类
                        styles.forEach((style, i) => {
                            if (tagParams[7][nowIndex] && tagParams[7][nowIndex][i]) {
                                htmlTemp = htmlTemp.replace(/\{\$class\}/, tagParams[7][nowIndex][i])
                            } else {
                                htmlTemp = htmlTemp.replace(/\{\$class\}/g, 'class' + (nowIndex + 1))
                            }
                        })
                    } else {
                        if (tagParams[7][nowIndex]) {
                            htmlTemp = htmlTemp.replace(/\{\$class\}/g, tagParams[7][nowIndex])
                        } else {
                            htmlTemp = htmlTemp.replace(/\{\$class\}/g, 'class' + (nowIndex + 1))
                        }
                    }
                    if (k === 0 && k === resCol.length - 1) {
                        await replaceRecurcol(resCol[k].cid, loopStr, tempList, nowIndex + 1, htmlTemp, true, resCol.length, true);
                    }
                    else if (k === 0) {
                        await replaceRecurcol(resCol[k].cid, loopStr, tempList, nowIndex + 1, htmlTemp, true, resCol.length, null);
                    }
                    else if (k === resCol.length - 1) {
                        await replaceRecurcol(resCol[k].cid, loopStr, tempList, nowIndex + 1, htmlTemp, true, null, true);
                    }
                    else {
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
const replaceSqlTag = async (tagStr, regExpAll, tag) => {
    return new Promise(async resolve => {
        let sqlTagName, paramArr;
        sqlTagName = /^[a-zA-Z]+?(?=\()/.exec(tagStr);
        if (sqlTagName) {
            sqlTagName = sqlTagName[0];
            paramArr = /\((.+?)\)$/.exec(tagStr);
            if (paramArr) {
                paramArr = paramArr[1];
                const paramDivi = paramArr.match(/\'.+?\,*.+?\'/g);
                if (paramDivi && paramDivi.length > 0) {
                    paramDivi.forEach(p => {
                        paramArr = paramArr.replace(p, p.replace(/\,/g, ':').replace(/\'/g, ''))
                    })
                }
                paramArr = paramArr.split(",");
                paramArr = paramArr.map(p => {
                    if (/\:+/.exec(p)) {
                        return p.replace(/\:/g, ',');
                    } else {
                        return p
                    }
                })
                const sql = 'select * from sqltag where callname="' + sqlTagName + '"';
                const sqlRes = await mysql.nquery(sql);
                if (sqlRes.length === 0) {
                    resolve('SQL标签：没有此调用名！' + tag + "<br>");
                } else {
                    const sqlStr = sqlRes[0].sqlcontent;
                    const listStr = sqlRes[0].listcontent;
                    const webset = await mysql.nquery('select * from websetting');
                    replaceSql(sqlStr, paramArr, tag).then(async sqlStrEnd => {
                        if (/^select/.test(sqlStrEnd)) {
                            await mysql.nquery(sqlStrEnd).then(async sqlResEnd => {
                                if (sqlResEnd.length > 0) {
                                    replaceShortTag(listStr, { self: sqlResEnd }, [], null, null, null, null, webset, 'linefeed').then(html => {
                                        resolve(html)
                                    });
                                } else {
                                    resolve('SQL标签：该栏目下没有文章！' + tag + "<br>");
                                }
                            }).catch(err => {
                                console.error(err)
                                resolve('SQL查询语句错误！' + tag + "<br>");
                            });
                        } else {
                            resolve('SQL标签只支持查询语句！' + tag + "<br>")
                        }
                    });
                }
            } else {
                resolve('sql标签格式不正确' + tag + "<br>")
            }
        } else {
            resolve('sql标签名不正确' + tag + "<br>")
        }
    })
}
const replaceSql = (sqlStr, paramArr, tag) => {
    const regSql = /\$\{param([0-9])\}/;
    const reqMatch = /\$\{param([0-9])\}/g;
    const resMatch = sqlStr.match(reqMatch);
    return new Promise(resolve => {
        if (resMatch.length > paramArr.length) {
            resolve("SQL标签传入的参数少于SQL语句中用到的参数" + tag + "<br>")
        } else {
            const replaceSqlAg = (sqlStr, paramArr) => {
                let sqlExec = regSql.exec(sqlStr);
                if (!sqlExec) {
                    resolve(sqlStr);
                } else {
                    sqlStr = sqlStr.replace(sqlExec[0], paramArr[parseInt(sqlExec[1])]);
                    replaceSqlAg(sqlStr, paramArr);
                }
            }
            replaceSqlAg(sqlStr, paramArr)
        }
    })
}
//tempMes 模版信息   args 0:page 1: url 2:build?
const replaceField = async (html, sqlResult, tempMes = null, webSetting = [], ...args) => {
    const regexp = / *\[(listtemp)\]list\[\/\1\]/;
    const regexpPage = /\[\!--pagelist--\]/i.exec(html);
    const reExec = regexp.exec(html);
    sqlResult = sqlResult.parent === undefined ? { self: sqlResult, parent: {} } : sqlResult;
    if (reExec && tempMes && tempMes.contentList) {
        const cids = await util.ultracolsInCols(sqlResult.self[0].cid, 'isuse="true"');
        const sqlCondi = tempMes.sqlCondi !== '0' ? ' and ' + tempMes.sqlCondi.replace(/\,/g, ' and ') : '';
        const sqlOrder = tempMes.sqlOrder !== '0' ? ' ' + tempMes.sqlOrder : ' id desc';
        const pagination = tempMes.pagination;
        const num = tempMes.num || 0;
        const titleCut = tempMes.titleCut || null;
        const introCut = tempMes.introCut || null;
        const dateType = tempMes.dateType || null;
        const tempList = tempMes.contentList;
        const listtempIndent = reExec[0].indexOf('\[');
        let limit;
        if (num > 0) {
            if (args[0] >= 2) {
                limit = ' limit ' + num * (args[0] - 1) + ',' + num;
            } else {
                limit = ' limit ' + tempMes.num;
            }
        } else {
            limit = '';
        }
        const sqlAll = Array.isArray(cids) ? 
                    'select * from article where fid in (' + cids + ') ' + sqlCondi + ' order by' + sqlOrder :
                    'select * from article where fid = ' + cids + sqlCondi + ' order by' + sqlOrder;
        const sqlArts = sqlAll + limit;
        let artLen = null;
        if (regexpPage) { //有分页标签
            if (num < 1) {
                return {
                    htmlC: '模版选项格式不正确，使用分页标签，但每页显示的数量不正确！'
                }
            }
            if (pagination !== 1 && pagination !== 2 && pagination !== 3) {
                return {
                    htmlC: '分页样式不正确！'
                }
            }
            let resAll = await mysql.nquery(sqlAll).catch(err => {
                return {
                    htmlC: '模版选项格式不正确，导致sql语句无法正确运行！'
                }
            });
            artLen = resAll.length;
        }
        let artList = await mysql.nquery(sqlArts).catch(err => {
            return {
                error: '模版选项格式不正确，导致sql语句无法正确运行！'
            }
        });
        if (artList.error) {
            return {
                htmlC: artList.error
            }
        }
        let contentList
        if (artList.length === 0) {
            contentList = '该栏目下和子栏目（子栏目存在的话）没有文章！'
        } else {
            contentList = await replaceShortTag(tempList, { self: artList }, [num, titleCut, introCut, pagination, dateType], null, args[0], args[1], args[2], webSetting, 'linefeed');
        }
        contentList = util.increaseIndent(contentList, listtempIndent);
        html = html.replace(regexp, contentList);
        html = await replaceShortTag(html, sqlResult, [num, null, null, pagination, null], artLen, args[0], args[1], args[2], webSetting, null, null, sqlResult.self[0].id);
        if (args[2] === 'build' && regexpPage) {
            return { htmlC: html, num: num, sum: artLen, pageList: 'true' }
        } else {
            return { htmlC: html }
        }
    }
    else if(reExec && tempMes === null) {
        return {
            htmlC: '首页和内容页模版不要使用[listtemp]list[/listtemp]'
        }
    } else {
        return await replaceShortTag(html, sqlResult, [], null, null, null, null, webSetting);
    }
}
//参数temp, {self:[obj], parent:obj}, [num, titleCut, introCut, paging, timeStyle], artLen, page, url, 'build', webSetting=[obj], linefeed, tagInTagtemp, colids
const replaceShortTag = (temp, reSql, argArr = [], ...args) => {   
    return new Promise(async resolve => {
        const regExec = /\[\!--(\w+)--\]/;
        let resEnd = '', newReSql, webset;
        if (reSql) {
            newReSql = util.objKeysToLower(reSql);
            if (!newReSql) { resolve('内容对象参数不正确') }
        }
        reSql = {};
        webset = args[4] ? 
                    Array.isArray(args[4]) ? args[4][0] : args[4] : 
                    null;
        //temp = temp.toLowerCase();
        const reShortTag = async (tempStr, reSqlObj, parent) => {
            return new Promise(resolve => {
                const rShortTag = (tempStr, reSqlObj, parent) => {
                    let resReg = regExec.exec(tempStr);
                    if (resReg) {
                        const fieldString = resReg[0];
                        const field = resReg[1].toLowerCase();
                        switch (field) {
                            case 'title':
                                tempStr = argArr[1] ?
                                    tempStr.replace(fieldString, reSqlObj[field].substring(0, argArr[1])) :
                                    tempStr.replace(fieldString, reSqlObj[field]);
                                break;
                            case 'intro':
                                tempStr = argArr[2] ?
                                    tempStr.replace(fieldString, reSqlObj[field].substring(0, argArr[2])) :
                                    tempStr.replace(fieldString, reSqlObj[field]);
                                break;
                            case 'colurl':  //栏目数据库的路径前面没有'/',文章的路径有'/'
                                if (reSqlObj['outurl']) {
                                    tempStr = tempStr.replace(fieldString, reSqlObj['outurl']);
                                }
                                else if (webset && webset.pagemodel === 1) {
                                    tempStr = tempStr.replace(fieldString, util.repalceStr2(webset.pagepath, 'col') + reSqlObj['path1'] + '/' + reSqlObj['path2']);
                                }
                                else if (webset && webset.pagemodel === 2) {
                                    tempStr = tempStr.replace(fieldString, util.repalceStr(webset.weburl) + '/showColumn?id=' + reSqlObj['id']);
                                }
                                else {
                                    tempStr = tempStr.replace(fieldString, '/showColumn?id=' + reSqlObj['id']);
                                }
                                break;
                            case 'arturl':  //栏目数据库的路径前面没有'/',文章的路径有'/'
                                if (reSqlObj['outurl']) {
                                    tempStr = tempStr.replace(fieldString, reSqlObj['outurl']);
                                }
                                else {
                                    if (webset && webset.pagemodel === 1) {
                                        tempStr = tempStr.replace(fieldString, util.repalceStr(webset.weburl) + util.repalceStr2(webset.pagepath, 'art') + reSqlObj['path'] + '/' + reSqlObj['articlename'] + '.html');
                                    }
                                    else if (webset && webset.pagemodel === 2) {
                                        tempStr = tempStr.replace(fieldString, util.repalceStr(webset.weburl) + '/showArticle?id=' + reSqlObj['id']);
                                    }
                                    else {
                                        tempStr = tempStr.replace(fieldString, '/showArticle?id=' + reSqlObj['id']);
                                    }
                                }
                                break;
                            case 'uptime':
                                if (argArr[4]) {
                                    tempStr = tempStr.replace(fieldString, util.formatToDate(reSqlObj[field], argArr[4]));
                                } else {
                                    tempStr = tempStr.replace(fieldString, reSqlObj[field])
                                }
                                break;
                            case 'pagelist':
                                if (args[3] === 'build' && argArr[0] > 0 && argArr[3] > 0) {
                                    tempStr = tempStr.replace(fieldString, util.makePaging(argArr[0], args[1], args[0], argArr[3], args[2], args[3], args[7]));
                                }
                                else if (argArr[0] > 0 && argArr[3] > 0) {
                                    tempStr = tempStr.replace(fieldString, util.makePaging(argArr[0], args[1], args[0], argArr[3], args[2], null, args[7]));
                                }
                                else {
                                    tempStr = tempStr.replace(fieldString, '该分页没有设置显示条数或者分页样式！');
                                }
                                break;
                            case 'webkeyword':
                                if (webset) {
                                    tempStr = tempStr.replace(fieldString, webset.keyword);
                                } else {
                                    tempStr = tempStr.replace(fieldString, resReg[1]);
                                }
                                break;
                            case 'webdescription':
                                if (webset) {
                                    tempStr = tempStr.replace(fieldString, webset.description);
                                } else {
                                    tempStr = tempStr.replace(fieldString, resReg[1]);
                                }
                                break;
                            case 'artdescription':
                                if (reSqlObj.description) {
                                    tempStr = tempStr.replace(fieldString, reSqlObj.description);
                                } else {
                                    tempStr = tempStr.replace(fieldString, reSqlObj.intro.replace(/\<.*?\>|\r\n/g, ''));
                                }
                                break;
                            case 'webtitle':
                                if (webset) {
                                    tempStr = tempStr.replace(fieldString, webset.webname);
                                } else {
                                    tempStr = tempStr.replace(fieldString, resReg[1]);
                                }
                                break;
                            case 'webauthor':
                                if (webset) {
                                    tempStr = tempStr.replace(fieldString, webset.author);
                                } else {
                                    tempStr = tempStr.replace(fieldString, resReg[1]);
                                }
                                break;
                            case 'keyword':
                                if (reSqlObj.keyword) {
                                    tempStr = tempStr.replace(fieldString, reSqlObj.keyword);
                                } else if (webset.keyword) {
                                    tempStr = tempStr.replace(fieldString, webset.keyword);
                                }
                                else {
                                    tempStr = tempStr.replace(fieldString, field);
                                }
                                break;
                            case 'description':
                                if (reSqlObj.description) {
                                    tempStr = tempStr.replace(fieldString, reSqlObj.description);
                                } else if (webset.description) {
                                    tempStr = tempStr.replace(fieldString, webset.description);
                                }
                                else {
                                    tempStr = tempStr.replace(fieldString, field);
                                }
                                break;
                            case 'author':
                                if (reSqlObj[field]) {
                                    tempStr = tempStr.replace(fieldString, '作者:' + reSqlObj[field]);
                                }
                                else {
                                    tempStr = tempStr.replace(fieldString, '');
                                }
                                break;
                            case 'picurl':
                                if (!reSqlObj['picurl']) {
                                    tempStr = tempStr.replace(fieldString, '/images/nopic.jpg');
                                } else {
                                    tempStr = tempStr.replace(fieldString, reSqlObj['picurl']);
                                }
                                break;
                            case 'source':
                                if (reSqlObj[field]) {
                                    if (reSqlObj['usesourceurl'] === 'true') {
                                        tempStr = tempStr.replace(fieldString, '来源：<a href="' + reSqlObj['sourceurl'] + '" target="_blank">' + reSqlObj['source'] + '</a>');
                                    } else {
                                        tempStr = tempStr.replace(fieldString, '来源：' + reSqlObj['source']);
                                    }
                                } else {
                                    tempStr = tempStr.replace(fieldString, '');
                                }
                                break;
                            case 'indexpage':
                                if (webset.indexmodel === 1) {
                                    tempStr = tempStr.replace(fieldString, webset.indexpath);
                                } else {
                                    tempStr = tempStr.replace(fieldString, '/showIndex');
                                }
                                break;
                            default:
                                let parentField = /^parent(.+)/.exec(field)
                                if (parentField) {
                                    if (parent && (parent[parentField[1]] || parentField[1] === 'url')) {
                                        if (parentField[1] === 'url') {
                                            if (webset && webset.pagemodel === 1) {
                                                tempStr = tempStr.replace(fieldString, util.repalceStr2(webset.pagepath, 'col') + parent['path1'] + '/' + parent['path2']);
                                            }
                                            else if (webset && webset.pagemodel === 2) {
                                                tempStr = tempStr.replace(fieldString, util.repalceStr(webset.weburl) + '/showColumn?id=' + parent['id']);
                                            }
                                            else {
                                                tempStr = tempStr.replace(fieldString, '/showColumn?id=' + parent['id']);
                                            }
                                        }
                                        tempStr = tempStr.replace(fieldString, parent[parentField[1]]);
                                    } else {
                                        tempStr = tempStr.replace(fieldString, parentField[0]);
                                    }
                                } else {
                                    if (!reSqlObj[field] && reSqlObj[field] != 0 && reSqlObj[field] !== '') {
                                        tempStr = tempStr.replace(fieldString, field);
                                    }
                                    else {
                                        tempStr = tempStr.replace(fieldString, reSqlObj[field]);
                                    }
                                }
                        }
                        // else if(argArr[2] && resReg[1] === 'intro'){
                        //     tempStr = tempStr.replace(fieldString, reSqlObj[resReg[1]].substring(0, argArr[2]));
                        // }
                        rShortTag(tempStr, reSqlObj, parent);
                    } else {
                        resolve(tempStr);
                    }
                }
                rShortTag(tempStr, reSqlObj, parent);
            })
        }
        for (let [i, re] of newReSql.self.entries()) {
            let reTemp = await reShortTag(temp, re, newReSql.parent);
            const regTag = /\[(litag)\].+\[\/\1\]/;
            if (args[6] === 'tagInTagtemp' && regTag.test(reTemp)) {  //当标签模版中还有标签时继续解析
                reTemp = await beginReplace(reTemp, 'col', re.id, null, null, null, webset);
            }
            if (i !== newReSql.self.length - 1 && args[5] === 'linefeed') {
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