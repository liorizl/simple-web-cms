const mysql = require('../function/mysql.js');
const replaceTag = require('../function/replaceTag.js');
const util = require('../util/util.js');
const index = async (ctx) => {
    await getContent().then(value => {
        ctx.body = value
    });
}
const getContent = async (build = null) => {
    let html, webSetting;
    const sqlWebSetting = 'select * from websetting';
    const resWebSetting = await mysql.nquery(sqlWebSetting);
    webSetting = util.objKeysToLower(resWebSetting);
    const sql = 'select content from template where type = 1 and isUse = "true"';
    const result = await mysql.nquery(sql);
    if (result.length > 0) {
        html = result[0].content;
    } else {
        return '首页还没有绑定模版!'
    }
    html = await replaceTag.replaceField(html, result, null, webSetting, null, null, null);
    return replaceTag.beginReplace(html, 'index', null, null, null, null, webSetting);
}
module.exports = {
    index: index,
    getContent: getContent
};

