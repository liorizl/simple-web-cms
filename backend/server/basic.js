const mysql = require('../function/mysql.js');
const config=require("../config/config.json");
const serverUtil=require('./serverUtil.js');
module.exports={
    getSysMes:async ctx=>{
        let sysMes={
            webPath:process.cwd(),
            os:process.env.os,
            nodeVersion:process.versions.node,
            hostName:config.hostName,
            port:config.port,
            version:config.version,
            staticWebName:config.staticWebName,
            staticWebPath:config.staticWebPath
        };
        ctx.body=sysMes
    },
    getHost:ctx=>{
        ctx.body=ctx.headers.referer;
    },
    mysqlVersion:async ctx=>{
        const mysql=require("mysql");
        const pool=mysql.createPool(config.mysql);
        await new Promise((resolve,reject)=>{
            pool.getConnection((err,conn)=>{
                if(err){
                    reject(err)
                }
                else{
                    //console.log(conn._protocol._connection._protocol._handshakeInitializationPacket.serverVersion)
                    resolve(conn._protocol._handshakeInitializationPacket.serverVersion)
                }
             })
        }).then(res=>{
            ctx.body=res
        }).catch(err=>{
            ctx.body='没获取到mysql版本'
        })
    
    },
    upSetting:async ctx=>{
        await serverUtil.getForm(ctx.req).then(async value=>{
            const sql='update webSetting set webName="'+value.webName[0]+'",webUrl="'+value.webUrl[0]+'",keyword="'+value.keyword[0]+'",description="'+value.description[0]+'",'+
                'extendName="'+value.extendName[0]+'",indexModel='+parseInt(value.indexModel[0])+',pageModel='+parseInt(value.pageModel[0])+','+
                'author="'+value.author[0]+'",indexPath="'+value.indexPath[0]+'",pagePath="'+value.pagePath[0]+'",'+
                'buildCol='+parseInt(value.buildCol[0])+',buildFaCol='+parseInt(value.buildFaCol[0])+',buildArt='+parseInt(value.buildArt[0])+',buildFaArt='+parseInt(value.buildFaArt[0])+','+
                'listNum='+value.listNum[0]+' where id=1';
            const result=await mysql.nquery(sql);
            if(result.affectedRows===1){
                ctx.body={myStatus:1}
            }else{
                ctx.body={myStatus:0}
            }
        })
    },
    getSetting:async ctx=>{
        const sql='select * from websetting';
        const result=await mysql.nquery(sql);
        ctx.body=result[0]
    },
}