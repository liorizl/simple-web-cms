const mysql = require('../function/mysql.js');
const util = require('../util/util.js');
const serverUtil = require('./serverUtil.js');
module.exports = {
    upTag: async ctx=>{
        const act = ctx.query.act;
        const type = parseInt(ctx.query.type);
        await serverUtil.getForm(ctx.req).then(async value=>{
            if(act==='add'){
                const sql = 'insert into tag (type, title, callName, content, upTime) value('+type+', "'+value.title[0]+'", "'+value.callName[0]+'", "'+util.regexpContent(value.content[0])+'", "'+util.dateFormat(new Date())+'")';
                const result = await mysql.nquery(sql);
                ctx.body = result
            }
            else if(act==='edit'){
                const id = parseInt(ctx.query.id)
                const sql = 'update tag set title = "'+value.title[0]+'", callName = "'+value.callName[0]+'", content = "'+util.regexpContent(value.content[0])+'" where id = '+id;
                const result = await mysql.nquery(sql)
                ctx.body = result
            }
            else{
                ctx.body = '传入参数错误!';
            }
        })
    },
    tagList: async ctx=>{
        let type = parseInt(ctx.query.type), sql;
        if(type===1){
            sql = 'select * from tag where type = '+type;
        }
        else if(type===2){
            sql = 'select * from dynatag order by id desc'
        }
        else if(type===3){
            sql = 'select * from sqltag order by id desc'
        }
        let result = await mysql.nquery(sql)
        ctx.body = result
    },
    tagMes: async ctx=>{
        const id = parseInt(ctx.query.id);
        const sql = 'select * from tag where id = '+id;
        const result = await mysql.nquery(sql);
        ctx.body = result;
    },
    upTagTemp: async ctx=>{
        const act = ctx.query.act;
        await serverUtil.getForm(ctx.req).then(async value=>{
            if(act==='add'){
                const sql = 'insert into tagtemp(title, datetype, tempcontent, listcontent, uptime) value("'+value.title[0]+'", '+parseInt(value.timeType[0])+', "'+util.regexpContent(value.pageTemp[0])+'", "'+util.regexpContent(value.listTemp[0])+'", "'+util.dateFormat(new Date())+'")';
                let result = await mysql.nquery(sql);
                ctx.body = result;
            }
            else if(act==='edit'){
                let id = parseInt(ctx.query.id)
                let sql = 'update tagtemp set title = "'+value.title[0]+'", datetype = '+parseInt(value.timeType[0])+', tempcontent = "'+util.regexpContent(value.pageTemp[0])+'", listcontent = "'+util.regexpContent(value.listTemp[0])+'" where id = '+id
                let result = await mysql.nquery(sql);
                ctx.body = result;
            }
        })
    },
    getTagTempList: async ctx=>{
        const sql = 'select id, title from tagtemp order by id desc';
        let result = await mysql.nquery(sql);
        ctx.body = result;
    },
    getTagTemp: async ctx=>{
        const id = parseInt(ctx.query.id);
        const sql = 'select * from tagtemp where id = '+id;
        let result = await mysql.nquery(sql);
        ctx.body = result;
    },
    upSqlTag: async ctx=>{
        const act = ctx.query.act;
        await serverUtil.getForm(ctx.req).then(async value=>{
            if(act === 'add'){
                const sql = 'insert into sqltag(title, callname, sqlcontent, listcontent, uptime) value("'+value.title[0]+'", "'+value.callName[0]+'", "'+util.regexpContent(value.sqlContent[0])+'", "'+util.regexpContent(value.sqlListContent[0])+'", "'+util.dateFormat(new Date())+'")';
                let result = await mysql.nquery(sql);
                ctx.body = result;
            }
            else if(act==='edit'){
                let id = parseInt(ctx.query.id)
                let sql = 'update sqltag set title = "'+value.title[0]+'", callname = "'+value.callName[0]+'", sqlcontent = "'+util.regexpContent(value.sqlContent[0])+'", listcontent = "'+util.regexpContent(value.sqlListContent[0])+'" where id = '+id
                let result = await mysql.nquery(sql);
                ctx.body = result;
            }
        })
    },
    getSqlTag: async ctx=>{
        const id = parseInt(ctx.query.id);
        const sql = 'select * from sqltag where id = '+id;
        const result = await mysql.nquery(sql);
        ctx.body = result;
    }
}