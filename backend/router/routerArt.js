const article = require('../server/article.js')
module.exports = [
    {
        method: 'get',
        url: '/admin/getArtTemp',
        middleware: article.getArtTemp
    },
    {
        method: 'get',
        url: '/admin/getArtList',
        middleware: article.getArtList
    },
    {
        method: 'get',
        url: '/admin/articleEdit',
        middleware: article.articleEdit
    },
    {
        method: 'get',
        url: '/admin/articleList',
        middleware: article.articleList
    },
    {
        method: 'post',
        url: '/admin/upArtFile',
        middleware: article.upArtFile
    },
    {
        method: 'post',
        url: '/admin/checkArtTitle',
        middleware: article.checkArtTitle
    },
    {
        method: 'get',
        url: '/admin/getArtMes',
        middleware: article.getArtMes
    },
    {
        method: 'post',
        url: '/admin/upArticle',
        middleware: article.upArticle
    },
    {
        method: 'get',
        url: '/admin/getNowArticle',
        middleware: article.getNowArticle
    },
    {
        method: 'get',
        url: '/admin/getSourceUrlList',
        middleware: article.getSourceUrlList
    },
    {
        method: 'post',
        url: '/admin/postSource',
        middleware: article.postSource
    },
    {
        method: 'get',
        url: '/admin/getEditArt',
        middleware: article.getEditArt
    },
    {
        method: 'get',
        url: '/admin/withBuildArt',
        middleware: article.withBuildArt
    },
    {
        method: 'get',
        url: '/admin/upAuthor',
        middleware: article.upAuthor
    },
    {
        method: 'get',
        url: '/admin/getAuthorList',
        middleware: article.getAuthorList
    },
    {
        method: 'post',
        url: '/admin/copyArt',
        middleware: article.copyArt 
    },
    {
        method: 'get',
        url: '/admin/buildFaArt',
        middleware: article.buildFaArt 
    }
]