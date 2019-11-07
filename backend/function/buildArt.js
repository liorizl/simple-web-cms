const art = require('../show/showArticle.js');
const util = require('../util/util.js');
//const cheerio = require('cheerio');
const mysql = require('../function/mysql.js');
const fs = require('fs');
const config = require("../config/config.json");
const template = require('./buildTemplate.js');
const buildArt = async (ctx, next = null, artId = null) => {
    const staticPath = config.staticWebPath + config.staticWebName;
    await util.statPath(staticPath, 'isDir', true);
    let addPath = '';
    const sql = 'select * from websetting';
    const webSetting = await mysql.nquery(sql);
    addPath = staticPath + webSetting[0].pagePath;
    let isExist = await util.statPath(addPath, 'isDir', true);
    //console.log(isExist)
    let cid = ctx.query.cid || null, id = ctx.query.id || null, sqlId;
    if (cid) {
        sqlId = 'select id,path,articleName,fid from article where fid in (' + cid + ')';
    }
    else if (artId) {
        sqlId = 'select id,path,articleName,fid from article where id = ' + artId;
    }
    else if (id) {
        const sqlCid = 'select cid from columns where id in (' + id + ')';
        const resultCidArr = await mysql.nquery(sqlCid);
        let cidArr = resultCidArr.map(obj => obj.cid)
        sqlId = 'select id,path,articleName,fid from article where fid in (' + cidArr.join(',') + ')';
    }
    else {
        sqlId = 'select id,path,articleName,fid from article';
    }
    let arrArt = await mysql.nquery(sqlId);
    if (arrArt.length === 0) {
        ctx.body = '<h1 style="text-align:center;">所选栏目下没有文章！</h1>'
        return false
    }
    const bTime = new Date().getTime();
    if (artId) {  //有artId代表修改(添加)文章时同时生成的文章
        return new Promise(async resolve => {
            await checkPath(null, arrArt[0].id, arrArt[0].path, arrArt[0].articleName, addPath, arrArt[0].fid).then(value => {
                resolve(value)
            })
        })
    } else {
        ctx.res.setHeader('Content-Type', 'text/html; charset=utf-8');
        ctx.res.write(template('文章'));
        let rightNum = 0, wrongNum = 0;
        const sum = arrArt.length;
        ctx.res.write('<script>getSum(' + sum + ')</script>');
        for (let [index, obj] of arrArt.entries()) {
            await checkPath(ctx.res, obj.id, obj.path, obj.articleName, addPath, obj.fid, index, sum).then(value => {
                if (value.success === 1) {
                    rightNum += 1;
                } else {
                    wrongNum += 1
                }
            }).catch(err => {
                console.log(err)
                let errMes = '生成id为' + obj.id + '的文章时，程序内部出现为题，请检查！'
                ctx.res.write('<script>change(' + util.getPercent(index, sum) + ', ' + index + ',\'' + errMes + '\',\'' + errMes + '\')</script>');
            })
        }
        const eTime = new Date().getTime();
        const endMes = '生成完毕,共' + arrArt.length + '篇,其中成功' + rightNum + '篇,失败<span style=\'color:red\'>' + wrongNum + '</span>篇;共耗时:' + (eTime - bTime) / 1000 + '秒';
        ctx.body = '<script>buildEnd(\"' + endMes + '\")</script>'
    }
}
const checkPath = async (ctx = null, id, path, articleName, addPath, fid, index, sum) => {
    return new Promise(async resolve1 => {
        let errMes;
        if (path === '') {
            errMes = '<span style="color:red">ID为:' + id + '的文章生成失败 原因:文章路径为空！</span>'
            if (ctx) ctx.write('<script>change(' + util.getPercent(index, sum) + ',' + index + ',\'' + errMes + '\',\'' + errMes + '\')</script>\n');
            resolve1({ success: -1 });
        }
        else if (!articleName) {
            errMes = '<span style="color:red">ID为:' + id + '的文章生成失败 原因:文章名称为空！</span>'
            if (ctx) ctx.write('<script>change(' + util.getPercent(index, sum) + ',' + index + ',\'' + errMes + '\',\'' + errMes + '\')</script>\n');
            resolve1({ success: -1 });
        }
        else {
            const fullPath = addPath + path;
            await util.statPath(fullPath, 'isDir', true).then(async myStatus => {
                if (myStatus !== 1 && myStatus !== 3) {
                    await util.buildPath(path.substr(1), addPath);
                }
                await art.getContent(id, fid).then(async res => {
                    if (res.myStatus === 0) {
                        errMes = '<span style="color:red">ID为:' + res.id + '的文章生成失败 原因:' + res.errMes + '</span>'
                        if (ctx) ctx.write('<script>change(' + util.getPercent(index, sum) + ',' + index + ',\'' + errMes + '\',\'' + errMes + '\')</script>\n');
                        resolve1({ success: -1 });
                    } else {
                        await new Promise((resolve, reject) => {
                            fs.writeFile(fullPath + '/' + articleName + '.html', res.html, err => {
                                if (err) {
                                    resolve({ success: -1, mes: "<span style='color:red'>id为" + id + "的文章生成不成功!</span>" })
                                } else {
                                    resolve({ success: 1, mes: "id为" + id + "的文章生成功!" })
                                }
                            })
                        }).then(value => {
                            if (ctx && value.success === 1) ctx.write('<script>change(' + util.getPercent(index, sum) + ',' + index + ',\'' + value.mes + '\')</script>');
                            else if (ctx && value.success === -1) ctx.write('<script>change(' + util.getPercent(index, sum) + ',' + index + ',\'' + value.mes + '\',\'' + value.mes + '\')</script>\n');
                            resolve1({ success: value.success })
                        })
                    }
                })
            })
        }
    })
}
module.exports = buildArt;