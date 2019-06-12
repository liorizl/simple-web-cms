export default {
    repalceStr(str){   //去掉后面的/
        return /.+\/$/.test(str)?str.substr(0,str.length-1):str
    },
    repalceStr2(str){  //后面加上/
        return /.*\/$/.test(str)?str:str+'/'
    },
    dateFormat(time=null){
        time = time || new Date();
        const year = time.getFullYear();
        const month = time.getMonth()+1;
        const day = time.getDate();
        const hour = time.getHours();
        const minute = time.getMinutes();
        const second = time.getSeconds();
        const theDate = year + '-' + month + '-' + day + ' '+ hour + ':' + minute + ':' + second;
        return theDate
    },
    addEvent(){
        if(document){
            document.getElementsByClassName('line')[0].addEventListener('dragstart', function(){
                document.getElementById("appCon").className = "no-selected"
            })
            document.getElementsByClassName('line')[0].addEventListener('drag', function(e){
                document.getElementsByClassName('left')[0].style.width = e.clientX + 'px';
                if(document.getElementsByClassName('leftColList')[0]){
                    document.getElementsByClassName('leftColList')[0].style.width = (e.clientX)*80% + 'px';
                }
                else{
                    if(document.getElementsByClassName('singleCol')[0]) document.getElementsByClassName('singleCol')[0].style.width = (e.clientX)*80% + 'px';
                }
            })
            document.getElementsByClassName('line')[0].addEventListener('dragend',function(e){
                document.getElementsByClassName('left')[0].style.width = e.clientX+'px';
                if(document.getElementsByClassName('leftColList')[0]){
                    document.getElementsByClassName('leftColList')[0].style.width = (e.clientX)*80%+'px';
                }
                else{
                    if(document.getElementsByClassName('singleCol')[0]) document.getElementsByClassName('singleCol')[0].style.width = (e.clientX)*80% + 'px';
                }
                document.getElementById("appCon").className = ""
            })
        }
    }
}