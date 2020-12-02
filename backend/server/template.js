const mysql = require('../function/mysql.js');
const util = require('../util/util.js');
const serverUtil = require('./serverUtil.js');
module.exports = {
    tempList: async ctx => {
        let type = parseInt(ctx.query.type);
        let sql = 'select * from template where type = ' + type + ' order by id desc';
        let result = await mysql.nquery(sql);
        ctx.body = result;
    },
    getEditTemp: async ctx => {
        let id = parseInt(ctx.query.id);
        let sql = 'select * from template where id = ' + id;
        let result = await mysql.nquery(sql);
        ctx.body = result;
    },
    upTemp: async ctx => {
        const act = ctx.query.act;
        await serverUtil.getForm(ctx.req).then(async value => {
            let sql, result;
            if (act === 'add') {
                if (parseInt(value.type[0]) === 3) {
                    sql = 'insert into template(title, type, isUse, num, titleCut, introCut, sqlCondi, sqlOrder, pagination, dateType, content, contentList, upTime)' +
                        'value("' + value.title[0] + '", ' + parseInt(value.type[0]) + ', "' + serverUtil.getCheckbox(value.isUse[0]) + '", ' + parseInt(value.num[0]) + ', ' +
                        parseInt(value.titleCut[0]) + ', ' + parseInt(value.introCut[0]) + ', "' + value.sqlCondi[0] + '" , "' + value.sqlOrder[0] + '",' + 
                        parseInt(value.pagination[0]) + ', ' + parseInt(value.dateType[0]) + ', ' +
                        '"' + util.regexpContent(value.content[0]) + '", "' + util.regexpContent(value.contentList[0]) + '", "' + util.dateFormat(new Date()) + '")';
                } else {
                    sql = 'insert into template(title, type, isUse, content, upTime)' +
                        'value("' + value.title[0] + '", ' + parseInt(value.type[0]) + ', "' + serverUtil.getCheckbox(value.isUse[0]) + '", ' +
                        '"' + util.regexpContent(value.content[0]) + '", "' + util.dateFormat(new Date()) + '")';
                }
                result = await mysql.nquery(sql);
                ctx.body = result;
            }
            else if (act === 'edit') {
                let id = parseInt(ctx.query.id)
                if (parseInt(value.type[0]) === 3) {
                    sql = 'update template set title="' + value.title[0] + '", type=' + parseInt(value.type[0]) + ', isUse="' + serverUtil.getCheckbox(value.isUse[0]) + '", ' +
                        'num=' + parseInt(value.num[0]) + ', titleCut=' + parseInt(value.titleCut[0]) + ', introCut=' + parseInt(value.introCut[0]) + ', ' +
                        'sqlCondi="' + value.sqlCondi[0] + '", sqlOrder="' + value.sqlOrder[0] + 
                        '", pagination=' + parseInt(value.pagination[0]) + ', dateType=' + parseInt(value.dateType[0]) + ', ' +
                        'content="' + util.regexpContent(value.content[0]) + '", contentList="' + util.regexpContent(value.contentList[0]) + '" where id=' + id;
                } else {
                    sql = 'update template set title="' + value.title[0] + '", type=' + parseInt(value.type[0]) + ', isUse="' + serverUtil.getCheckbox(value.isUse[0]) + '", ' +
                        'content="' + util.regexpContent(value.content[0]) + '" where id=' + id;
                }
                result = await mysql.nquery(sql);
                ctx.body = result;
            }
        })
    },
    changeIsUseTemp: async ctx => {
        const id = parseInt(ctx.query.id);
        const sql1 = 'update template set isUse = "false" where type = 1 and id != ' + id;
        const result1 = await mysql.nquery(sql1);
        if (result1.changedRows <= 0) {
            ctx.body = { myStatus: 0 }
        }
        const sql2 = 'update template set isUse = "true" where type = 1 and id = ' + id;
        const result2 = await mysql.nquery(sql2);
        if (result2.changedRows <= 0) {
            ctx.body = { myStatus: 0 }
        } else {
            let sql = 'select * from template where type = 1 order by id desc';
            let result = await mysql.nquery(sql);
            ctx.body = { myStatus: 1, result: result };
        }
    }
}