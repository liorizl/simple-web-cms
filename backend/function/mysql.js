const mysql=require("mysql");
const config=require("../config/config.json");
const pool=mysql.createPool(config.mysql);
const nquery=function(sql){
    return new Promise(
        (resolve,reject )=>{
            pool.getConnection((err,conn)=>{
               if(err){
                   console.log('err')
                   reject(err)
               }
               else{
                   conn.query(sql,(error,result)=>{
                       if(error){
                           reject({
                               sqlMessage:error.sqlMessage,
                               sqlState:error.sqlState,
                               sqlErrno:error.errno,
                               sqlStr:error.sql
                           })
                        }
                       else{
                           let sqlData=JSON.stringify(result);
                           sqlData=JSON.parse(sqlData)
                           resolve(sqlData)
                       }
                       conn.release()
                   })
               }
            })
        }
    )
}
const multquery=function(sql,values){
    return new Promise(
        (resolve,reject )=>{
            pool.getConnection((err,conn)=>{
               if(err){
                   console.log('err')
                   reject(err)
               }
               else{
                   conn.query(sql,values,(error,result)=>{
                       if(error){
                           reject({
                               sqlMessage:error.sqlMessage,
                               sqlState:error.sqlState,
                               sqlErrno:error.errno,
                               sqlStr:error.sql
                           })
                        }
                       else{
                           let sqlData=JSON.stringify(result);
                           sqlData=JSON.parse(sqlData)
                           resolve(sqlData)
                       }
                       conn.release()
                   })
               }
            })
        }
    )
}
exports.multquery=multquery;
exports.nquery=nquery
