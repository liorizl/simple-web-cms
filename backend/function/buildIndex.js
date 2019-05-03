const index=require('../show/indexPage.js');
const fs=require('fs');
const config=require("../config/config.json");
const util = require('../util/util.js');
const mysql = require('./mysql.js');
const buildIndex=async ctx=>{
    let time1=new Date().getTime();
    const sql='select * from websetting';
    const webSetting=await mysql.nquery(sql);
    const indexName=webSetting[0].extendName;
    ctx.res.setHeader('Content-Type', 'text/html; charset=utf-8');
    const staticPath=config.staticWebPath+config.staticWebName;
    await util.statPath(staticPath,'isDir',true);
    await index.getContent().then(async html=>{
        await new Promise(resolve=>{
            fs.writeFile(staticPath+"/"+indexName,html,(err)=>{
                if(err){
                    console.log(err)
                    resolve({time:new Date().getTime(),status:0})
                }
                else{
                    resolve({time:new Date().getTime(),status:1})
                }
            })
        }).then(value=>{
            ctx.body={time:value.time-time1,status:value.status}
        })
    })

}
module.exports=buildIndex;