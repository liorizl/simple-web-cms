const mysql = require('../function/mysql.js');
const util = require('../util/util.js');
const md5 = require('md5-node');
const config = require("../config/config.json");
module.exports = {
    login: async (ctx, next) => {
        const data = ctx.request.body;
        const userId = data.userId;
        if (/\=|\s/.test(userId)) {
            ctx.body = { myStatus: 'userid error'}
        } else {
            const userPsd = data.userPsd;
            const recordSession = data.recordSession;
            const ip = data.ip || '获取失败';
            const address = data.cname || '获取失败';
            const userPsdArr = [userId.split("")[1], userPsd, 'a'].join("");
            const userPsdEnd = md5(userPsdArr);
            const sql = 'select * from useradmin where userId = "' + data.userId + '" and userPsd = "' + userPsdEnd + '"';
            let result = await mysql.nquery(sql);
            if (result.length === 0) {
                ctx.body = result;
            }
            else {
                const date = util.dateFormat();
                const sqlLoginlist = 'insert into loginlist(ip, userName, address, date) value("' + ip + '", "' + userId + '", "' + address + '", "' + date + '")';
                mysql.nquery(sqlLoginlist);
                const loginTimes = result[0].loginTimes + 1;
                const sql1 = 'update useradmin set loginTimes = ' + loginTimes + ' where userId = "' + data.userId + '" and userPsd = "' + userPsdEnd + '"';
                mysql.nquery(sql1);
                const sessionMd5 = md5(userId + userPsd + new Date().getTime().toString());
                const mysession = { user: sessionMd5 };
                result.push(mysession);
                if (recordSession) {
                    const expire = new Date().getTime() + 1000 * 60 * 60 * 12;
                    const sql2 = 'select * from user_session where sessionId = "' + userId + '"';
                    const haveUser = await mysql.nquery(sql2);
                    if (haveUser.length === 0) {
                        const sqlInsertSession = 'insert into user_session(sessionId, expire, data, loginip, count) value("' + userId + '", ' + expire + ', "' + mysession.user + '", "'+ ip +'", 0)';
                        mysql.nquery(sqlInsertSession)
                    } else {
                        const sqlUpdateSession = 'update user_session set expire = ' + expire + ', data = "' + mysession.user + '", loginip = "' + ip + '", count = ' + (haveUser[0].count + 1) + ' where sessionId = "' + userId + '"';
                        mysql.nquery(sqlUpdateSession)
                    }
                }
                ctx.session.liori = sessionMd5;
                ctx.body = result
            }
        }
        
    },
    autoLogin: async ctx => {
        const ip = ctx.request.body.ip;
        const userCookie = ctx.cookies.get('user');
        const sql = 'select sessionId, expire, data from user_session where data = "' + userCookie + '" and loginip = "' + ip + '"';
        const result = await mysql.nquery(sql);
        const newDate = new Date().getTime();
        if (result.length > 0) {
            if (result[0].expire <= newDate) {
                ctx.body = { myStatus: 0, errMes: '自动登录已过期, 请重新登录！' }
            }
            else {
                ctx.session.liori = result[0].data;
                ctx.body = { myStatus: 1, user: result[0].sessionId }
            }
        } else {
            ctx.body = { myStatus: 0, errMes: '自动登录已过期或其他原因, 请重新登录！' }
        }
    },
    checkIdentCode: ctx => {
        const identCode = ctx.request.body.identCode;
        ctx.body = config.identCode === identCode ? 1 : 0
    },
    getIdent: ctx => {
        ctx.body = config.useIdentCode ? 1 : 0
    },
    checkSession: async ctx => {
        let userCookie
        if (ctx.cookies.get('user')) {
            userCookie = ctx.cookies.get('user')
            if (!ctx.session.liori || userCookie !== ctx.session.liori) {
                ctx.body = { myStatus: 0 }
            } else {
                ctx.body = { myStatus: 1 }
            }
        } else {
            ctx.body = { myStatus: 0 }
        }
    },
    deleSession: ctx => {
        ctx.session = null
        ctx.body = { myStatus: 1 }
    }
}