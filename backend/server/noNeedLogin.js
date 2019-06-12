const mysql = require('../function/mysql.js');
const ip = require("ip");
const config = require("../config/config.json");
module.exports = {
    showHit: async ctx=>{
        const id = parseInt(ctx.query.id);
        if(!id) return
        const add = parseInt(ctx.query.add);
        const sql = 'select hits from article where id = '+id;
        let result = await mysql.nquery(sql);
        if(result.length>0){
            if(add === 1){
                let hits = parseInt(result[0].hits) + 1;
                let sqlEdit = 'update article set hits = ' + hits + ' where id = ' + id;
                await mysql.nquery(sqlEdit);
                ctx.body = {hits: hits};
            }else{
                ctx.body = {hits: result[0].hits};
            }
        }else{
            ctx.body = 'returnHit={hits:"文章ID不正确！"}'
        }
    },
    addStars: async ctx=>{
        let tip = ip.address();
        const id = parseInt(ctx.query.id);
        const sqlStar = 'select * from articlestars where articleId =' + id;
        const sqlArt = 'select stars from article where id = '+ id;
        const resultArt = await mysql.nquery(sqlArt);
        const resultStar = await mysql.nquery(sqlStar);
        let stars = resultArt[0].stars;
        let sqlEditStar,
            sqlEditArt = 'update article set stars = ' +(stars+1)+ ' where id = '+id;
        if(resultStar.length === 0){
            sqlEditStar = 'insert into articlestars(articleId, stars, ip) value('+id+', '+(stars+1)+', "'+tip+'")';
            await mysql.nquery(sqlEditStar);
            await mysql.nquery(sqlEditArt);
            ctx.body = {myStatus: 1, stars: stars + 1};
        }else{
            let ipInData = resultStar[0].ip;
            if(ipInData.indexOf(tip) === -1){
                let newIpStr = ipInData + ',' + tip;
                sqlEditStar = 'update articlestars set stars = '+(stars+1)+', ip = "'+newIpStr+'" where articleId = '+id;
                await mysql.nquery(sqlEditStar);
                await mysql.nquery(sqlEditArt);
                ctx.body = {myStatus: 1, stars: stars + 1};
            }else{
                ctx.body = {myStatus: 2}
            }  
        }
    },
    getHostPort: ctx=>{
        ctx.body = {
            hostName: config.hostName,
            port: config.port
        }
    },
    getIp: ctx=>{
        ctx.body = 'var returnIp = \"' + ip.address() + '\"'
    },
    getWebName: async ctx=>{
        const sql = 'select webName from websetting where id = 1';
        const result = await mysql.nquery(sql);
        ctx.body = result[0]
    }
}