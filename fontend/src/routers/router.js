import Vue from "vue";
import VueRouter from 'vue-router';
import login from "../components/login.vue";
import admin from "../components/admin.vue";
import system from "../components/system/system.vue";
import sysCon from "../components/system/SysCon.vue";
import banner from "../components/system/banner/banner.vue";
import bannerList from "../components/system/banner/BannerList.vue";
import bannerAdd from "../components/system/banner/BannerAdd.vue";
import sysBasic from "../components/system/SysBasic.vue";
import tagField from "../components/system/TagField.vue";
import article from "../components/article/Article.vue";
import articleInfo from "../components/article/ArticleInfo.vue";
import articleList from "../components/article/ArticleList.vue";
import articleAdd from "../components/article/ArticleAdd.vue";
import column from "../components/column/column.vue";
import columnList from "../components/column/ColumnList.vue";
import columnAdd from "../components/column/ColumnAdd.vue";
import temp from "../components/temp/temp.vue";
import tempList from "../components/temp/TempList.vue";
import tempAdd from "../components/temp/TempAdd.vue";
import tag from "../components/tag/tag.vue";
import tagList from "../components/tag/TagList.vue";
import staticTagAdd from "../components/tag/StaticTagAdd.vue";
import dynaTagShow from "../components/tag/DynaTagShow.vue";
import sqlTagAdd from "../components/tag/SqlTagAdd.vue";
import tagTempList from "../components/tag/TagTempList.vue";
import tagTempAdd from "../components/tag/TagTempAdd.vue";
import user from "../components/user/user.vue";
import userLoginList from "../components/user/UserLoginList.vue";
import editPsd from "../components/user/EditPsd.vue";
import buildHtml from "../components/BuildHtml.vue";
import buildTag from "../components/BuildTag.vue"
Vue.use(VueRouter);


const routes = [
    { path: "", redirect: { name: 'login' } },
    { path: "/login", component: login, name: 'login' },
    {
        path: "/admin", component: admin, name: 'admin',
        children: [
            { path: '/admin/', redirect: { name: 'sysCon' } },
            {
                path: '/admin/system/', component: system, name: 'system',
                children: [
                    { path: '/admin/system/', component: sysCon, redirect: { name: 'sysCon' } },
                    { path: '/admin/system/SysCon', component: sysCon, name: 'sysCon' },
                    { path: '/admin/system/SysBasic', component: sysBasic, name: 'sysBasic' },
                    { path: '/admin/system/TagField', component: tagField, name: 'tagField' },
                    { path: '/admin/system/banner', component: banner, redirect: { name: 'bannerList' },
                    children: [
                        { path: '/admin/system/banner/BannerList', component: bannerList, name: 'bannerList' },
                        { path: '/admin/system/banner/BannerAdd', component: bannerAdd, name: 'bannerAdd' }
                    ] }
                ]
            },
            {
                path: '/admin/article', component: article,
                children: [
                    { path: '/admin/article/', component: articleInfo },
                    { path: '/admin/article/ArticleInfo/', component: articleInfo, name: 'articleInfo' },
                    { path: '/admin/article/ArticleList/', component: articleList, name: 'articleList' },
                    { path: '/admin/article/ArticleAdd/:act', component: articleAdd, name: 'articleAdd' }
                ]
            },
            {
                path: '/admin/column', component: column,
                children: [
                    { path: '/admin/column/', component: columnList, redirect: { name: 'columnList' } },
                    { path: '/admin/column/ColumnList/', component: columnList, name: 'columnList' },
                    { path: '/admin/column/ColumnAdd/:act', component: columnAdd, name: 'columnAdd' }
                ]
            },
            {
                path: '/admin/temp', component: temp,
                children: [
                    { path: '/admin/temp/', redirect: { name: 'tempList' } },
                    { path: '/admin/temp/TempList/', component: tempList, name: 'tempList' },
                    { path: '/admin/temp/TempAdd/:act', component: tempAdd, name: 'tempAdd' }
                ]
            },
            {
                path: '/admin/tag', component: tag,
                children: [
                    { path: '/admin/tag/', component: tagList },
                    { path: '/admin/tag/TagList', component: tagList, name: 'tagList' },
                    { path: '/admin/tag/StaticTagAdd/:act', component: staticTagAdd, name: 'staticTagAdd' },
                    { path: '/admin/tag/DynaTagShow', component: dynaTagShow, name: 'dynaTagShow' },
                    { path: '/admin/tag/SqlTagAdd/:act', component: sqlTagAdd, name: 'sqlTagAdd' },
                    { path: '/admin/tag/TagTempList', component: tagTempList, name: 'tagTempList' },
                    { path: '/admin/tag/TagTempAdd/:act', component: tagTempAdd, name: 'tagTempAdd' }
                ]
            },
            {
                path: '/admin/user', component: user,
                children: [
                    { path: '/admin/user/', component: userLoginList, redirect: { name: 'userLoginList' } },
                    { path: '/admin/user/UserLoginList', component: userLoginList, name: 'userLoginList' },
                    { path: '/admin/user/EditPsd', component: editPsd, name: 'editPsd' }
                ]
            },
            { path: '/admin/BuildHtml', component: buildHtml }
        ]
    },
    { path: '/admin/BuildTag', component: buildTag, name: 'buildTag' }
];
const router = new VueRouter({
    linkActiveClass: 'active',
    linkExactActiveClass: 'exact-active',
    routes: routes
});
export default router;
