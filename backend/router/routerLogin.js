const login = require('../server/login.js')
module.exports = [
    {
        method: 'post',
        url: '/admin/login',
        middleware: login.login
    },
    {
        method: 'post',
        url: '/admin/autoLogin',
        middleware: login.autoLogin
    },
    {
        method: 'post',
        url: '/admin/checkIdentCode',
        middleware: login.checkIdentCode
    },
    {
        method: 'get',
        url: '/admin/getIdent',
        middleware: login.getIdent
    },
    {
        method: 'get',
        url: '/admin/deleSession',
        middleware: login.deleSession
    },
    {
        method: 'get',
        url: '/admin/checkSession',
        middleware: login.checkSession
    }
]