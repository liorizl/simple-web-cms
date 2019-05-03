-- phpMyAdmin SQL Dump
-- version 4.0.10.11
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2019-05-03 16:43:20
-- 服务器版本: 5.7.20-log
-- PHP 版本: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `lioricms`
--

-- --------------------------------------------------------

--
-- 表的结构 `article`
--

CREATE TABLE IF NOT EXISTS `article` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fid` bigint(40) NOT NULL,
  `title` varchar(50) NOT NULL,
  `mainTitle` varchar(100) NOT NULL,
  `viceTitle` varchar(50) DEFAULT NULL,
  `isIndex` varchar(10) NOT NULL,
  `isUse` varchar(10) NOT NULL,
  `headLine` int(2) DEFAULT '0',
  `suggest` int(2) DEFAULT '0',
  `outUrl` varchar(100) DEFAULT NULL,
  `keywords` varchar(100) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `content` text NOT NULL,
  `intro` text,
  `picUrl` varchar(200) DEFAULT NULL,
  `path` varchar(100) DEFAULT NULL,
  `articleName` varchar(50) DEFAULT NULL,
  `author` varchar(30) DEFAULT NULL,
  `source` varchar(30) DEFAULT NULL,
  `sourceUrl` varchar(100) DEFAULT NULL,
  `useSourceUrl` varchar(10) NOT NULL,
  `tempName` varchar(20) DEFAULT NULL,
  `orderBy` int(11) DEFAULT NULL,
  `hits` int(11) NOT NULL,
  `stars` int(11) NOT NULL,
  `lastEditTime` varchar(50) DEFAULT NULL,
  `upTime` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `articleauthor`
--

CREATE TABLE IF NOT EXISTS `articleauthor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `upTime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `articlesource`
--

CREATE TABLE IF NOT EXISTS `articlesource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `url` varchar(200) DEFAULT NULL,
  `upTime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `articlestars`
--

CREATE TABLE IF NOT EXISTS `articlestars` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `articleId` int(11) NOT NULL,
  `stars` int(11) NOT NULL DEFAULT '0',
  `ip` mediumtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `columns`
--

CREATE TABLE IF NOT EXISTS `columns` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cid` bigint(11) NOT NULL,
  `ultimate` varchar(10) NOT NULL,
  `is_root` varchar(1) DEFAULT NULL,
  `aid` bigint(11) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `alias` varchar(100) DEFAULT NULL,
  `path1` varchar(40) DEFAULT NULL,
  `path2` varchar(20) DEFAULT NULL,
  `colImg` varchar(200) DEFAULT NULL,
  `keyword` varchar(200) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `isUse` varchar(10) DEFAULT NULL,
  `orderBy` int(11) DEFAULT NULL,
  `isNav` varchar(10) DEFAULT NULL,
  `outUrl` varchar(200) DEFAULT NULL,
  `tempMode` int(1) DEFAULT NULL,
  `tempCover` varchar(50) DEFAULT NULL COMMENT '封面式模版',
  `tempList` varchar(50) DEFAULT NULL COMMENT '列表模版式',
  `listTempInClass` varchar(30) DEFAULT NULL,
  `tempContent` text COMMENT '所属内容页模版',
  `contentOrder` varchar(100) NOT NULL,
  `listOrder` varchar(100) NOT NULL,
  `listActive` varchar(1) NOT NULL,
  `contentActive` varchar(1) NOT NULL,
  `hits` int(10) NOT NULL,
  `extendName` varchar(20) NOT NULL,
  `showNum` int(3) NOT NULL,
  `pageNum` int(3) NOT NULL,
  `uptime` varchar(50) NOT NULL,
  `lastEditDate` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `dynatag`
--

CREATE TABLE IF NOT EXISTS `dynatag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(20) NOT NULL,
  `callName` varchar(50) NOT NULL,
  `pattern` varchar(100) NOT NULL,
  `intro` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- 转存表中的数据 `dynatag`
--

INSERT INTO `dynatag` (`id`, `title`, `callName`, `pattern`, `intro`) VALUES
(1, '栏目下文章列表', 'artInCol', '[litag]dynamic.artInCol(id,temp,listnum,titleCutNum,introCutNum)[/litag]', '单栏目下文章列表,栏目不能循环'),
(2, '循环栏目文章', 'artInCols', '[litag]dynamic.artInCols(''self'',10,10,5,10)[/litag]', '可以循环多层'),
(4, 'SQL标签', 'colList', '[litag]sql.colList(param0,param1,param2[,..])[/litag]', '需要有sql基础使用'),
(5, '当前位置标签', 'position', '[litag]dynamic.position(4)[/litag]', '括号内为标签模版ID，省略将使用默认的格式');

-- --------------------------------------------------------

--
-- 表的结构 `loginlist`
--

CREATE TABLE IF NOT EXISTS `loginlist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip` varchar(20) NOT NULL,
  `userName` varchar(20) NOT NULL,
  `address` varchar(50) NOT NULL,
  `date` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- 转存表中的数据 `loginlist`
--

INSERT INTO `loginlist` (`id`, `ip`, `userName`, `address`, `date`) VALUES
(1, '222.210.138.57', 'liori', '四川省成都市', '2019-5-2 11:34:58'),
(2, '222.210.138.57', 'liori', '四川省成都市', '2019-5-2 15:40:33'),
(3, '222.210.138.57', 'liori', '四川省成都市', '2019-5-3 9:18:7'),
(4, '222.210.138.57', 'liori', '四川省成都市', '2019-5-3 15:7:19');

-- --------------------------------------------------------

--
-- 表的结构 `sqltag`
--

CREATE TABLE IF NOT EXISTS `sqltag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(30) NOT NULL,
  `callname` varchar(30) NOT NULL,
  `sqlcontent` varchar(255) NOT NULL,
  `listcontent` text NOT NULL,
  `uptime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `sqltag`
--

INSERT INTO `sqltag` (`id`, `title`, `callname`, `sqlcontent`, `listcontent`, `uptime`) VALUES
(1, '文章列表', 'articlelist', 'select * from article where fid=${param0} limit ${param1}', '<li>\r\n    <a href="[!--arturl--]">[!--title--]</a><br>\r\n    [!--intro--]</a>\r\n</li>', '2018-12-20 17:07:51');

-- --------------------------------------------------------

--
-- 表的结构 `tag`
--

CREATE TABLE IF NOT EXISTS `tag` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `type` int(1) NOT NULL,
  `title` varchar(20) NOT NULL,
  `content` mediumtext NOT NULL,
  `callName` varchar(30) NOT NULL,
  `upTime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

--
-- 转存表中的数据 `tag`
--

INSERT INTO `tag` (`id`, `type`, `title`, `content`, `callName`, `upTime`) VALUES
(5, 1, '底部js', '<script src="/js/float.js"></script>\r\n\r\n', 'footjs', '2019-03-13 15:22:32'),
(10, 1, '网站头部', '<header id="head">\r\n  <div id="head_c">\r\n     <div id="logo"><img src="/dhimgs/logo.jpg"></div>\r\n     <div id="tel"><img src="/dhimgs/tel.jpg"></div>\r\n  </div> \r\n</header>', 'header', '2019-04-16 16:57:31');

-- --------------------------------------------------------

--
-- 表的结构 `tagtemp`
--

CREATE TABLE IF NOT EXISTS `tagtemp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `titleCut` int(10) DEFAULT NULL,
  `introCut` int(10) DEFAULT NULL,
  `tempcontent` text NOT NULL,
  `listcontent` text NOT NULL,
  `datetype` int(2) NOT NULL,
  `upTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=20 ;

--
-- 转存表中的数据 `tagtemp`
--

INSERT INTO `tagtemp` (`id`, `title`, `titleCut`, `introCut`, `tempcontent`, `listcontent`, `datetype`, `upTime`) VALUES
(7, '头部导航', NULL, NULL, '<li class="id0"><a href="/">首页</a></li>\r\n[loop]\r\n<li id="id[!--id--]"><a href="[!--colurl--]">[!--title--]</a></li> \r\n[/loop]', '', 3, '2019-04-15 17:04:55'),
(12, '首页项目', NULL, NULL, '<div id="xm">\r\n    <div id="xm_top">\r\n        <div id="xm_top_tit" class="xm_zt_tit"><a href="[!--colurl--]">项目导航</a></div>\r\n        <div id="xm_top_more" class="xm_zt_more"><a href="[!--colurl--]"></a></div>\r\n    </div>\r\n    <div id="xm_c">\r\n        [loop]\r\n        <div class="{$class}">\r\n            <div class="{$class}">[!--title--]</div>\r\n            [loopn]\r\n            <div class="xm_sc">\r\n                [listtemp]list[/listtemp]\r\n            </div>\r\n            [/loopn]       \r\n        </div>\r\n        [/loop]\r\n    </div>\r\n</div>', '<a href="[!--arturl--]" target="_blank">[!--title--]</a>	  ', 3, '2019-04-16 15:20:17'),
(15, '当前位置', NULL, NULL, '<div class="tnow">当前位置：[listtemp]list[/listtemp]</div>', '<a href=[!--colurl--]>[!--title--]</a>>>', 3, '2019-04-16 17:35:10'),
(16, '图片列表', NULL, NULL, '<ul>\r\n    [listtemp]list[/listtemp]\r\n</ul>\r\n[!--pagelist--]', '<li>\r\n    <div class="li_b">\r\n        <div class="exp_img">\r\n            <a href="[!--arturl--]"><img src="[!--picurl--]"></a>\r\n            <div class="exp_t">[!--title--]</div>\r\n        </div>\r\n        <div class="exp_c">\r\n            <div class="tfont">[!--intro--]</div>\r\n        </div>\r\n    </div>\r\n</li>', 3, '2019-04-16 17:38:39'),
(18, '项目页项目导航', NULL, NULL, '[loop]\r\n<div class="{$class}" id="nav[!--id--]">\r\n    <div class="{$class}">[!--title--]</div>\r\n    <div class="{$class}" id="xm_li_c[!--id--]">\r\n        [loopn]\r\n         <ul>\r\n            [listtemp]list[/listtemp]\r\n        </ul>\r\n        [/loopn]\r\n    </div>\r\n</div>\r\n[/loop]', '<li><a href="[!--arturl--]" id="[!--id--]">[!--title--]</a></li>', 3, '2019-04-19 14:24:33'),
(19, '项目列表页列表内容', NULL, NULL, '<div class="collist-c">\r\n    <div class="collist-t">[!--title--]列表</div>\r\n    [loop]\r\n    <div class="{$class}">\r\n        <div class="{$class}">[!--title--]</div>\r\n        [loopn]\r\n         <ul>\r\n            [listtemp]list[/listtemp]\r\n        </ul>\r\n        [/loopn]\r\n    </div>\r\n    [/loop]\r\n</div>', '<li><a href="[!--arturl--]" id="[!--id--]">[!--title--]</a></li>', 3, '2019-04-23 11:25:16');

-- --------------------------------------------------------

--
-- 表的结构 `template`
--

CREATE TABLE IF NOT EXISTS `template` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(120) NOT NULL,
  `type` int(1) NOT NULL,
  `isUse` varchar(10) NOT NULL,
  `num` int(11) DEFAULT NULL,
  `titleCut` int(4) DEFAULT NULL,
  `introCut` int(14) DEFAULT NULL,
  `dateType` int(11) DEFAULT NULL,
  `content` mediumtext NOT NULL,
  `contentList` text,
  `upTime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=31 ;

--
-- 转存表中的数据 `template`
--

INSERT INTO `template` (`id`, `title`, `type`, `isUse`, `num`, `titleCut`, `introCut`, `dateType`, `content`, `contentList`, `upTime`) VALUES
(13, '首页', 1, 'true', NULL, NULL, NULL, NULL, '<!DOCTYPE html >\r\n<html>\r\n<head>\r\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\r\n<title>成都大华医学美容医院[官网]</title>\r\n<meta name="keywords" content="大华美容，成都大华，大华整形，美容，整形" />\r\n<meta name="description" content="　成都整形,成都美容整形.聚集国内外美容整形专家团队,引进先进美容整形设备,多次荣获医学美容学术奖项." />\r\n<link rel="stylesheet" href="/css/style.css">\r\n<link rel="stylesheet" href="/js/swiper-4.2.6.min.css">\r\n<script type="text/javascript" src="/js/jquery1.10.2.js"></script>\r\n<script type="text/javascript" src="/js/swiper-4.2.6.min.js"></script></head>\r\n\r\n<body>\r\n<div id="ibody">\r\n<script>\r\n/*\r\nif(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)){\r\nwindow.location.href=''http://m.cndahua.cn''\r\n}\r\n*/\r\n</script>\r\n<div id="head">\r\n  <div id="head_c">\r\n     <div id="logo"><img src="/dhimgs/logo.jpg"></div>\r\n     <div id="tel"><img src="/dhimgs/tel.jpg"></div>\r\n  </div> \r\n</div>\r\n<nav id="nav">\r\n    <ul>\r\n        [litag]dynamic.artInCols(0,7,0,0,0,0,0,''isNav="true"'')[/litag]\r\n    </ul>\r\n</nav>\r\n<script>\r\n$("#id0").removeClass().addClass("now");\r\n</script>\r\n<script src="/js/jsfla.js"></script>\r\n<div id="cen1">\r\n   <div id="cen1_l">\r\n        <div id="cen1l_top" class="cen1l_c">\r\n            [litag]dynamic.artInCol(30,8,1,20,0,0,0,0,''orderBy desc,id desc'')[/litag]\r\n        </div>\r\n        <div id="cen1l_btm" class="cen1l_c">\r\n            [litag]dynamic.artInCol(31,9,1,20,0,0,0,0,''orderBy desc,id asc'')[/litag] \r\n        </div>\r\n   </div>\r\n   <div id="cen1_r">\r\n      <div id="sheb_l">\r\n	      <div id="sheb_up" ><a href="javascript:void(0);" class="sb_up"><img src="./dhimgs/sheb_up.jpg" ></a></div>\r\n		  <div id="sheb_ul">\r\n		    <ul>\r\n                [litag]dynamic.artInCol(33,10,8,0,0,0,0,''isUse="true"'',''orderBy desc,id desc'')[/litag]\r\n			</ul>\r\n		  </div>\r\n		  <div id="sheb_down"><a href="javascript:void(0);" class="sb_down"><img src="./dhimgs/sheb_down.jpg"></a></div>\r\n          <div id="testpx"></div>\r\n	  </div>\r\n	  <div id="sheb_r">\r\n	       <div id="sheb_con">\r\n		       <ul>\r\n                    [litag]dynamic.artInCol(33,11,8,0,0,0,0,''isUse="true"'',''orderBy desc,id desc'')[/litag] 		\r\n			   </ul>\r\n		   </div>\r\n	  </div>\r\n   </div>\r\n</div>\r\n\r\n[litag]dynamic.artInCols(1,12,10,0,0,0,0,''isUse="true"'',''orderBy desc'',''[xm_c1,xm_t1,xm_con1],[xm_c2,xm_t2,xm_con2]'')[/litag]\r\n[litag]temp.footer[/litag]\r\n[litag]temp.zixunqq[/litag]\r\n[litag]temp.footjs[/litag]\r\n</body>\r\n</html>\r\n', NULL, '2019-04-15 16:52:33'),
(14, '图片栏目列表', 3, 'true', 3, 0, 0, 1, '<!DOCTYPE html>\r\n<html>\r\n<head>\r\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\r\n<title>[!--title--]- [!--webtitle--]【官网】</title>\r\n<meta name="Keywords" content="[!--keyWords--]">\r\n<meta name="description" content="[!--description--]">\r\n<link rel="stylesheet" href="/css/style.css">\r\n<link rel="stylesheet" href="/static/css/style.css">\r\n<script type="text/javascript" src="/js/jquery1.10.2.js"></script>\r\n</head>\r\n\r\n<body>\r\n<div id="tbody">\r\n[litag]temp.header[/litag]\r\n<nav id="nav">\r\n    <ul>\r\n        [litag]dynamic.artInCols(0,7,0,0,0,0,0,''isNav="true"'')[/litag]\r\n    </ul>\r\n</nav>\r\n<script>\r\n$("#id[!--id--]").removeClass().addClass("now");\r\n</script>\r\n<div id="cen_col_pic">\r\n    [litag]dynamic.position(15)[/litag]\r\n    <div id="exp">\r\n        [litag]dynamic.artInCol(self,16,4,0,0,1,0,0,''orderBy desc,id asc'')[/litag]\r\n    </div>\r\n</div>\r\n[litag]temp.footer[/litag]\r\n[litag]temp.zixunqq[/litag]\r\n[litag]temp.footjs[/litag]\r\n</div>\r\n</body>\r\n</html>\r\n\r\n', '', '2019-04-16 16:39:32'),
(15, '通用内容页', 4, 'true', NULL, NULL, NULL, NULL, '<!DOCTYPE html>\r\n<html>\r\n<head>\r\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\r\n<title>[!--title--]- [!--webtitle--]【官网】</title>\r\n<meta name="Keywords" content="[!--keyWords--]">\r\n<meta name="description" content="[!--artdescription--]">\r\n<link rel="stylesheet" href="/css/style.css">\r\n<script type="text/javascript" src="/js/jquery1.10.2.js"></script>\r\n</head>\r\n\r\n<body>\r\n<div id="tbody">\r\n[litag]temp.header[/litag]\r\n<div id="nav">\r\n    <ul>\r\n        [litag]dynamic.artInCols(0,7,0,0,0,0,0,''isNav="true"'')[/litag]\r\n    </ul>\r\n</div>\r\n<script>\r\n$("#id[!--parentid--]").removeClass().addClass("now");\r\n</script>\r\n\r\n<div id="cen_con" >\r\n<div id="tnow">[litag]dynamic.position(15)[/litag]</div>\r\n<div id="cencon" >\r\n   <div id="cencon_l">\r\n        [litag]dynamic.artInCol(self,14,10,20,0,0,0,0,''orderBy desc,id desc'')[/litag]   \r\n   </div>\r\n   <div id="cenxm_r">\r\n       <div id="cenxm_r_t">[!--title--]</div>\r\n	   <div id="cenxm_r_int">阅读次数：<span class="articleHits" data-id="[!--id--]" data-add="1"></span>&nbsp;&nbsp;&nbsp;\r\n           <span class="addStars" data-id="[!--id--]"><img src="/dhimgs/pd/zan.jpg"> </span>\r\n            <span class="articleStars" data-id="[!--id--]">[!--stars--]</span>\r\n            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[!--author--]\r\n            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[!--source--]</div>\r\n	   <div id="cenxm_r_c">\r\n             [!--content--]\r\n	   </div>\r\n	   \r\n   </div>\r\n   <script src="/static/js/showClick.js"></script>\r\n</div><!--cenxm-->\r\n</div><!--cen_xm-->\r\n[litag]temp.footer[/litag]\r\n[litag]temp.zixunqq[/litag]\r\n[litag]temp.footjs[/litag]\r\n</div>\r\n</body>\r\n</html>\r\n\r\n', NULL, '2019-04-16 16:40:07'),
(16, '项目内容页', 4, 'true', NULL, NULL, NULL, NULL, '<!DOCTYPE html>\r\n<html>\r\n<head>\r\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\r\n<title>[!--title--]- [!--webtitle--]【官网】</title>\r\n<meta name="Keywords" content="[!--keyWords--]">\r\n<meta name="description" content="[!--artdescription--]">\r\n<link rel="stylesheet" href="/css/style.css">\r\n<script type="text/javascript" src="/js/jquery1.10.2.js"></script>\r\n</head>\r\n\r\n<body>\r\n<div id="tbody">\r\n[litag]temp.header[/litag]\r\n<nav id="nav">\r\n    <ul>\r\n        [litag]dynamic.artInCols(0,7,0,0,0,0,0,''isNav="true"'')[/litag]\r\n    </ul>\r\n</nav>\r\n<script>\r\n$("#id1").removeClass().addClass("now");\r\n</script>\r\n<div id="cen_con" >\r\n[litag]dynamic.position(15)[/litag]\r\n<div id="cenxm" >\r\n   <div id="cenxm_l">\r\n        [litag]dynamic.artInCols(1,18,0,0,0,0,0,0,0,''[xm_li,xm_li_t,xm_li_c],[xm_li1,xm_li_c_t,xm_li_c_li]'')[/litag]\r\n   </div>\r\n<script >\r\nvar id=[!--id--]\r\n</script> \r\n<script src="/js/nowNode.js"></script>\r\n   <div id="cenxm_r">\r\n       <div id="cenxm_r_t">[!--title--]</div>\r\n	   <div id="cenxm_r_int">阅读次数：<span class="articleHits" data-id="[!--id--]" data-add="1"></span>&nbsp;&nbsp;&nbsp;\r\n           <span class="addStars" data-id="[!--id--]"><img src="/dhimgs/pd/zan.jpg"> </span>\r\n           <span class="articleStars" data-id="[!--id--]">[!--stars--]</span>\r\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[!--author--]</div>\r\n\r\n	   <div id="cenxm_r_c">\r\n             [!--content--]\r\n	   </div>\r\n   </div>\r\n   <script src="/static/js/showClick.js"></script>\r\n</div><!--cenxm-->\r\n</div><!--cen_xm-->\r\n[litag]temp.footer[/litag]\r\n[litag]temp.zixunqq[/litag]\r\n[litag]temp.footjs[/litag]\r\n</div>\r\n</body>\r\n</html>\r\n\r\n', NULL, '2019-04-18 13:52:45'),
(17, '项目列表页', 3, 'true', 0, 0, 0, 1, '<!DOCTYPE html>\r\n<html>\r\n<head>\r\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\r\n<title>[!--title--]- [!--webtitle--]【官网】</title>\r\n<meta name="Keywords" content="[!--keyWords--]">\r\n<meta name="description" content="[!--intro--]">\r\n<link rel="stylesheet" href="/css/style.css">\r\n<script type="text/javascript" src="/js/jquery1.10.2.js"></script>\r\n</head>\r\n\r\n<body>\r\n<div id="tbody">\r\n[litag]temp.header[/litag]\r\n<nav id="nav">\r\n    <ul>\r\n        [litag]dynamic.artInCols(0,7,0,0,0,0,0,''isNav="true"'')[/litag]\r\n    </ul>\r\n</nav>\r\n<script>\r\n$("#id1").removeClass().addClass("now");\r\n</script>\r\n<div id="cen_con" >\r\n[litag]dynamic.position(15)[/litag]\r\n<div id="cenxm" >\r\n   <div id="cenxm_l">\r\n        [litag]dynamic.artInCols(1,18,0,0,0,0,0,0,0,''[xm_li,xm_li_t,xm_li_c],[xm_li1,xm_li_c_t,xm_li_c_li]'')[/litag]\r\n   </div>\r\n<script >\r\nvar id=[!--id--]\r\n</script> \r\n<script src="/js/nowNode.js"></script>\r\n   <div id="cenxm_r">\r\n        [litag]dynamic.artInCols(1,19,0,0,0,0,0,0,0,''[collist-c1,collist-t1,],[collist-c2,collist-t2,],[collist-c3,collist-t3,]'')[/litag]\r\n        <div id="btm_zx">\r\n	       <a href="http://chat72.live800.com/live800/chatClient/chatbox.jsp?companyID=340998&configID=123337&jid=2249181695" target="_blank"><img src="/dhimgs/pd/neir_zixun.jpg"></a>\r\n        </div>\r\n   </div>\r\n   <script src="http://125.65.109.138:3012/static/js/showClick.js"></script>\r\n</div><!--cenxm-->\r\n</div><!--cen_xm-->\r\n[litag]temp.footer[/litag]\r\n[litag]temp.zixunqq[/litag]\r\n[litag]temp.footjs[/litag]\r\n</div>\r\n</body>\r\n</html>', '', '2019-04-18 13:56:19'),
(18, '文章列表页', 3, 'true', 0, 0, 0, 1, '<!DOCTYPE html>\r\n<html>\r\n<head>\r\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\r\n<title>[!--title--]- [!--webtitle--]</title>\r\n<meta name="Keywords" content="[!--keyWords--]">\r\n<meta name="description" content="[!--description--]">\r\n<link rel="stylesheet" href="/css/style.css">\r\n<script type="text/javascript" src="/js/jquery1.10.2.js"></script>\r\n<link rel="stylesheet" href="/static/css/style.css">\r\n</head>\r\n<body>\r\n<div id="tbody">\r\n[litag]temp.header[/litag]\r\n<nav id="nav">\r\n    <ul>\r\n        [litag]dynamic.artInCols(0,7,0,0,0,0,0,''isNav="true"'')[/litag]\r\n    </ul>\r\n</nav>\r\n<script>\r\n$("#id[!--id--]").removeClass().addClass("now");\r\n</script>\r\n\r\n<div id="cen_col_art">\r\n    [litag]dynamic.position(15)[/litag]\r\n    <div id="hd">\r\n        [litag]dynamic.artInCol(self,17,0,26,0,0,0,0,''id desc'')[/litag]\r\n    </div>\r\n</div>\r\n[litag]temp.footer[/litag]\r\n[litag]temp.zixunqq[/litag]\r\n[litag]temp.footjs[/litag]\r\n</div>\r\n</body>\r\n</html>\r\n\r\n', '', '2019-04-18 14:37:55'),
(30, '测试封面模版', 2, 'true', NULL, NULL, NULL, NULL, '这里什么都没有！', NULL, '2019-05-02 15:17:10');

-- --------------------------------------------------------

--
-- 表的结构 `useradmin`
--

CREATE TABLE IF NOT EXISTS `useradmin` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `userId` varchar(20) NOT NULL,
  `userPsd` varchar(100) NOT NULL,
  `loginTimes` int(10) NOT NULL,
  `lastLogin` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `useradmin`
--

INSERT INTO `useradmin` (`id`, `userId`, `userPsd`, `loginTimes`, `lastLogin`) VALUES
(1, 'liori', '597310bd40549241a1a89314c9b55662', 4, '2019-05-03 07:07:19');

-- --------------------------------------------------------

--
-- 表的结构 `user_session`
--

CREATE TABLE IF NOT EXISTS `user_session` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `sessionId` varchar(100) NOT NULL,
  `expire` bigint(20) NOT NULL,
  `data` varchar(100) NOT NULL,
  `count` int(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `user_session`
--

INSERT INTO `user_session` (`id`, `sessionId`, `expire`, `data`, `count`) VALUES
(1, 'liori', 1556910439016, 'e78b64abe60748e5c0040149fad203f7', 4);

-- --------------------------------------------------------

--
-- 表的结构 `websetting`
--

CREATE TABLE IF NOT EXISTS `websetting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `webName` varchar(100) DEFAULT NULL,
  `webUrl` varchar(100) DEFAULT NULL,
  `keyword` varchar(1000) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `indexPath` varchar(20) NOT NULL,
  `pagePath` varchar(20) NOT NULL,
  `buildCol` int(1) NOT NULL,
  `buildFaCol` int(1) NOT NULL,
  `buildArt` int(1) NOT NULL,
  `buildFaArt` int(1) NOT NULL,
  `extendName` varchar(20) DEFAULT NULL,
  `indexModel` int(10) NOT NULL,
  `pageModel` int(10) NOT NULL,
  `listNum` int(10) NOT NULL,
  `author` varchar(20) DEFAULT NULL,
  `icon` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `websetting`
--

INSERT INTO `websetting` (`id`, `webName`, `webUrl`, `keyword`, `description`, `indexPath`, `pagePath`, `buildCol`, `buildFaCol`, `buildArt`, `buildFaArt`, `extendName`, `indexModel`, `pageModel`, `listNum`, `author`, `icon`) VALUES
(1, '你的网站名称', 'http://localhost:3010/', '关键词1,关键词2', '网站描述', '/', '/', 1, 1, 1, 1, 'index.html', 1, 1, 8, 'liori', NULL);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
