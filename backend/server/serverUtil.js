const mysql = require('../function/mysql.js');
const multiparty = require('multiparty');
const config = require("../config/config.json");
const util = require('../util/util.js');
module.exports = {
    getCol: (arr) => {
        let x = 0, y = 0;
        return new Promise(resolve => {
            const getList = async (arr, list = null, infor = null, begin = null) => {
                let tarr = list || arr;
                for (let [index, value] of tarr.entries()) {
                    if (infor) {
                        x++;
                    }
                    if (begin && index === 0) {
                        y += tarr.length;
                    }
                    const sql = 'select id, cid, ultimate, title, path1, path2, listTempInClass, tempContent from columns where aid = "' + value.cid + '" order by id asc';
                    let col = await mysql.nquery(sql);
                    if (col.length === 0) {
                        tarr[index]["haveChild"] = 0;
                        if (x === y) {
                            resolve(arr)
                        }
                    } else {
                        tarr[index]["haveChild"] = col;
                        await getList(arr, col, true, true);
                    }
                }
            };
            getList(arr, null, true, true)
        }
        )
    },
    getColPath: async (cid, terminal = null) => {
        const configPath = config.staticWebPath + config.staticWebName
        const path = configPath + '/upfiles';
        let pathEnd, pathCol;
        if (cid !== 'banner') {
            const picFamily = '/column';
            const sql = 'select path1, path2 from columns where cid = ' + cid;
            const result = await mysql.nquery(sql);
            pathCol = result[0].path2 ?
                picFamily + "/" + result[0].path1 + "/" + result[0].path2 :
                picFamily + "/" + result[0].path1;
            pathEnd = path + pathCol;
        } else {
            pathCol = '/banner/' + terminal;
            pathEnd = path + pathCol;
        }
        
        return { pathEnd: pathEnd, path: path, pathCol: pathCol }
    },
    getAllCols: async (cid) => {
        return new Promise((resolve, reject) => {
            let colArr = [], x = 0, y = 0;
            const getCols = async (cid, i = null, j = null) => {
                if (i) {
                    x++;
                }
                if (j) {
                    y += j;
                }
                const sql = 'select id, cid from columns where aid = ' + cid;
                const result = await mysql.nquery(sql)
                if (result.length > 0) {
                    colArr = colArr.concat(result);
                    for (let [k, col] of result.entries()) {
                        if (k === 0) {
                            await getCols(col.cid, true, result.length)
                        } else {
                            await getCols(col.cid, true)
                        }
                    }
                }
                if (x === y) {
                    resolve(colArr)
                }
            }
            getCols(cid)
        })
    },
    doDele: async (table, id) => {
        return new Promise(async resolve => {
            const sql = 'delete from ' + table + ' where id = ' + id;
            const result = await mysql.nquery(sql);
            if (table === 'columns') util.changeRedisCols(id, 'dele')
            if (result.affectedRows === 1) {
                resolve({ myStatus: 1, table: table })
            }
            else {
                resolve({ myStatus: 0, table: table })
            }
        })
    },
    getForm: async (req) => {
        const form = new multiparty.Form();
        return new Promise((resolve, reject) => {
            form.parse(req, (err, fields) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(fields)
                }
            })
        })
    },
    getCheckbox: (string) => {
        return string === 'on' ? 'true' : 'false'
    },
}