
/****************导航栏 tab 的切换功能****************/
/************************************************************************/
/************************************************************************/

$('.siteNav>ol').on('click','li',function(e){

	console.log(e);
	let $li = $(e.currentTarget);
	
	$li.addClass('active').siblings().removeClass('active');
	let index=$li.index('li');
	$('.tabContent>li').eq(index).addClass('active').siblings().removeClass('active');

	if(index === 1){
            renderHotmusicPage();  //如果是第二个页面，则加载热歌榜
	}else if(index===2){
         renderSearchPage();   //搜索榜
	} 


})
/***********************页面1 推荐歌单界面*************************************************/
/************************最新音乐部分的加载功能****************/
/************************************************************************/
/************************************************************************/

//版本2  用leanCloud 来管理数据
var query = new AV.Query('Song');
  query.find().then(function (results) {
  console.log(results);

  if(results.length===0){
       $('#latestMusic').html('无结果');
  }else{
          			$('#latestMusic').empty();
             		for(var i=0;i<results.length;i++){
             		let song=results[i].attributes;
             		console.log(song);

             		let $li = $('<li><a href="/song.html?id='+results[i].id+'"><h3>'+song.name+'</h3>'+
					'<p> <svg class="icon icon-sq" ><use xlink:href="#icon-SQ"></use></svg>'+song.singer+'</p>'+
					'<svg class="icon icon-playlist" > <use xlink:href="#icon-playList"></use></svg></a></li>');
				    $('#latestMusic').append($li);
             	    }
                  }     

  }, function (error) {
  	alert('error')
  });
$('#latestMusicLoading').remove();

// 版本1 用 json 文件来管理数据
/*$(function(){
	$.get('/songs.json').then(
		function(response){
			console.log(response);
			let items = response;
			items.forEach((i)=>{
				console.log(i);
				let $li = $('<li><a href="/song.html?id='+i.id+'"><h3>'+i.name+'</h3>'+
					'<p> <svg class="icon icon-sq" ><use xlink:href="#icon-SQ"></use></svg>演唱者-专辑</p>'+
					'<svg class="icon icon-playlist" > <use xlink:href="#icon-playList"></use></svg></a></li>');
				$('#latestMusic').append($li);
			})
			
		})
	$('#latestMusicLoading').remove();
})*/





/***********************页面3 搜索界面*************************************************************/
/****************搜索框功能：函数节流**************8***************************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/

   function renderSearchPage(){

           //第一次进入页面，加载热门搜索
                   renderHot()
            //搜索框功能，函数节流 以及 组合搜索
                 	 search()

			//输入框的清空功能
    				cleanInput();
   		
			//搜索历史
             renderSearchHistory();
   		  	                             
    }



   /****************加载热门搜索************************/ 
    function renderHot(){
    	 if ($('.page_search').attr('data-downed')!=='yes') {
     console.log('loading searchPage......');

     	//字符串查询
				var query = new AV.Query('Song');
            //	query.contains('name', value);
                query.find().then(function (results) {
                
    		    
                if(results.length===0){
                     
             	  	 $('.page_search .hot_history').removeClass('active').siblings().addClass('active');
          		}else{
          			$('.page_search .hot_history .hot_search>ol ').empty();
             		for(var i=0;i<results.length;i++){
             		let song=results[i].attributes;
             		console.log(song);             	
					//let li='<li data-id="'+ results[i].id+'"> <a href="./song.html?id='+ results[i].id+'"> <svg class="icon icon-search" ><use xlink:href="#icon-search"></use></svg>'+song.name+'-'+song.singer+'</a></li>';
					//let li='<li data-id="'+results[i].id+'"><a href="./song.html?id='+results[i].id+'">'+song.name+'-'+song.singer+'</a></li>'					                       		          					
             		let li='<li><a href="./song.html?id='+results[i].id+'">'+song.name+'</a></li>';
             		$('.page_search .hot_history .hot_search>ol').append(li);
             	    }
                  }     
               }, function (error) {
      	            alert('search error');
                });
             renderSearchHistory();
           $('.page_search').attr('data-downed','yes'); /*加载完毕之后加上属性，下次进入就无需下载，直接显示在页面上即可*/
     }
    }



/****************搜索框功能************************/ 
    function search(){
    	let timer =null;

    $('.page_search input#search').on('input',function(e){
    	let $input = $(e.currentTarget);
    	let value = $input.val().trim();
    	if(value===''){ 
    		 $('.page_search .hot_history').addClass('active').siblings().removeClass('active');
    		return; }
    	
             //搜索函数节流
    $('.page_search .hot_history').removeClass('active').siblings().addClass('active');
             if(timer){ window.clearTimeout(timer);}
      		 timer = setTimeout(function(){

      		 	//字符串查询
				var query1 = new AV.Query('Song');
				var query2 = new AV.Query('Song');
            	query1.contains('name', value);
            	query2.contains('singer',value);
            	var query = AV.Query.or(query1, query2);  //组合查询，歌曲和歌手
                query.find().then(function (results) {
                	console.log(value);
    		    
                if(results.length===0){
                     
             	  	 $('.page_search .search_result>ol ').html('<li>无结果</li>');
          		}else{
          			$('.page_search .search_result>ol ').empty();
             		for(var i=0;i<results.length;i++){
             		let song=results[i].attributes;
             		console.log(song);             	
					let li='<li data-id="'+ results[i].id+'"> <a href="./song.html?id='+ results[i].id+'"> <svg class="icon icon-search" ><use xlink:href="#icon-search"></use></svg>'+song.name+'-'+song.singer+'</a></li>';
					                       		          					
             		$('.page_search .search_result>ol').append(li);
             	    }
                  }     
               }, function (error) {
      	            alert('search error');
                });

           },300);
    })      

    }


/********************输入框的清空功能*******************/
function cleanInput(){
 $('.input_wrap .icon-close').on('click',function(){
   		 	  $('input#search').val('');
   		 	  $('.page_search .hot_history').addClass('active').siblings().removeClass('active');

   			 })
}


///**************加载搜索历史页面*******************************/ 
 function renderSearchHistory(){
 	 var query = new AV.Query('Song');
            	query.contains('searched', 'yes');  //如果已经搜索过
                query.find().then(function (results) {
                
    		    
                if(results.length===0){
                     
             	  	 $('.page_search .search_history>ol').empty();
          		}else{

          			 $('.page_search .search_history>ol').empty();
             		for(var i=0;i<results.length;i++){
             		let song=results[i].attributes;
             		console.log('loading history');             	
					//let li='<li data-id="'+ results[i].id+'"> <a href="./song.html?id='+ results[i].id+'"> <svg class="icon icon-search" ><use xlink:href="#icon-search"></use></svg>'+song.name+'-'+song.singer+'</a></li>';
					//let li='<li data-id="'+results[i].id+'"><a href="./song.html?id='+results[i].id+'">'+song.name+'-'+song.singer+'</a></li>'					                       		          					
             		let li='<li data-id="'+results[i].id+'"> <a href="./song.html?id='+results[i].id+'"><svg class="icon icon_time" ><use xlink:href="#icon-time"></use></svg>'+song.name+'</a><svg class="icon icon_closehistory" >'+
             			'<use xlink:href="#icon-close1"></use></svg></li>';	
             		
             		$('.page_search .search_history>ol').append(li);
         //清除搜索项，注意必须搜索历史全部显示在页面上后，再开始绑定属性，否则无效
             		 closeHistoryItem();
             	    }
                  }     
               }, function (error) {
      	            alert('search error');
             });

     }


    /*****************清除搜索项，用leancloud的修改属性******************************/ 
 			function closeHistoryItem(){

 						 $('.search_history .icon_closehistory').on('click',function(e){

             				let $li =$(e.currentTarget).parent('li');
             				let id=$li.attr('data-id');

   		 	  				//修改搜索状态
   			 				let todo = AV.Object.createWithoutData('Song', id);
  							// 修改属性
 			 				todo.set('searched', 'no');
 				 			// 保存到云端
  				 			todo.save();
  							$li.remove();
  							console.log('清除成功');

   			 })
           }

/***********************页面2 热歌榜*************************************************/

/************************************************************************/
/************************************************************************/

 		function renderHotmusicPage(){

 			if($('.page_hotsong').attr('data-downed')==='yes'){ //如果已经加载过
 				return;
 			}

 			console.log('loading... hotmusic ');
	          //字符串查询
				var query = new AV.Query('Song');
            	//query.contains('label', 'hot');  //根据是否是热歌来加载数据 待完成（数据库还没更新）
                query.find().then(function (results) {
                		
    		    
                if(results.length===0){
                     
             	  		 $('.page_hotsong .hotList>ol ').html('<li>无结果</li>');
          		}else{
          				$('.page_hotsong .hotList>ol').empty();
             			for(var i=0;i<results.length;i++){
             			let song=results[i].attributes;
             			console.log(song);
             			if(i<=2){
             				let li='<li><a href="/song.html?id='+results[i].id +'" class="play"><p class="listnum former">'+pad(i)+'</p> <h3>'+song.name+'</h3><p> <svg class="icon icon-sq" ><use xlink:href="#icon-SQ"></use></svg>'+song.singer+'</p>'+
                    				
							        '<svg class="icon icon-playlist" > <use xlink:href="#icon-playList"></use></svg></a></li>';
							$('.page_hotsong .hotList>ol').append(li);
             			}else {
							 let li='<li><a href="/song.html?id='+results[i].id +'" class="play"><p class="listnum">'+pad(i)+'</p> <h3>'+song.name+'</h3><p> <svg class="icon icon-sq" ><use xlink:href="#icon-SQ"></use></svg>'+song.singer+'</p>'+
                    				
							        '<svg class="icon icon-playlist" > <use xlink:href="#icon-playList"></use></svg></a></li>';
							$('.page_hotsong .hotList>ol').append(li);
             			}
					
             	    	}
                  }     
               }, function (error) {
      	            alert('search error');
                });

                $('.page_hotsong').attr('data-downed','yes');
 		}

  	 function pad(num){
  			  return num>10? num+'':'0'+num;
  			}
