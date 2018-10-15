
$(function(){



//***********************版本1 用json 来存储数据 ,id 是自己设置的 1 2 3 等纯数据
//let id=parseInt(location.search.match(/\bid=([^&]*)/)[1]);

  //版本1 用json 来存储数据
 /* $.get('/songs.json').then(
    function(response){
      let songs=response;
      let song=songs.filter(
          function(s){
               return(s.id===id)
          })
       console.log(song);
      let url = song[0].url;
      let name = song[0].name;
      let lyric = song[0].lyric;

      console.log('111');
      console.log(lyric);
      
      initPlayer.call(undefined,url);
      initText(name,lyric);

    })*/

  //*********版本2 用leanCloud 来存储数据 id 复杂 正则提取

  //正则获取歌曲id
   var id = getParameterByName('id');
   console.log('id:'+id);

  //修改搜索状态
   var todo = AV.Object.createWithoutData('Song', id);
  // 修改属性
   todo.set('searched', 'yes');
  // 保存到云端
   todo.save();

   //leanCloud 根据ID搜索歌曲
  var query = new AV.Query('Song');
  query.get(id).then(function (response) {
    // 成功获得实例
    let song = response.attributes;
    console.log(song);
  

    let url = song.url;
    let name = song.name;
    let lyric = song.lyric;
    let cover = song.cover;
    let backgroundImage = song.background;

    console.log('111');
    console.log(lyric);
    initCover(cover,backgroundImage); //初始化封面
    initPlayer.call(undefined,url);//监听，播放歌曲，音频
    initText(name,lyric);//初始化文本，包括歌词
  

  }, function (error) {
    // 异常处理
  });






 //***************************正则提取函数 网上拷贝的  https://www.cnblogs.com/season-huang/p/3322561.html
 function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results == null ? "": decodeURIComponent(results[1]);
}




/************************初始化播放功能，暂停和播放按钮以及滚动歌词***********************************************************/
  function initPlayer(url){
     let audio = document.createElement('audio');
     audio.src = url;
   
    audio.oncanplay = function(){
      audio.play();
      $('.disc-container').addClass('playing');
    }

    $('.icon-pause').on('click',function(){
      audio.pause();
       $('.disc-container').removeClass('playing');
    })
    $('.icon-play').on('click',function(){
      audio.play();
       $('.disc-container').addClass('playing');
  });



 /*滚动歌词*/
   setInterval(()=>{
     let whichLine;
     let seconds = audio.currentTime;
     let minutes = ~~(seconds/60);
     let left = seconds - minutes*60;
     let time =pad(minutes)+':'+pad(left);

     let $lines = $('.lines>p');
     //遍历查找 播放的歌词
     for(let i=0; i<$lines.length; i++){
      //jquery 加载歌词p 时，它的属性为时间，可用于滚动歌词
       let curTime = $lines.eq(i);
       let nextTime = $lines.eq(i+1);
       console.log(nextTime.length);
       if(nextTime.length!==0 && curTime.attr('data-time')<time && nextTime.attr('data-time')>time){

         whichLine=$lines.eq(i);
         break;
       }
     }
          //滚动歌词
       if(whichLine){
        whichLine.addClass('active').prev().removeClass('active');
        let top =whichLine.offset().top;
        let lineTop = $('.lines').offset().top;
        let delta = top - lineTop - $('.lyric').height()/3;
        $('.lines').css('transform','translateY(' + '-' + delta +'px ' );
       }

     
   },500);

}



/**********************************************/
  function pad(num){
    return num>10? num+'':'0'+num;
  }


/***********************初始化文本，包括歌名和歌词***********************/
  function initText(name,lyric){
   $('.song-description>h1').text(name);
   parseLyric(lyric); //加载歌词

 } 


/***********************获取背景图片 加载在P 上，背景保存在leancloud上***********************/
 function initCover(cover,backgroundImage){
  console.log('coverrr')
  $('.page').css("background" , "transparent url("+backgroundImage+")no-repeat center");
/*
  $('.page::before').css({
       "background": "transparent url("+cover+")no-repeat center",
       "-webkit-filter": "blur(3px) brightness(.8)",
      "background-size": "cover"
  })*/


   $('.disc-container .cover').attr('src',cover);

 }



/***********************获取歌词 加载在P 上，歌词保存在leancloud上***********************/
  function parseLyric(lyric){

    let array = lyric.split('\\n'); //注意是真的回车还是 enter
      let regex = /^\[(.+)\](.*)/;
      array = array.map(
        function(string){
          let matches = string.match(regex)
          if(matches){
            return {
              time: matches[1],
              words: matches[2]
            }
          }
        })
      let $lyric = $('.lyric');
      // console.log(array);
      array.map(function(object){
        let $p=$('<p>')
      /*   console.log('11111111');
        console.log(object);*/
        $p.attr('data-time', object.time)
        $p.text(object.words);
        $p.appendTo($lyric.children('.lines'))

  })
}



/*  $.get('/lyric1.json').then(
    function(object){
      let lyric = object.lrc.lyric;
      let array = lyric.split('\n');
      let regex = /^\[(.+)\](.*)/;
      array = array.map(
        function(string){
          let matches = string.match(regex)
          if(matches){
            return {
              time: matches[1],
              words: matches[2]
            }
          }
        })
      let $lyric = $('.lyric');
      // console.log(array);
      array.map(function(object){
        let $p=$('<p>')
      /*   console.log('11111111');
        console.log(object);*/
       /* $p.attr('data-time', object.time)
         $p.text(object.words);
        $p.appendTo($lyric.children('.lines'))
      })
 })*/
})
    
   

