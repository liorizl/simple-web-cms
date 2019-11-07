const mysql = require('../function/mysql.js');
const util = require('../util/util.js');
const multiparty = require('multiparty');
const serverUtil = require('./serverUtil.js');
const buildArt = require('../function/buildArt.js');
const config = require("../config/config.json");
const column = require("./column.js");
const buildCol = require('../function/buildCol.js');
module.exports = {
    getArtTemp: async ctx => {
        const cid = parseInt(ctx.query.cid);
        const sql = 'select tempContent, path1, path2 from columns where cid=' + cid;
        let result = await mysql.nquery(sql);
        ctx.body = result[0];
    },
    getArtList: async ctx => {
        const cid = parseInt(ctx.query.cid);
        const num = parseInt(ctx.query.num);
        const page = parseInt(ctx.query.page) || null;
        let limit = page && page !== 1 ?
            ' limit ' + (num * (page - 1)) + ', ' + num :
            ' limit ' + num;
        limit = num ? limit : '';
        const sqlAll = 'select id from article where fid=' + cid;
        let sum = await mysql.nquery(sqlAll);
        sum = sum.length;
        const sql = 'select id, fid, title, picUrl, isIndex, path, isUse, upTime, hits, stars, articleName from article where fid = ' + cid + ' order by id desc' + limit;
        const result = await mysql.nquery(sql);
        ctx.body = { result: result, sum: sum };
    },
    articleEdit: async ctx => {
        const id = parseInt(ctx.query.id);
        const sql = "select * from article where id=" + id;
        const result = await mysql.nquery(sql);
        ctx.body = result
    },
    articleList: async ctx => {
        const sql = "select * from article order by id desc";
        const result = await mysql.nquery(sql);
        ctx.body = result
    },
    upArtFile: async ctx => {
        const path = ctx.query.path;
        const configPath = config.staticWebPath + config.staticWebName;
        let pathSet = configPath + '/upfiles',
            pathFamily = '/article'
        const folderPath = pathSet + pathFamily + path
        const pathStatus = await util.statPath(folderPath, 'isDir');
        if (pathStatus != 1) {
            const is = await util.statPath(configPath, 'isDir', true);
            await util.buildPath('/upfiles' + pathFamily + path, configPath);
        }
        let form = new multiparty.Form();
        form.uploadDir = pathSet + pathFamily + path;
        form.keepExtensions = true;
        form.maxFilesSize = 5 * 1024 * 1024;
        await new Promise((resolve, reject) => {
            form.parse(ctx.req, function (err, fields, files) {
                if (err) {
                    reject(err)
                }
                else {
                    let filePath = files.upfile[0].path;
                    filePath = filePath.replace(/\\/g, "/");
                    const regexp = new RegExp('\.*?' + config.staticWebName)
                    filePath = filePath.replace(regexp, '');//去掉前缀./web/upfile->/upfile
                    resolve(filePath)
                }
            })
        }).then(value => {
            ctx.response.body = "./" + value
        })
    },
    checkArtTitle: async ctx => {
        const updata = ctx.request.body;
        const sql = 'select id from article where fid=' + parseInt(updata.cid) + ' and title="' + updata.title + '"';
        const result = await mysql.nquery(sql);
        if (result.length > 0) {
            ctx.body = { myStatus: 1 }
        } else {
            ctx.body = { myStatus: 0 }
        }
    },
    getArtMes: async ctx => {
        const sqlCol = 'select id from columns';
        const sqlColNav = 'select id from columns where isNav = "true"';
        const sqlColUse = 'select id from columns where isUse = "true"';
        const sqlArt = 'select id from article';
        const sqlArtUse = 'select id from article where isUse = "true"';
        const promiseAll = [mysql.nquery(sqlCol), mysql.nquery(sqlColNav), mysql.nquery(sqlColUse), mysql.nquery(sqlArt), mysql.nquery(sqlArtUse)];
        await Promise.all(promiseAll).then(res => {
            const mes = { col: res[0].length, colNav: res[1].length, colUse: res[2].length, art: res[3].length, artUse: res[4].length }
            ctx.body = mes
        })
    },
    upArticle: async ctx => {
        const tid = ctx.query.cid ? parseInt(ctx.query.cid) : parseInt(ctx.query.id);
        const act = ctx.query.act;
        await serverUtil.getForm(ctx.req).then(async value => {
            let sql, myStatus, build, insertId, articleIntro;
            articleIntro = value.intro[0] ? util.replaceIntro(value.intro[0]) : util.replaceIntro(value.content[0]);
            if (act === 'add') {
                let artName = value.articleName[0], articleName;
                let haveName = await module.exports.checkArticleName(artName);
                if (haveName === 1) {
                    ctx.body = { myStatus: 9, err: '页面名字已经存在' };
                    return
                } else {
                    articleName = artName;
                }
                sql = 'insert into article(fid, title, mainTitle, viceTitle, isIndex, isUse, headLine, suggest, outUrl, keywords, content, intro, picUrl, path, articleName, author, source, sourceUrl, useSourceUrl, ' +
                    'tempName, orderBy, hits, stars, upTime) value(' + parseInt(tid) + ', "' + value.title[0] + '", "' + value.mainTitle[0] + '", "' + value.viceTitle[0] + '", "' + serverUtil.getCheckbox(value.isIndex[0]) + '", "' + serverUtil.getCheckbox(value.isUse[0]) + '", ' +
                    parseInt(value.headLine[0]) + ', ' + parseInt(value.headLine[0]) + ', "' + value.outUrl[0] + '", "' + value.keywords[0] + '", ' +
                    '"' + util.regexpContent(value.content[0]) + '", "' + articleIntro + '", "' + value.picUrl[0] + '", "' + value.path[0] + '", "' + articleName + '", "' + value.author[0] + '", ' +
                    '"' + value.source[0] + '", "' + value.sourceUrl[0] + '", "' + serverUtil.getCheckbox(value.useSourceUrl[0]) + '", "' + value.tempName[0] + '", ' + parseInt(value.orderBy[0]) + ', ' + parseInt(value.hits[0]) + ', ' + parseInt(value.stars[0]) + ', "' + util.dateFormat(new Date()) + '")';
            }
            else if (act === 'edit') {
                sql = 'update article set title="' + value.title[0] + '", mainTitle="' + value.mainTitle[0] + '", viceTitle="' + value.viceTitle[0] + '", isIndex="' + serverUtil.getCheckbox(value.isIndex[0]) + '", ' +
                    'isUse="' + serverUtil.getCheckbox(value.isUse[0]) + '", content="' + util.regexpContent(value.content[0]) + '", intro="' + articleIntro + '", picUrl="' + value.picUrl[0] + '", ' +
                    'headLine=' + parseInt(value.headLine[0]) + ', suggest=' + parseInt(value.suggest[0]) + ', outUrl="' + value.outUrl[0] + '", keywords="' + value.keywords[0] + '", ' +
                    'path="' + value.path[0] + '", articleName="' + value.articleName[0] + '", author="' + value.author[0] + '", source="' + value.source[0] + '", sourceUrl="' + value.sourceUrl[0] + '", useSourceUrl="' + serverUtil.getCheckbox(value.useSourceUrl[0]) + '", ' +
                    'tempName="' + value.tempName[0] + '", orderBy=' + parseInt(value.orderBy[0]) + ', hits=' + parseInt(value.hits[0]) + ', stars=' + parseInt(value.stars[0]) + ', lastEditTime="' + util.dateFormat(new Date()) + '"' +
                    ' where id = ' + parseInt(tid);
            }
            const result = await mysql.nquery(sql);
            if (result) {
                myStatus = 1;
                insertId = result.insertId || null;
                if (act === 'add') {
                    const sql2 = 'update article set articleName="' + String(insertId) + '" where id=' + insertId;
                    const upName = await mysql.nquery(sql2);
                    if (!upName) {
                        myStatus = 0
                    }
                }
            } else {
                myStatus = 0
            }
            ctx.body = { myStatus: myStatus, build: build, name: 'buildArt', id: insertId };
        })
    },
    checkArticleName: async artName => {
        const sql = 'select articleName from article where articleName = "' + artName + '"';
        const result = await mysql.nquery(sql);
        if (result.length > 0) {
            return 1
        } else {
            return 0
        }
    },
    getNowArticle: async ctx => {
        const cid = parseInt(ctx.query.cid);
        let reArr = [];
        await new Promise(async resolve => {
            const nowPosition = async (tid) => {
                let sql = 'select aid, cid, title, ultimate from columns where cid = ' + tid;
                let result = await mysql.nquery(sql);
                if (result.length > 0) {
                    let res = result[0];
                    if (res.ultimate === 'true') {
                        reArr.push({ name: res.title, url: { temp: 'articleList', query: { cid: res.cid } } })
                    } else {
                        reArr.push({ name: res.title })
                    }
                    nowPosition(result[0].aid)
                } else {
                    resolve(reArr)
                }
            }
            nowPosition(cid)
        }).then(resArr => {
            ctx.body = resArr.reverse()
        })
    },
    getSourceUrlList: async ctx => {
        const sql = 'select title, url from articlesource order by id desc';
        const result = await mysql.nquery(sql);
        if (result.length > 0) {
            ctx.body = result
        } else {
            ctx.body = [{ title: '还没有添加来源', url: '' }];
        }
    },
    postSource: async ctx => {
        let exist;
        const updata = ctx.request.body;
        const sqlExist = 'select title, url from articlesource where title = "' + updata.title + '" and url = "' + updata.url + '"';
        const resExist = await mysql.nquery(sqlExist);
        exist = resExist.length > 0 ? 1 : 0;
        if (exist === 1) {
            ctx.body = { exist: 1 };
        } else {
            const sql = 'insert into articlesource(title, url, upTime) values("' + updata.title + '", "' + updata.url + '", "' + util.dateFormat() + '")';
            const result = await mysql.nquery(sql);
            if (result.affectedRows === 1) {
                ctx.body = { myStatus: 1 }
            }
            else {
                ctx.body = { myStatus: 0 }
            }
        }
    },
    getEditArt: async ctx => {
        const id = parseInt(ctx.query.id);
        const sql = 'select * from article where  id = ' + id;
        const result = await mysql.nquery(sql);
        ctx.body = result[0];
    },
    withBuildArt: async ctx => {
        const id = parseInt(ctx.query.id);
        await buildArt(ctx, null, id).then(value => {
            if (value) {
                ctx.body = { myStatus: value.success }
            }
            else {
                ctx.body = { error: '登录过期，请重新登录！' }
            }
        })
    },
    upAuthor: async ctx => {
        const author = ctx.query.author;
        const sqlExist = 'select name from articleauthor where name = "' + author + '"';
        const resExist = await mysql.nquery(sqlExist);
        if (resExist.length > 0) {
            ctx.body = { myStatus: 2 }
        }
        else {
            const sql = 'insert into articleauthor(name, upTime) values("' + author + '", "' + util.dateFormat(new Date()) + '")';
            const result = await mysql.nquery(sql);
            if (result.affectedRows === 1) {
                ctx.body = { myStatus: 1 }
            }
            else {
                ctx.body = { myStatus: 0 }
            }
        }
    },
    getAuthorList: async ctx => {
        const sql = 'select name from articleauthor order by id desc';
        const result = await mysql.nquery(sql);
        if (result.length > 0) {
            let res = result.map(obj => {
                return obj.name
            })
            ctx.body = res
        } else {
            ctx.body = ['还没有添加作者']
        }
    },
    copyArt: async ctx => {
        const act = ctx.request.body.act;
        const artId = ctx.request.body.artid;
        const cid = ctx.request.body.cid;
        const sqlWhere = artId.length > 1 ? ' id in (' + artId + ')' : ' id=' + artId[0]
        if (act === 'copy') {
            let sqlArts, arts;
            if (artId.length > 1) {
                sqlArts = 'select fid, title, mainTitle, viceTitle, isIndex, isUse, headLine, suggest, outUrl, keywords, content, intro, picUrl, path, articleName, author, source, sourceUrl, useSourceUrl, ' +
                    'tempName, orderBy, hits, stars, upTime from article where ' + sqlWhere + ' order by id asc';
            } else {
                sqlArts = 'select fid, title, mainTitle, viceTitle, isIndex, isUse, headLine, suggest, outUrl, keywords, content, intro, picUrl, path, articleName, author, source, sourceUrl, useSourceUrl, ' +
                    'tempName, orderBy, hits, stars, upTime from article where ' + sqlWhere;
            }
            const articles = await mysql.nquery(sqlArts);
            if (articles.length < 1) {
                ctx.body = { myStatus: 0, errMes: '没有传过来文章，操作失败！' }
                return
            }
            arts = articles.map(art => {
                return Object.keys(art).map(key => {
                    return art[key]
                })
            })
            arts = arts.map(art => {
                return art.map((ar, index) => {
                    return index === 0 ? cid : ar
                })
            })
            const sql = 'insert into article(fid, title, mainTitle, viceTitle, isIndex, isUse, headLine, suggest, outUrl, keywords, content, intro, picUrl, path, articleName, author, source, sourceUrl, useSourceUrl, ' +
                'tempName, orderBy, hits, stars, upTime) values ?'
            const result = await mysql.multquery(sql, [arts]);
            ctx.body = { myStatus: 1, num: result.affectedRows }
        } else if (act === 'dele') {
            const sqlDele = 'delete from article where id in (' + artId + ')';
            const resDele = await mysql.nquery(sqlDele);
            ctx.body = { myStatus: 1, num: resDele.affectedRows }
        } else if (act === 'cut') {
            const sqlCut = 'update article set fid = ' + cid + ' where' + sqlWhere;
            let resCut = await mysql.nquery(sqlCut);
            if (resCut.affectedRows >= 1) {
                ctx.body = ctx.body = { myStatus: 1, num: resCut.affectedRows }
            } else {
                ctx.body = { myStatus: 0, errMes: '未知原因！' }
            }
        } else {
            ctx.body = { myStatus: 0, errMes: '传入错误的动作，操作失败！' }
        }
    },
    buildFaArt: async ctx => {
        const id = parseInt(ctx.query.id);
        const sql = 'select fid from article where id = ' + id;
        const result = await mysql.nquery(sql);
        const fid = result[0].fid;
        const sqlCol = 'select id, aid from columns where cid = ' + fid;
        const resultCol = await mysql.nquery(sqlCol);
        const colId = resultCol[0].id;
        const aid = resultCol[0].aid;
        await buildCol(null, null, colId).then(async value => {
            const myStatus = value.success;
            if (aid === 0) {
                ctx.body = { myStatus: myStatus, aid: 0, colId: colId }
            } else {
                const sqls = 'select id, aid from columns where id = ' + colId;
                const res = await mysql.nquery(sqls);
                if (res.length > 0) {
                    ctx.body = { myStatus: myStatus, aid: res[0].aid, colId: colId }
                } else {
                    ctx.body = { myStatus: myStatus, aid: 0, colId: colId }
                }
            }
        })
    }
}