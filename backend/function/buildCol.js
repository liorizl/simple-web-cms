const col=require('../show/showColumn.js');
//const cheerio = require('cheerio');
const mysql = require('../function/mysql.js');
const util = require('../util/util.js');
const fs=require('fs');
const config=require("../config/config.json");
const template=require('./buildTemplate.js');
const buildCol=async (ctx,next=null,colId=null)=>{
    const staticPath=config.staticWebPath+config.staticWebName;
    await util.statPath(staticPath,'isDir',true);
    let path='';
    const sql='select * from websetting';
    const webSetting=await mysql.nquery(sql);
    path=staticPath+webSetting[0].pagePath;
    await util.statPath(path,'isDir',true);
    let id=(ctx&&ctx.query.id)||null,sqlClass;
    if(id){
        sqlClass='select id from columns where id in ('+id+')'
    }
    else if(colId){   //此参数表示修改栏目后即时生成的栏目
        sqlClass='select id from columns where id='+colId;
    }
    else{
        sqlClass='select id from columns';
    }
    let idResult=await mysql.nquery(sqlClass);
    if(colId){
        return new Promise(resolve=>{
            checkPath(null,colId,path).then(value=>{
                resolve(value)
            })
        })
    }else{
        const bTime=new Date().getTime();
        ctx.res.setHeader('Content-Type', 'text/html; charset=utf-8');
        ctx.res.write(template('栏目'));
        let idArr=idResult.map(obj=>{
            return obj.id
        })
        let rightNum=0,wrongNum=0;
        const sum=idArr.length;
        ctx.res.write('<script>getSum('+idArr.length+')</script>');
        for(let [index,id] of idArr.entries()){
             await checkPath(ctx.res,id,path,index,sum).then(value=>{
                 if(value.success===1){
                     rightNum+=1;
                 }else{
                    wrongNum+=1
                 }
            }).catch(err=>{
                let errMes='生成id为'+id+'的栏目时，程序内部出现为题，请检查！'
                ctx.res.write('<script>change('+util.getPercent(index,sum)+','+index+',\''+errMes+'\',\''+errMes+'\')</script>');
            })
        }
        const eTime=new Date().getTime();
        const endMes='生成完毕,共'+idResult.length+'篇,其中成功'+rightNum+'篇,失败<span style=\'color:red\'>'+wrongNum+'</span>篇;共耗时:'+(eTime-bTime)/1000+'秒';
        ctx.body='<script>buildEnd(\"'+endMes+'\")</script>'
    }
}
const checkPath=async (ctx=null,id,path,index,sum)=>{
    const sqlCol='select path1,path2 from columns where id='+id;
    //let beginTime=new Date().getTime();
    const colResult=await mysql.nquery(sqlCol);
    const path1='/'+colResult[0].path1;
    const path2=colResult[0].path2===''?'':'/'+colResult[0].path2;
    const fullPath=path+path1+path2;
    let existPathAll=await util.statPath(fullPath,'isDir',true);
    //console.log('创建目录代码：ID为'+id+' '+existPathAll)
    if(existPathAll!=1||existPathAll!=3){
        //let logMes=existPathAll==1?'id为'+id+'的path is existed,ready to work!':'id为'+id+'的path has created!'
        await util.buildPath((path1+path2).substr(1),path);
    }
    return new Promise(async resolve1=>{
        const buildColumns=async (id,page=null,url=null)=>{
            let value=await col.getContent(id,page,url,'build');
            if(value.myStatus===0){
                let errMes='<span style="color:red">ID为:'+value.id+'的栏目生成失败 原因:'+value.errMes+'</span>'
                if(ctx) ctx.write('<script>change('+util.getPercent(index,sum)+','+index+',\''+errMes+'\',\''+errMes+'\')</script>\n');
                resolve1({success:-1});
            }
            else{
                const buildCols=(num=null)=>{
                    let paths,n,pageHtml;
                    n=num?num:1;
                    pageHtml=value.pageList?"第"+n+"页":"";
                    if(num&&num>1){
                        paths=fullPath+'/index_'+num+'.html';
                    }else{
                        paths=fullPath+'/index.html';
                    }
                    return new Promise((resolve,reject)=>{
                        fs.writeFile(paths,value.html,err=>{
                            if(err){
                                resolve({success:-1,mes:"<span style='color:red'>id为"+id+"的栏目"+pageHtml+"生成不成功!</span>"});
                            }else{
                                resolve({success:1,mes:"id为"+id+"的栏目"+pageHtml+"生成功!"})
                            }
                        })
                    })
                }
                if(value.page&&value.pageList==='true'&&value.sum>0){
                    if(value.page===1&&value.sum/value.num>1){
                        await buildCols().then(value1=>{
                            if(ctx&&value1.success===1) ctx.write('<script>change('+util.getPercent(index,sum)+','+index+',\''+value1.mes+'\')</script>\n');
                            else if(ctx&&value1.success===-1) ctx.write('<script>change('+util.getPercent(index,sum)+','+index+',\''+value1.mes+'\',\''+value1.mes+'\')</script>\n');
                        })
                        buildColumns(id,2);
                    }else{
                        if(value.page*value.num<value.sum&&value.num){
                            await buildCols(value.page).then(value1=>{
                                if(ctx&&value1.success===1) ctx.write('<script>change('+util.getPercent(index,sum)+','+index+',\''+value1.mes+'\')</script>');
                                else if(ctx&&value1.success===-1) ctx.write('<script>change('+util.getPercent(index,sum)+','+index+',\''+value1.mes+'\',\''+value1.mes+'\')</script>\n');
                            })
                            buildColumns(id,value.page+1);
                        }else{
                            await buildCols(value.page).then(value1=>{
                                if(ctx&&value1.success===1) ctx.write('<script>change('+util.getPercent(index,sum)+','+index+',\''+value1.mes+'\')</script>');
                                else if(ctx&&value1.success===-1) ctx.write('<script>change('+util.getPercent(index,sum)+','+index+',\''+value1.mes+'\',\''+value1.mes+'\')</script>\n');
                                resolve1({success:value1.success});
                            })
                        }
                    }
                }else{
                    buildCols().then(value1=>{
                        if(ctx&&value1.success===1) ctx.write('<script>change('+util.getPercent(index,sum)+','+index+',\''+value1.mes+'\')</script>\n');
                        else if(ctx&&value1.success===-1) ctx.write('<script>change('+util.getPercent(index,sum)+','+index+',\''+value1.mes+'\',\''+value1.mes+'\')</script>\n');
                        resolve1({success:value1.success});
                    })
                }
            }
        }
        buildColumns(id)
    })
}

module.exports=buildCol