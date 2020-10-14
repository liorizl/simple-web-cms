const mysql = require('../function/mysql.js');
const ip = require("ip");
const config = require("../config/config.json");
const util = require('../util/util.js');
module.exports = {
    showHit: async ctx => {
        const id = parseInt(ctx.query.id);
        if (!id) return
        const add = parseInt(ctx.query.add);
        const sql = 'select hits from article where id = ' + id;
        let result = await mysql.nquery(sql);
        if (result.length > 0) {
            if (add === 1) {
                let hits = parseInt(result[0].hits) + 1;
                let sqlEdit = 'update article set hits = ' + hits + ' where id = ' + id;
                await mysql.nquery(sqlEdit);
                ctx.body = { hits: hits };
            } else {
                ctx.body = { hits: result[0].hits };
            }
        } else {
            ctx.body = 'returnHit={hits:"文章ID不正确！"}'
        }
    },
    addStars: async ctx => {
        let tip = ip.address();
        const id = parseInt(ctx.query.id);
        const sqlStar = 'select * from articlestars where articleId =' + id;
        const sqlArt = 'select stars from article where id = ' + id;
        const resultArt = await mysql.nquery(sqlArt);
        const resultStar = await mysql.nquery(sqlStar);
        let stars = resultArt[0].stars;
        let sqlEditStar,
            sqlEditArt = 'update article set stars = ' + (stars + 1) + ' where id = ' + id;
        if (resultStar.length === 0) {
            sqlEditStar = 'insert into articlestars(articleId, stars, ip) value(' + id + ', ' + (stars + 1) + ', "' + tip + '")';
            await mysql.nquery(sqlEditStar);
            await mysql.nquery(sqlEditArt);
            ctx.body = { myStatus: 1, stars: stars + 1 };
        } else {
            let ipInData = resultStar[0].ip;
            if (ipInData.indexOf(tip) === -1) {
                let newIpStr = ipInData + ',' + tip;
                sqlEditStar = 'update articlestars set stars = ' + (stars + 1) + ', ip = "' + newIpStr + '" where articleId = ' + id;
                await mysql.nquery(sqlEditStar);
                await mysql.nquery(sqlEditArt);
                ctx.body = { myStatus: 1, stars: stars + 1 };
            } else {
                ctx.body = { myStatus: 2 }
            }
        }
    },
    getHostPort: ctx => {
        ctx.body = {
            hostName: config.hostName,
            port: config.port
        }
    },
    getIp: ctx => {
        ctx.body = 'var returnIp = \"' + ip.address() + '\"'
    },
    getWebName: async ctx => {
        const sql = 'select webName from websetting where id = 1';
        const result = await mysql.nquery(sql);
        ctx.body = result[0]
    },
    getArtListClient: async ctx => {
        const { id, page = 1, count } = ctx.request.body;
        let artArr = await getArtArr();
        let start = page > 1 ? (page - 1) * count : 0,
            end = (page * count) - 1,
            arts = [],
            len = artArr.length;
        if (id !== 1) {
            let num = 0, newArts = [];
            for (let art of artArr) {
                if (art.ids.indexOf(id) > -1) {
                    newArts.push(art)
                    num++;
                }
            }
            len = num;
            artArr = newArts
        }
        for (let i = start; i < len; i++) {
            if (artArr[i].ids.indexOf(id) >= 0) {
                arts = arts.concat(artArr[i]);
                start++;
            }
            if (start > end) break;
        }
        ctx.body = { arts, len }
    },
    getArtCon: async ctx => {
        const id = parseInt(ctx.query.id);
        const sql = 'select id, fid, title, keywords, description, picUrl, isIndex, path, isUse, upTime, hits, stars, articleName, content, intro from article where id=' + id;
        const artCon = await mysql.nquery(sql);
        ctx.body = artCon;
    },
    getArtInCol: async ctx => {
        const alias = ctx.query.alias;
        const page = parseInt(ctx.query.page);
        const count = parseInt(ctx.query.count);
        const sqlCid = 'select cid from columns where alias="' + alias + '"';
        const resCid = await mysql.nquery(sqlCid);
        const cid = resCid[0].cid
        const limit = page === 1 ? ' limit ' + count : ' limit ' + count * (page - 1) + ',' + count;
        const sql = 'select id, title, intro, picUrl, upTime from article where fid=' + cid + ' and isUse = "true" order by orderBy, id desc ' + limit;
        const artList = await mysql.nquery(sql);
        const sqlCount = 'select count(*) from article where fid=' + cid + ' and isUse = "true"';
        const resCount = await mysql.nquery(sqlCount);
        ctx.body = {
            artList,
            resCount: resCount[0]['count(*)']
        };
    },
    getArtMes: async ctx => {
        const id = parseInt(ctx.query.id);
        const sql = 'select * from article where id=' + id;
        const result = await mysql.nquery(sql);
        ctx.body = result[0];
    },
    equipList: async ctx => {
        const cid = parseInt(ctx.query.cid);
        const sql = 'select id,title,intro,picUrl,path from article where fid=' + cid + ' and isUse="true"  order by id desc limit 5';
        const result = await mysql.nquery(sql);
        ctx.body = result
    },
    newsList: async ctx => {
        const cid = parseInt(ctx.query.cid);
        const sql = 'select id,title,intro,picUrl,hits,upTime,path from article where fid=' + cid + ' and isUse="true"  order by id desc limit 8';
        const result = await mysql.nquery(sql);
        ctx.body = result
    },
    getNavLists: async ctx => {
        const sqlCol1 = 'select id, cid, ultimate, title, alias, isNav from columns where aid = 0 and isUse="true" order by id asc';
        const col1 = await mysql.nquery(sqlCol1);
        if (col1.length === 0) {
            ctx.body = []
        }
        else {
            await getColClient([col1[0]]);
            ctx.body = col1
        }
    },
    getAdjacentArt: async ctx => {
        const {id, cid} = ctx.query;
        const sqlPre =  'select id, title from article where id >' + parseInt(id) + ' and fid = ' + parseInt(cid) + ' and isUse="true" order by id asc limit 1';
        const sqlNext = 'select id, title from article where id <' + parseInt(id) + ' and fid = ' + parseInt(cid) + ' and isUse="true" order by id desc limit 1';
        const arts = await Promise.all([mysql.nquery(sqlPre), mysql.nquery(sqlNext)])
        ctx.body = {
            preArt: arts[0][0],
            nextArt: arts[1][0]
        }
    },
    getSearchArt: async ctx => {
        const {keyword, scope} = ctx.query;
        const start = parseInt(ctx.query.start);
        const count = parseInt(ctx.query.count);
        let sql, sqlCount;
        switch (scope) {
            case 'content': 
                sql = 'select id,fid,title,content,path from article where content like "%' + keyword + '%" order by id desc limit '+start+',' + count;
                sqlCount = 'select count(*) from article where content like "%' + keyword + '%"';
                break;
            case 'column': 
                sql = 'select id,alias,path1,title from columns where title like "%' + keyword + '%" order by id desc limit '+start+',' + count;
                sqlCount = 'select count(*) from columns where title like "%' + keyword + '%"';
                break;
            default:
                sql = 'select id,fid,title,content,path from article where title like "%' + keyword + '%" order by id desc limit '+start+',' + count;
                sqlCount = 'select count(*) from article where title like "%' + keyword + '%"';
                break;
        }
        let res = await mysql.nquery(sql);
        let resCount = null;
        if (start === 0) {
            const countRes = await mysql.nquery(sqlCount);
            resCount = countRes[0]['count(*)'];
        }
        ctx.body = {
            res,
            resCount
        };
    },
    getWebSetting: async ctx => {
        const sql = 'select webName,keyword,description from websetting';
        const res = await mysql.nquery(sql);
        ctx.body = res[0];
    },
    getColMes : async ctx => {
        const {alias} = ctx.query
        const sql = 'select title,keyword,description from columns where alias = "' + alias + '"';
        const res = await mysql.nquery(sql);
        ctx.body = res[0];
    },
    getBanner: async ctx => {
        const sql = 'select * from banner order by id desc';
        const result = await mysql.nquery(sql);
        ctx.body = result;
    },
    getRecom: async ctx => {
        const scope = ctx.query.scope
        const sql = 'select id,title,picurl,path from article where suggest=1 order by orderBy, id desc';
        const res = await mysql.nquery(sql);
        let resEnd = [];
        if (scope === 'xm') {
            resEnd = res.filter((re) => {
                return /xm/.test(re.path);
            })
        } else {
            resEnd = res.filter((re) => {
                return !/xm/.test(re.path);
            })
        }
        ctx.body = resEnd;
    },
    loadMore: async ctx => {
        const id = ctx.query.id;
        const page = parseInt(ctx.query.page);
        let ids = id.split(',');
        if (ids.length === 1) {
            ids = parseInt(ids[0]);
        } else {
            ids = ids.map(id => {
                return parseInt(id);
            })
        }
        await util.ultracolsInCols(ids, 'isuse="true"', true).then(async cols => {
            const where = Array.isArray(cols) ? 'fid in ('+ cols + ')' : 'fid='+ cols;
            const sql ='select id,title,picurl,path,articlename from article where '+ where +' limit '+ (page * 8) +',8';
            const res = await mysql.nquery(sql);
            ctx.body = res;
        })
        
    }
}
const getColClient = async (arr) => {
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
                const sql = 'select id, cid, ultimate, title, alias, isNav from columns where aid = "' + value.cid + '" and isUse="true" order by id asc';
                let col = await mysql.nquery(sql);
                if (col.length === 0) {
                    tarr[index]["haveChild"] = 0;
                    tarr[index].arts = await getArts(value.cid);
                    if (x === y) {
                        resolve(arr);
                    }
                } else {
                    tarr[index]["haveChild"] = col;
                    await getList(arr, col, true, true);
                }
            }
        };
        const getArts = async cid => {
            return new Promise((resolve, reject) => {
                const sql = 'select id, title, isIndex, picUrl, picUrl2 from article where fid=' + cid + ' and isUse="true" order by id asc';
                mysql.nquery(sql).then(artArr => {
                    resolve(artArr);
                }).catch(err => {
                    reject(err)
                })
            })
        }
        getList(arr, null, true, true);
    })
}
const getArtArr = async () => {
    let artArr = [];
    let id = [1];
    const ultimateItem = async (arrId, cid) => {
        let sql = 'select id,title,picUrl from article where fid = ' + cid + ' and isUse="true" order by id desc ';
        let result = await mysql.nquery(sql);
        result.forEach(re => {
            re.ids = arrId;
            artArr.push(re);
        })

    }
    const notUltimateItem = async (tid, cid) => {
        let sql = 'select id,cid,ultimate from columns where aid = ' + cid + ' and isUse="true" order by id desc';
        let items = await mysql.nquery(sql);
        for (let item of items) {
            let ids = [].concat(tid);
            if (item.ultimate === 'true') {
                ids.push(item.id)
                await ultimateItem(ids, item.cid)
            }
            else {
                ids.push(item.id)
                await notUltimateItem(ids, item.cid)
            }
        }
    }
    await notUltimateItem(id, 1553589402012);
    return artArr
}