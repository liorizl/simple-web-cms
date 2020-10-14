const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require("koa-bodyparser");
const koaStatic = require('koa-static');
const util = require('./util/util.js');
const session = require('koa-session');
const config = require("./config/config.json");
const cors = require('koa2-cors');
const mysql = require('./function/mysql.js');
const redisClient = require('./function/redis.js');
const app = new Koa();
const router = new Router();
app.use(bodyParser());
const sessionConfig = {
    key: 'liorikoasess',
    maxAge: 1000 * 60 * 60 * 12
};
app.keys = ['liorizl'];
app.use(session(sessionConfig, app));
app.use(cors({
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(async (ctx, next) => {
    const path = ctx.path;
    if (/^\/admin\//i.test(path)) {
        if (/^\/admin\/login|^\/admin\/getident|^\/admin\/checkIdentcode|^\/admin\/getWebName/i.test(path)) {
            await next()
        } else {
            // console.log(ctx.cookies.get('user'), ctx.session.liori)
            if (!ctx.cookies.get('user') || !ctx.session.liori || ctx.cookies.get('user') !== ctx.session.liori) {
                ctx.body = '你还没有登录，请登录后再操作！';
            }
            else {
                await next();
            }
        }
    } else {
        await next();
    }
})
; (async () => {
    const colObj = {}
    const sqlAll = 'select * from columns where isUse = "true"';
    let resultAll = await mysql.nquery(sqlAll);
    resultAll = util.objKeysToLower(resultAll);
    resultAll.forEach(res => {
        colObj[res.id] = res;
    })
    redisClient.set(config.redis.colName, JSON.stringify(colObj), () => { console.log('redis数据' + config.redis.colName + '获取成功!') });
})()
const noNeedLogin = require('./router/noNeedLogin.js');
const routerBasic = require('./router/routerBasic.js');
const routerCol = require('./router/routerCol.js');
const routerArt = require('./router/routerArt.js');
const routerLogin = require('./router/routerLogin.js');
const routerOther = require('./router/routerOther.js');
const routerTag = require('./router/routerTag.js');
const routerTemp = require('./router/routerTemp.js');
const routerAll = noNeedLogin.concat(routerBasic).concat(routerCol).concat(routerArt).concat(routerLogin).concat(routerOther).concat(routerTag).concat(routerTemp);
routerAll.forEach((route) => {
    router.register([route.url], [route.method], route.middleware)
})
app.use(router.routes());

app.use(koaStatic(util.getPath(process.cwd())));
app.use(koaStatic(process.cwd() + '/statics/'));
app.listen(config.port, () => { console.log("server has started at " + config.port) });