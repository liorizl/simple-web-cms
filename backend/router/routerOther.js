const other = require('../server/other.js');
const buildIndex = require('../function/buildIndex.js');
const buildCol = require('../function/buildCol.js');
const buildArt = require('../function/buildArt.js');
module.exports = [
    {
        method: 'post',
        url: '/admin/upfile',
        middleware: other.upfile
    },
    {
        method: 'get',
        url: '/admin/getUpfiles',
        middleware: other.getUpfiles
    },
    {
        method: 'get',
        url: '/admin/dele',
        middleware: other.dele
    },
    {
        method: 'get',
        url: '/admin/getUserList',
        middleware: other.getUserList
    },
    {
        method: 'post',
        url: '/admin/editPsd',
        middleware: other.editPsd
    },
    {
        method: 'get',
        url: '/admin/buildIndex',
        middleware: buildIndex
    },
    {
        method: 'get',
        url: '/admin/buildCol',
        middleware: buildCol
    },
    {
        method: 'get',
        url: '/admin/buildArt',
        middleware: buildArt
    },
    {
        method: 'get',
        url: '/admin/buildJs',
        middleware: other.buildJs
    },
    {
        method: 'post',
        url: '/admin/upBanner',
        middleware: other.upBanner
    },
    {
        method: 'get',
        url: '/admin/getBanner',
        middleware: other.getBanner
    },
    {
        method: 'get',
        url: '/admin/getBannerEdit',
        middleware: other.getBannerEdit
    }
]
