const mysql = require('../function/mysql.js');
const util=require('../util/util.js');
const serverUtil=require('./serverUtil.js');
const buildCol=require('../function/buildCol.js');
module.exports={
    upColumn:async ctx=>{
        await serverUtil.getForm(ctx.req).then(async value=>{
            const cid=new Date().getTime();
            const aid=parseInt(value.position[0])===0?0:parseInt(value.cid[0]);
            let sql,myStatus,insertId;
            if(ctx.query.id){
                sql='update columns set ultimate="'+serverUtil.getCheckbox(value.ultimate[0])+'",aid='+parseInt(value.aid[0])+',title="'+value.colName[0]+'",alias="'+value.colNamePin[0]+'",' +
                    'path1="'+value.path1[0]+'",path2="'+value.path2[0]+'",colImg="'+value.colImg[0]+'",' +
                    'keyword="'+value.keyword[0]+'",description="'+value.describe[0]+'",isUse="'+serverUtil.getCheckbox(value.isUse[0])+'",' +
                    'orderBy="'+value.orderBy+'",isNav="'+serverUtil.getCheckbox(value.isNav[0])+'",outUrl="'+value.outUrl+'",tempMode="'+value.tempMode[0]+'",' +
                    'tempCover="'+value.coverTemp[0]+'",tempList="'+value.listTemp[0]+'",listTempInClass="'+value.listTempInClass[0]+'",' +
                    'tempContent="'+value.contentTemp[0]+'",listOrder="'+value.listOrder[0]+'",' +
                    'listActive="'+value.listActive[0]+'",contentOrder="'+value.contentOrder[0]+'",contentActive="'+value.contentActive[0]+'",' +
                    'hits='+parseInt(value.hits[0])+',extendName="'+value.extend[0]+'",showNum='+parseInt(value.showNum[0])+',pageNum='+parseInt(value.pageNum[0])+',' +
                    'lastEditDate="'+util.dateFormat(new Date())+'" where id='+parseInt(ctx.query.id);
            }else{
                sql='insert into columns(cid,ultimate,is_root,aid,title,alias,path1,path2,colImg,' +
                    'keyword,description,isUse,orderBy,isNav,outUrl,tempMode,tempCover,' +
                    'tempList,listTempInClass,tempContent,listOrder,listActive,contentOrder,contentActive,' +
                    'hits,extendName,showNum,pageNum,upTime) value("'+cid+'","'+serverUtil.getCheckbox(value.ultimate[0])+'","",' +
                    aid+',"'+value.colName[0]+'","'+value.colNamePin[0]+'","'+value.path1[0]+'","'+value.path2[0]+'","'+value.colImg[0]+'","'+value.keyword[0]+'",' +
                    '"'+value.describe[0]+'","'+serverUtil.getCheckbox(value.isUse[0])+'","'+value.orderBy+'","'+serverUtil.getCheckbox(value.isNav[0])+'","'+value.outUrl+'",' +
                    '"'+value.tempMode[0]+'","'+value.coverTemp[0]+'","'+value.listTemp[0]+'","'+value.listTempInClass[0]+'","'+value.contentTemp[0]+'",' +
                    '"'+value.listOrder[0]+'","'+value.listActive[0]+'","'+value.contentOrder[0]+'","'+value.contentActive[0]+'",' +
                    '"'+value.hits[0]+'","'+value.extend[0]+'","'+value.showNum[0]+'","'+value.pageNum[0]+'","'+util.dateFormat(new Date())+'")';
            }
            let result=await mysql.nquery(sql);
            if(result){
                myStatus=1;
                insertId=result.insertId||null;
            }else{
                myStatus=0
            }
            ctx.body={myStatus:myStatus,name:'buildCol',id:insertId};
        })
    },
    getColList:async ctx=>{
        const sqlCol1='select id,cid,ultimate,title,path1,path2,listTempInClass,tempContent from columns where aid=0 order by id asc';
        const col1=await mysql.nquery(sqlCol1);
        if(col1.length===0){
            ctx.body=[]
        }
        else{
            const result= await serverUtil.getCol(col1);
            ctx.body=result
        }
    },
    editColumn:async ctx=>{
        const id=parseInt(ctx.query.id);
        const sql='select * from columns where id='+id;
        const result=await mysql.nquery(sql);
        const sql2='select cid,path1,path2,listTempInClass,tempContent from columns where cid='+result[0].aid;
        const result2=await mysql.nquery(sql2);
        let body=result[0];
        body['fClass']=result2[0];
        ctx.body=body;
    },
    preCreateCol:async ctx=>{
        await serverUtil.getForm(ctx.req).then(async value=>{
            const cid=new Date().getTime();
            const aid=parseInt(value.position[0])===0?0:parseInt(value.cid[0]);
            const sql='insert into columns(cid,ultimate,is_root,aid,title,alias,path1,path2,colImg,' +
                    'keyword,description,isUse,orderBy,isNav,outUrl,tempMode,tempCover,' +
                    'tempList,listTempInClass,tempContent,listOrder,listActive,contentOrder,contentActive,' +
                    'hits,extendName,showNum,pageNum,upTime) value("'+cid+'","'+serverUtil.getCheckbox(value.ultimate[0])+'","",' +
                    aid+',"'+value.colName[0]+'","'+value.colNamePin[0]+'","'+value.path1[0]+'","'+value.path2[0]+'","'+value.colImg[0]+'","'+value.keyword[0]+'",' +
                    '"'+value.describe[0]+'","'+serverUtil.getCheckbox(value.isUse[0])+'","'+value.orderBy+'","'+serverUtil.getCheckbox(value.isNav[0])+'","'+value.outUrl+'",' +
                    '"'+value.tempMode[0]+'","'+value.coverTemp[0]+'","'+value.listTemp[0]+'","'+value.listTempInClass[0]+'","'+value.contentTemp[0]+'",' +
                    '"'+value.listOrder[0]+'","'+value.listActive[0]+'","'+value.contentOrder[0]+'","'+value.contentActive[0]+'",' +
                    '"'+value.hits[0]+'","'+value.extend[0]+'","'+value.showNum[0]+'","'+value.pageNum[0]+'","'+util.dateFormat(new Date())+'")';
            const result=await mysql.nquery(sql);
            if(result.affectedRows===1){
                ctx.body={myStatus:1,cid:cid,alias:value.colNamePin[0]};
            }else{
                ctx.body={myStatus:0};
            }
        })
    },
    withBuildCol:async ctx=>{
        const colId=parseInt(ctx.query.id);
        await buildCol(ctx,null,colId).then(async value=>{
            const myStatus=value.success;
            const sql='select aid from columns where id='+colId;
            const result=await mysql.nquery(sql);
            const aid=result[0].aid;
            ctx.body={myStatus:myStatus,id:colId,aid:aid}
        })
    },
    checkUltimate:async ctx=>{
        let cid=parseInt(ctx.query.cid);
        let sql='select * from columns where aid='+cid;
        let result=await mysql.nquery(sql);
        if(result.length>0){
            ctx.body=1;
        }else{
            ctx.body=0;
        }
    },
    changeUltimate:async ctx=>{
        const id=parseInt(ctx.query.id);
        const ulti=ctx.query.ulti==='true'?'false':'true';
        const sql='update columns set ultimate="'+ulti+'" where id='+id;
        const result=await mysql.nquery(sql);
        if(result.affectedRows===1){
            ctx.body={myStatus:1};
        }else{
            ctx.body={myStatus:0};
        }
    },
    getCoverTempList:async ctx=>{
        let sql='select title,isUse from template where type=2 and isUse="true" order by id desc';
        let result=await mysql.nquery(sql);
        ctx.body=result;
    },
    getListTempList:async ctx=>{
        let sql='select title,isUse from template where type=3 and isUse="true" order by id desc';
        let result=await mysql.nquery(sql);
        ctx.body=result;
    },
    getContentTempList:async ctx=>{
        let sql='select title,isUse from template where type=4 and isUse="true" order by id desc';
        let result=await mysql.nquery(sql);
        ctx.body=result;
    },
    buildFaCol:async(ctx,next)=>{
        const cid=parseInt(ctx.query.cid)
        const sql='select id,aid from columns where cid='+cid;
        const result=await mysql.nquery(sql);
        const colId=result[0].id;
        const aid=result[0].aid;
        await buildCol(null,null,colId).then(async value=>{
            if(aid===0){
                ctx.body={myStatus:value.success,colId:colId,aid:0}
            }else{
                const sqls='select id,aid from columns where id='+colId;
                const res=await mysql.nquery(sqls);
                if(res.length>0){
                    ctx.body={myStatus:value.success,aid:res[0].aid,colId:colId}
                }else{
                    ctx.body={myStatus:value.success,aid:0,colId:colId} 
                }
            }
        })
    }
}