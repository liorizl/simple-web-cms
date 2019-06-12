const basic = require('../server/basic.js')
module.exports = [
    {
        method: 'get',
        url: '/admin/getSysMes',
        middleware: basic.getSysMes
    },
    {
        method: 'get',
        url: '/admin/getHost',
        middleware: basic.getHost
    },
    {
        method: 'get',
        url: '/admin/mysqlVersion',
        middleware: basic.mysqlVersion
    },
    {
        method: 'post',
        url: '/admin/upSetting',
        middleware: basic.upSetting
    },
    {
        method: 'get',
        url: '/admin/getSetting',
        middleware: basic.getSetting
    }
]