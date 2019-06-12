const temp = require('../server/template.js')
module.exports = [
    {
        method: 'get',
        url: '/admin/tempList',
        middleware: temp.tempList
    },
    {
        method: 'get',
        url: '/admin/getEditTemp',
        middleware: temp.getEditTemp
    },
    {
        method: 'post',
        url: '/admin/upTemp',
        middleware: temp.upTemp
    },
    {
        method: 'get',
        url: '/admin/changeIsUseTemp',
        middleware: temp.changeIsUseTemp
    }
]
