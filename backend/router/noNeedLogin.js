const noNeedLogin=require('../server/noNeedLogin.js');
const index=require('../show/indexPage.js').index;
const showColumn=require('../show/showColumn.js').showColumn;
const showArticle=require('../show/showArticle.js').showArticle;
module.exports=[
    {
        method:'get',
        url:'/showHit',
        middleware:noNeedLogin.showHit
    },
    {
        method:'get',
        url:'/addStars',
        middleware:noNeedLogin.addStars
    },
    {
        method:'get',
        url:'/showIndex',
        middleware:index
    },
    {
        method:'get',
        url:'/showColumn',
        middleware:showColumn
    },
    {
        method:'get',
        url:'/showArticle',
        middleware:showArticle
    },
    {
        method:'get',
        url:'/getHostPort',
        middleware:noNeedLogin.getHostPort
    },
    {
        method:'get',
        url:'/getIp',
        middleware:noNeedLogin.getIp
    },
    {
        method:'get',
        url:'/admin/getWebName',
        middleware:noNeedLogin.getWebName
    }
]
