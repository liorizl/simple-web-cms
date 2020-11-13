const noNeedLogin = require('../server/noNeedLogin.js');
const index = require('../show/indexPage.js').index;
const showColumn = require('../show/showColumn.js').showColumn;
const showArticle = require('../show/showArticle.js').showArticle;
module.exports = [
    {
        method: 'get',
        url: '/showHit',
        middleware: noNeedLogin.showHit
    },
    {
        method: 'get',
        url: '/addStars',
        middleware: noNeedLogin.addStars
    },
    {
        method: 'get',
        url: '/showIndex',
        middleware: index
    },
    {
        method: 'get',
        url: '/showColumn',
        middleware: showColumn
    },
    {
        method: 'get',
        url: '/showArticle',
        middleware: showArticle
    },
    {
        method: 'get',
        url: '/getHostPort',
        middleware: noNeedLogin.getHostPort
    },
    {
        method: 'get',
        url: '/getIp',
        middleware: noNeedLogin.getIp
    },
    {
        method: 'get',
        url: '/admin/getWebName',
        middleware: noNeedLogin.getWebName
    },
    {
        method: 'post',
        url: '/getArtListClient',
        middleware: noNeedLogin.getArtListClient
    },
    {
        method: 'get',
        url: '/getArtCon',
        middleware: noNeedLogin.getArtCon
    },
    {
        method: 'get',
        url: '/getArtInCol',
        middleware: noNeedLogin.getArtInCol
    },
    {
        method: 'get',
        url: '/getArtMes',
        middleware: noNeedLogin.getArtMes
    },
    {
        method: 'get',
        url: '/equipList',
        middleware: noNeedLogin.equipList
    },
    {
        method: 'get',
        url: '/newsList',
        middleware: noNeedLogin.newsList
    },
    {
        method: 'get',
        url: '/getNavLists',
        middleware: noNeedLogin.getNavLists
    },
    {
        method: 'get',
        url: '/getAdjacentArt',
        middleware: noNeedLogin.getAdjacentArt
    },
    {
        method: 'get',
        url: '/getSearchArt',
        middleware: noNeedLogin.getSearchArt
    },
    {
        method: 'get',
        url: '/getWebSetting',
        middleware: noNeedLogin.getWebSetting
    },
    {
        method: 'get',
        url: '/getColMes',
        middleware: noNeedLogin.getColMes
    },
    {
        method: 'get',
        url: '/getBanner',
        middleware: noNeedLogin.getBanner
    },
    {
        method: 'get',
        url: '/getRecom',
        middleware: noNeedLogin.getRecom
    },
    {
        method: 'get',
        url: '/loadMore',
        middleware: noNeedLogin.loadMore
    },
    {
        method: 'get',
        url: '/getSearchArtX',
        middleware: noNeedLogin.getSearchArtX
    },
    {
        method: 'get',
        url: '/valiArtInCol',
        middleware: noNeedLogin.valiArtInCol
    }
]
