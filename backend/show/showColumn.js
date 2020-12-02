const mysql = require('../function/mysql.js');
const replaceTag = require('../function/replaceTag.js');
const util = require('../util/util.js');
const showColumn = async (ctx) => {
    const page = parseInt(ctx.query.page) || null;
    const url = ctx.url;
    if (ctx.query.id === undefined) {
        ctx.body = '参数没有传入文章ID，不晓得你想显示哪一个'
    } else {
        await getContent(parseInt(ctx.query.id), page, url).then(value => {
            if (value.myStatus === 0) {
                ctx.body = '错误：栏目ID:' + value.id + ' 原因:' + value.errMes;
            } else {
                ctx.body = value.html
            }
        });
    }
}
const getContent = async (id, page, url, build = null) => {
    let html, htmlC, tempName, sumTemp, sumTag, numTemp, numTag, pageListTemp, pageListTag, webSetting;
    page = page || 1;
    const sql = 'select * from columns where id = ' + id;
    const result = await mysql.nquery(sql);
    if (result.length === 0) {
        return { myStatus: 0, id: id, errMes: 'id错误，没有该id的栏目' }
    }
    const sqlWebSetting = 'select * from websetting';
    const resWebSetting = await mysql.nquery(sqlWebSetting);
    webSetting = util.objKeysToLower(resWebSetting);
    tempName = result[0].tempMode === 1 ? result[0].tempCover : result[0].tempList;
    const sqlTemp = 'select * from template where title = "' + tempName + '"';
    let resultTemp = await mysql.nquery(sqlTemp);
    if (resultTemp.length === 0) {
        return { myStatus: 0, id: id, errMes: '模版错误，该id的栏目没有绑定模版' }
    }
    html = resultTemp[0].content;
    let tempMes = resultTemp[0];
    delete tempMes.content;
    htmlC = await replaceTag.replaceField(html, { self: result, parent: {} }, tempMes, webSetting, page, url, build);
    numTemp = htmlC.num || null;
    sumTemp = htmlC.sum || null;
    pageListTemp = htmlC.pageList || null;
    html = htmlC.htmlC || htmlC;
    htmlC = await replaceTag.beginReplace(html, 'col', id, page, url, build, webSetting);
    html = htmlC.htmlC || htmlC;
    numTag = htmlC.num || null;
    sumTag = htmlC.sum || null;
    pageListTag = htmlC.pageList || null;
    if (sumTemp && sumTag) {
        return { myStatus: 0, id: id, errMes: '一个栏目中不要在模版和标签中同时存在分页标签' }
    } else {
        if (build === null) {
            return { myStatus: 1, html: html }
        } else {
            return { myStatus: 1, html: html, page: page, num: numTemp || numTag, sum: sumTemp || sumTag, pageList: pageListTemp || pageListTag }
        }
    }
}
module.exports = {
    showColumn,
    getContent
};