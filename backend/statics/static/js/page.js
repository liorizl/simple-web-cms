;(function(){
    window.onload = function() {
        const havePage = document.getElementsByClassName('pageType2');
        if (havePage.length > 0){
			const page = havePage[0];
            const selectEle = page.getElementsByClassName('page-select')[0];
            const spanEle = page.getElementsByClassName('pageDown')[0];
            const nowPage = parseInt(spanEle.getAttribute('data-page'));
            const build = parseInt(spanEle.getAttribute('data-build'));
            let search = window.location.search;
            selectEle.value = nowPage
            addEvent('change', selectEle, (e)=> {
                const toPage = e.target.selectedIndex + 1;
                if (build) {
                    let pathName = window.location.pathname;
                    if (/index.*\.html?/.test(pathName)) {
                        pathName = pathName.replace(/(index.*)\.html?/, (match, p1) => {
                            return str = toPage === 1 ? match.replace(p1, 'index') : match.replace(p1, 'index_' + toPage);
                        });
                    } else {
                        if (/\/$/.test(pathName)) {
                            pathName += toPage === 1 ? 'index.html' : 'index_' + toPage + '.html';
                        } else {
                            pathName += toPage === 1 ? '/index.html' : '/index_' + toPage + '.html';
                        }
                    }
                    window.location.pathname = pathName;
                } else {
                    if (/page/.test(search)) {
                        const regexp = new RegExp('(?<=page\\=)(\\d+)$')
                        search = search.replace(regexp, toPage);
                    } else {
                        search += '&page=' + toPage;
                    }
                    window.location.search = search;
                    
                }
            })
        }
        const haveLoadMore = document.getElementsByClassName('pageType3');
        if (haveLoadMore.length > 0){
            const loadMore = haveLoadMore[0];
            let ids = loadMore.getAttribute('data-ids');
            const sum = parseInt(loadMore.getAttribute('data-sum'));
            const build = parseInt(loadMore.getAttribute('data-build'));
            let len = document.getElementsByClassName('item-list')[0].getElementsByTagName('li').length;
            let page = 1;
            if (sum <= len) loadMore.style.display = 'none';
            addEvent('click', loadMore, ()=> {
                loadMore.innerHTML = '加载中....'
                myajax({
                    url: '/loadMore?id=' + ids + '&page=' + page,
                    async: false,
                    success: (arts) => {
                        page += 1
                        const listUl = document.getElementsByClassName('item-list')[0];
                        arts.forEach(art => {
                            let li = document.createElement('li');
                            let picDiv = document.createElement('div');
                            let titleDiv = document.createElement('div');
                            picDiv.className = 'item-list-pic';
                            picDiv.innerHTML = build === 1 ?
                                            '<a href="'+ art.path + '/' + art.articlename + '.html' +'"><img src="'+ art.picurl +'" /></a>':
                                            '<a href="/showArticle?id='+ art.id +'"><img src="'+ art.picurl +'" /></a>';
                            titleDiv.className = 'item-list-title';
                            titleDiv.innerHTML = build === 1 ?
                                            '<a href="'+ art.path + '/' + art.articlename + '.html' +'">'+ art.title +'</a>':
                                            '<a href="/showArticle?id='+ art.id +'">'+ art.title +'</a>';
                            li.appendChild(picDiv).appendChild(titleDiv);
                            listUl.appendChild(li);
                        })
                        len += arts.length;
                        if (len >= sum) {
                            loadMore.style.display = 'none';
                        } else {
                            loadMore.innerHTML = '查看更多'
                        }
                    }
                })
            })
        }
    }
})()