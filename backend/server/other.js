const mysql = require('../function/mysql.js');
const util = require('../util/util.js');
const multiparty = require('multiparty');
const serverUtil = require('./serverUtil.js');
const jsTemp = require('../function/buildJsTemplate.js');
const config = require("../config/config.json");
const fs = require('fs');
const md5 = require('md5-node');
module.exports = {
    upfile: async ctx => {
        const cid = ctx.query.cid;
        const terminal = ctx.query.terminal;
        let pathEnd;
        if (terminal) {
            pathEnd = await serverUtil.getColPath(cid, terminal)
        } else {
            pathEnd = await serverUtil.getColPath(parseInt(cid)) 
        }
        const pathStatus = await util.statPath(pathEnd.pathEnd, 'isDir');
        if (pathStatus != 1) {
            await util.buildPath(pathEnd.pathCol, pathEnd.path);
        }
        let form = new multiparty.Form();
        form.uploadDir = pathEnd.pathEnd;
        form.keepExtensions = true;
        form.maxFilesSize = 5 * 1024 * 1024;
        await new Promise((resolve, reject) => {
            form.parse(ctx.req, function (err, fields, files) {
                if (err) {
                    reject(err)
                }
                else {
                    let filePath = files.upfile[0].path;
                    filePath = filePath.substr(4);//去掉./web/
                    filePath = filePath.replace(/\\/g, "/");
                    resolve(filePath)
                }
            })
        }).then(value => {
            ctx.response.body = value
        })
    },
    getUpfiles: async ctx => {
        const cid = ctx.query.cid;
        const terminal = ctx.query.terminal;
        let pathEnd;
        if (terminal && cid === 'banner'){
            pathEnd = await serverUtil.getColPath('banner', terminal);
        } else {
            pathEnd = await serverUtil.getColPath(parseInt(cid));
        }
        const pathStatus = await util.statPath(pathEnd.pathEnd, 'isDir');
        if (pathStatus === 9) {
            ctx.body = { path: pathEnd.pathEnd.substr(6), files: [] }
        } else {
            await new Promise((resolve, reject) => {
                fs.readdir(pathEnd.pathEnd, (err, files) => {
                    if (err) {
                        reject(err)
                    } else {
                        let newFiles = []
                        files.forEach(file => {
                            if (/\.(jpe?g|png|gif)$/.test(file)) {
                                newFiles.push(file)
                            }
                        })
                        let result = { path: pathEnd.pathEnd.substr(6), files: newFiles };
                        resolve(result)
                    }
                })
            }).then(value => {
                ctx.body = value;
            })
        }
    },
    dele: async ctx => {
        const id = parseInt(ctx.query.id);
        const table = ctx.query.table;
        const cid = parseInt(ctx.query.cid) || null;
        if (table === 'columns') {
            await serverUtil.getAllCols(cid).then(async colArr => {
                let artArr = [], promiseAll = [], promiseDeleAll = [];
                colArr.unshift({ id: id, cid: cid });
                for (let [i, col] of colArr.entries()) {
                    const sql = 'select id from article where fid = ' + col.cid
                    promiseAll[i] = await mysql.nquery(sql)
                }
                await Promise.all(promiseAll).then(async artAll => {
                    artAll.forEach((art, i) => {
                        if (art.length > 0) {
                            artArr = artArr.concat(art)
                        }
                    })
                    colArr.forEach((col, i) => {
                        let newObj = col;
                        newObj.table = 'columns'
                        promiseDeleAll[i] = serverUtil.doDele('columns', col.id);
                    })
                    artArr.forEach((art, i) => {
                        let newObj = art;
                        newObj.table = 'article'
                        promiseDeleAll[colArr.length + i] = serverUtil.doDele('article', art.id);
                    })
                    await Promise.all(promiseDeleAll).then(mes => {
                        ctx.body = { myStatus: 1, col: colArr.length, art: artArr.length }
                    })
                })
            })
        } else {
            await serverUtil.doDele(table, id).then(mes => {
                ctx.body = { myStatus: mes.myStatus, table: mes.table }
            })
        }
    },
    getUserList: async ctx => {
        const getIp = ctx => {
            return ctx.req.headers['x-forwarded-for'] ||
                ctx.req.connection.remoteAddress ||
                ctx.req.socket.remoteAddress ||
                ctx.req.connection.socket.remoteAddress;
        }
        const num = parseInt(ctx.query.num);
        const page = parseInt(ctx.query.page) || null;
        let limit = page && page !== 1 ?
            ' limit ' + (num * (page - 1)) + ',' + num :
            ' limit ' + num;
        limit = num ? limit : '';
        const sqlAll = 'select id from loginlist';
        let sum = await mysql.nquery(sqlAll);
        sum = sum.length;
        const sql = 'select * from loginlist order by id desc' + limit;
        const result = await mysql.nquery(sql);
        ctx.body = { result: result, sum: sum };
    },
    editPsd: async ctx => {
        let userPsd, newPsd, sqlEdit;
        //[userId.split("")[1], userPsd, 'a'].join("");
        const tdata = ctx.request.body;
        userPsd = [tdata.name.split('')[1], tdata.psd, 'a'].join("");
        userPsd = md5(userPsd);
        newPsd = tdata.newName ?
            [tdata.newName.split('')[1], tdata.newPsd, 'a'].join("") :
            [tdata.name.split('')[1], tdata.newPsd, 'a'].join("");
        newPsd = md5(newPsd);
        const sql = 'select * from useradmin where userId = "' + tdata.name + '" and userPsd = "' + userPsd + '"';
        const resExist = await mysql.nquery(sql);
        if (resExist.length > 0) {
            sqlEdit = tdata.newName ?
                'update useradmin set userId = "' + tdata.newName + '", userPsd = "' + newPsd + '"' :
                'update useradmin set userPsd = "' + newPsd + '"';
            const resEdit = await mysql.nquery(sqlEdit);
            if (resEdit.affectedRows === 1) {
                ctx.body = { myStatus: 1 };
            } else {
                ctx.body = { myStatus: 0, mes: '程序内部原因修改失败!' };
            }
        } else {
            ctx.body = { myStatus: 0, mes: '用户名或密码不正确!' }
        }
    },
    buildJs: async ctx => {
        const buildJsTemp = jsTemp(config.hostName, config.port);
        //const path = config.staticWebPath+config.staticWebName+'/static/js/';  //生成到WEB目录下
        const path = './statics/static/js/';
        const exist = await util.statPath(path, 'isDir', 'create');
        if (exist === 1 || exist === 3) {
            await new Promise(resolve => {
                fs.writeFile(path + 'showClick.js', buildJsTemp, err => {
                    if (err) {
                        resolve({ myStatus: 0 })
                    } else {
                        resolve({ myStatus: 1, name: 'showClick.js', path: path })
                    }
                })
            }).then(value => {
                ctx.body = value
            })
        } else {
            ctx.body = { myStatus: 0 }
        }
    },
    upBanner: async ctx => {
        const {act, id} = ctx.query;
        let sql
        await serverUtil.getForm(ctx.req).then(async value => {
            // console.log(value)
            if (act === 'add') {
                sql = 'insert into banner(title, pcurl, wapurl, pclink, waplink, isuse, orderby, uptime) ' + 
                    'value("'+ value.title[0] +'", "'+ value.pcUrl[0] +'", "'+ value.wapUrl[0] +'", "'+ value.pcLink[0] +
                    '", "'+ value.wapLink[0] +'", "'+ value.isUse[0] +'", '+ parseInt(value.orderBy[0]) +', "'+ util.dateFormat(new Date()) +'")';
            } else {
                sql = 'update banner set title="'+ value.title[0] +'", pcurl="'+ value.pcUrl[0] +'", wapurl="'+ value.wapUrl[0] +'",pclink="'+ value.pcLink[0] +
                '",waplink="'+ value.wapLink[0] +'",isuse="'+ value.isUse[0] +'",orderby='+ parseInt(value.orderBy[0]) +' where id=' + parseInt(id);
            }
            const res = await mysql.nquery(sql);
            let upStatus
            if (res.affectedRows === 1) {
                upStatus = 1
            } else {
                upStatus = 0
            }
            ctx.body = {
                upStatus
            }
        })
        
    },
    getBanner: async ctx => {
        const sql = 'select * from banner order by orderBy, id desc';
        const result = await mysql.nquery(sql);
        ctx.body = result;
    },
    getBannerEdit: async ctx => {
        const id = parseInt(ctx.query.id);
        const sql = 'select * from banner where id=' + id;
        const result = await mysql.nquery(sql);
        ctx.body = result[0];
    }
 }