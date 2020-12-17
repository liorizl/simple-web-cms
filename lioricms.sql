-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2020-12-17 13:48:44
-- 服务器版本： 5.7.20-log
-- PHP 版本： 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `dhteach-pc`
--

-- --------------------------------------------------------

--
-- 表的结构 `article`
--

CREATE TABLE `article` (
  `id` int(11) NOT NULL,
  `fid` bigint(40) NOT NULL,
  `title` varchar(50) NOT NULL,
  `mainTitle` varchar(100) NOT NULL,
  `viceTitle` varchar(50) DEFAULT NULL,
  `isIndex` varchar(10) NOT NULL,
  `isUse` varchar(10) NOT NULL,
  `headLine` int(2) DEFAULT '0',
  `suggest` int(2) DEFAULT '0',
  `outUrl` varchar(100) DEFAULT NULL,
  `keyword` varchar(100) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `content` text NOT NULL,
  `intro` text,
  `picUrl` varchar(200) DEFAULT NULL,
  `picUrl2` varchar(200) DEFAULT NULL,
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
  `upTime` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `articleauthor`
--

CREATE TABLE `articleauthor` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `upTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `articlesource`
--

CREATE TABLE `articlesource` (
  `id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `url` varchar(200) DEFAULT NULL,
  `upTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `articlestars`
--

CREATE TABLE `articlestars` (
  `id` int(11) NOT NULL,
  `articleId` int(11) NOT NULL,
  `stars` int(11) NOT NULL DEFAULT '0',
  `ip` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `banner`
--

CREATE TABLE `banner` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `pcurl` varchar(200) NOT NULL,
  `wapurl` varchar(200) NOT NULL,
  `pclink` varchar(100) NOT NULL,
  `waplink` varchar(100) NOT NULL,
  `isuse` char(6) NOT NULL,
  `orderby` int(11) NOT NULL,
  `uptime` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `columns`
--

CREATE TABLE `columns` (
  `id` int(11) NOT NULL,
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
  `suggest` int(2) NOT NULL DEFAULT '0',
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
  `lastEditDate` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `dynatag`
--

CREATE TABLE `dynatag` (
  `id` int(11) NOT NULL,
  `title` varchar(20) NOT NULL,
  `callName` varchar(50) NOT NULL,
  `pattern` varchar(100) NOT NULL,
  `intro` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `loginlist`
--

CREATE TABLE `loginlist` (
  `id` int(11) NOT NULL,
  `ip` varchar(20) NOT NULL,
  `userName` varchar(20) NOT NULL,
  `address` varchar(50) NOT NULL,
  `date` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `sqltag`
--

CREATE TABLE `sqltag` (
  `id` int(11) NOT NULL,
  `title` varchar(30) NOT NULL,
  `callname` varchar(30) NOT NULL,
  `sqlcontent` varchar(255) NOT NULL,
  `listcontent` text NOT NULL,
  `uptime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `tag`
--

CREATE TABLE `tag` (
  `id` int(3) NOT NULL,
  `type` int(1) NOT NULL,
  `title` varchar(20) NOT NULL,
  `content` mediumtext NOT NULL,
  `callName` varchar(30) NOT NULL,
  `upTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `tagtemp`
--

CREATE TABLE `tagtemp` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `titleCut` int(10) DEFAULT NULL,
  `introCut` int(10) DEFAULT NULL,
  `tempcontent` text NOT NULL,
  `listcontent` text NOT NULL,
  `datetype` int(2) NOT NULL,
  `upTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `template`
--

CREATE TABLE `template` (
  `id` int(11) NOT NULL,
  `title` varchar(120) NOT NULL,
  `type` int(1) NOT NULL,
  `isUse` varchar(10) NOT NULL,
  `num` int(11) DEFAULT NULL,
  `titleCut` int(4) DEFAULT NULL,
  `introCut` int(14) DEFAULT NULL,
  `dateType` int(11) DEFAULT NULL,
  `sqlCondi` char(100) NOT NULL DEFAULT '0',
  `sqlOrder` char(100) NOT NULL DEFAULT '0',
  `pagination` int(10) NOT NULL DEFAULT '0',
  `content` mediumtext NOT NULL,
  `contentList` text,
  `upTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `useradmin`
--

CREATE TABLE `useradmin` (
  `id` int(10) NOT NULL,
  `userId` varchar(20) NOT NULL,
  `userPsd` varchar(100) NOT NULL,
  `loginTimes` int(10) NOT NULL,
  `lastLogin` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `useradmin`
--

INSERT INTO `useradmin` (`id`, `userId`, `userPsd`, `loginTimes`, `lastLogin`) VALUES
(1, 'liori', 'ad0fd44f79e0da552cd26e77287b0cda', 113, '2020-12-17 04:59:05');

-- --------------------------------------------------------

--
-- 表的结构 `user_session`
--

CREATE TABLE `user_session` (
  `id` int(10) NOT NULL,
  `sessionId` varchar(100) NOT NULL,
  `expire` bigint(20) NOT NULL,
  `data` varchar(100) NOT NULL,
  `loginip` char(30) NOT NULL,
  `count` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `websetting`
--

CREATE TABLE `websetting` (
  `id` int(11) NOT NULL,
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
  `icon` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转储表的索引
--

--
-- 表的索引 `article`
--
ALTER TABLE `article`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `articleauthor`
--
ALTER TABLE `articleauthor`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `articlesource`
--
ALTER TABLE `articlesource`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `articlestars`
--
ALTER TABLE `articlestars`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `columns`
--
ALTER TABLE `columns`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `dynatag`
--
ALTER TABLE `dynatag`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `loginlist`
--
ALTER TABLE `loginlist`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `sqltag`
--
ALTER TABLE `sqltag`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `tagtemp`
--
ALTER TABLE `tagtemp`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `template`
--
ALTER TABLE `template`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `useradmin`
--
ALTER TABLE `useradmin`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `user_session`
--
ALTER TABLE `user_session`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `websetting`
--
ALTER TABLE `websetting`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `article`
--
ALTER TABLE `article`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `articleauthor`
--
ALTER TABLE `articleauthor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `articlesource`
--
ALTER TABLE `articlesource`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `articlestars`
--
ALTER TABLE `articlestars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `banner`
--
ALTER TABLE `banner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `columns`
--
ALTER TABLE `columns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `dynatag`
--
ALTER TABLE `dynatag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `loginlist`
--
ALTER TABLE `loginlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `sqltag`
--
ALTER TABLE `sqltag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `tag`
--
ALTER TABLE `tag`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `tagtemp`
--
ALTER TABLE `tagtemp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `template`
--
ALTER TABLE `template`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `useradmin`
--
ALTER TABLE `useradmin`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用表AUTO_INCREMENT `user_session`
--
ALTER TABLE `user_session`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `websetting`
--
ALTER TABLE `websetting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
