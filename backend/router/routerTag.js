const tag = require('../server/tag.js')
module.exports = [
    {
        method: 'post',
        url: '/admin/upTag',
        middleware: tag.upTag
    },
    {
        method: 'get',
        url: '/admin/tagList',
        middleware: tag.tagList
    },
    {
        method: 'get',
        url: '/admin/tagMes',
        middleware: tag.tagMes
    },
    {
        method: 'post',
        url: '/admin/upTagTemp',
        middleware: tag.upTagTemp
    },
    {
        method: 'get',
        url: '/admin/getTagTempList',
        middleware: tag.getTagTempList
    },
    {
        method: 'get',
        url: '/admin/getTagTemp',
        middleware: tag.getTagTemp
    },
    {
        method: 'post',
        url: '/admin/upSqlTag',
        middleware: tag.upSqlTag
    },
    {
        method: 'get',
        url: '/admin/getSqlTag',
        middleware: tag.getSqlTag
    }
]
