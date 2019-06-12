const mysql = require('../function/mysql.js');
const replaceTag = require('../function/replaceTag.js')
const util = require('../util/util.js');
const showArticle = async ctx =>{
    if(ctx.query.id === undefined){
        ctx.body = '参数没有传入文章ID，不晓得你想显示哪一个'
    }else{
        const id = parseInt(ctx.query.id);
        const sql = 'select fid from article where id = '+id;
        const result = await mysql.nquery(sql);
        if(result.length === 0){
            ctx.body = '错误：<br>id:' + res.id + '原因:没有该ID的文章或该ID没有父栏目的FID'
        }else{
            const fid = result[0].fid;
            await getContent(id, fid).then(res=>{
                if(res.myStatus === 0){
                    ctx.body = '错误：<br>id:' + res.id + '原因:' + res.errMes
                }else{
                    ctx.body = res.html
                }
            });
        }
         
    }
}
const getContent = async (id, fid)=>{
    let html, tempName, webSetting;
    const sqlWebSetting = 'select * from websetting';
    const resWebSetting = await mysql.nquery(sqlWebSetting);
    webSetting = util.objKeysToLower(resWebSetting);
    const sql = 'select * from article where id = '+id;
    const result = await mysql.nquery(sql);
    if(result.length === 0){
        return {
            myStatus: 0,
            id: id,
            errMes: 'id错误，没有该id的文章'
        }
    }
    tempName = result[0].tempName;
    const sqlTemp = 'select * from template where title = "'+tempName+'"';
    const resultTemp = await mysql.nquery(sqlTemp);
    if(resultTemp.length === 0){
        return {
            myStatus: 0,
            id: id,
            errMes: '模版错误，该文章没有绑定模版'
        }
    }
    const parentCid = result[0].fid
    const sqlParent = 'select * from columns where cid = '+parentCid;
    const parent = await mysql.nquery(sqlParent);
    html = resultTemp[0].content;
    html = await replaceTag.replaceField(html, {self: result, parent: parent[0]}, null, webSetting);
    html = await replaceTag.beginReplace(html, 'art', fid, null, null, null, webSetting);
    return {myStatus: 1, html: html}
}

module.exports = {
    showArticle,
    getContent
};