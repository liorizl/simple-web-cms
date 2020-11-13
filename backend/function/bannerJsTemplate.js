module.exports = (hostName, port) => {
    return `;(function(){
    const banner = document.getElementById('bannerSwiper') //bannerSwiper为ul标签的id
    if (banner) {
        myajax({
            url: 'http://${hostName}:${port}/getBanner',
            success: (res) => {
                if (Array.isArray(res)) {
                    let liStr = ''
                    res.forEach(ban => {
                        if (ban.wapurl) {
                            let linkStr = ban.waplink ? 
                                        '<a href="'+ ban.waplink +'"><img src="/' + ban.wapurl +'"></a>' :
                                        '<img src="/' + ban.wapurl +'">'
                            liStr += '<li class="swiper-slide">' + linkStr + '</li>'
                        }
                    })
                    banner.innerHTML = liStr
                    new Swiper('.bannerSwiper', {
                        autoplay: true,
                        pagination: {
                            el: '.swiper-pagination',
                        },
                    })
                }
            }
        })
    }
})()`
}