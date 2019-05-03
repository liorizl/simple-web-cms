module.exports=(hostName,port)=>{
    return `(function(){
        let hitId=[],hitIdNew=[],starId=[]
        $(".articleHits").each((ele)=>{
            hitId[ele]=$(".articleHits").eq(ele).data()
        });
        const checkHave=(array,id)=>{
            let num=-1
            array.forEach((arr,i)=>{
                if(id===arr[1].id){
                    return num=i
                }else{
                    num+=0
                }
            })
            return num
        }
        hitId.forEach((id,index)=>{
            if(index>0){
                let num=checkHave(hitIdNew,id.id)
                if(num>-1){
                    hitIdNew[num].push(index)
                }else{
                    hitIdNew.push([index,id])
                }
            }else{
                hitIdNew.push([index,id])
            }
        })
        hitIdNew.forEach(ids=>{
            ids.forEach((id,i,ids)=>{
                if(typeof id!=='number'){
                    $.ajax({
                        async:'false',
                        method:'get',
                        // dataType: "jsonp",
                        // jsonpCallback:"returnHit",
                        url:'http://${hostName}:${port}/showHit?id='+id.id+'&add='+id.add,
                        success:function(res){
                            ids.forEach(tid=>{
                                if(typeof tid==='number'){
                                    document.getElementsByClassName("articleHits")[tid].innerHTML=res.hits;
                                }
                            })
                        }
                    })
                }
            })
        })
        $(".addStars").click(function(){
            const id=$(this).data().id
            $(".articleStars").each((ele)=>{
                starId[ele]=$(".articleStars").eq(ele).data()
            });
            $.ajax({
                method:'get',
                url:'http://${hostName}:${port}/addStars?id='+id,
                // dataType: "jsonp",
                // jsonpCallback:"returnStar",
                success:function(res){
                    if(res.myStatus===1){
                        alert("谢谢您的支持!");
                        starId.forEach((sid,index)=>{
                            if(sid.id===id){
                                $(".articleStars").eq(index).html(res.stars)
                            }
                        })
                    }
                    else if(res.myStatus===2){
                        alert("你已经点过赞了!")
                    }
                }
            })
        })    
    })()`
}
