// 主js
// 点击左侧导航，右侧出现对应内容
$(function(){
	
	$('.info-left li').click(function(){
		// this-->li DOM
		var title = $(this).text().trim();
		switch(title){
			case '首页':
				$('.list0').show();	
				$('.list1').hide();
				$('.list2').hide();
				$('.list3').hide();
				break;
			case '栏目管理':
					$('.list1').show();	
					$('.list0').hide();
					$('.list2').hide();
					$('.list3').hide();
				
				break;
			case '资讯管理':
					$('.list2').show();	
					$('.list1').hide();
					$('.list0').hide();
					$('.list3').hide();
			
				break;
			case '用户管理':
					$('.list3').show();	
					$('.list1').hide();
					$('.list2').hide();
					$('.list0').hide();
				break;
			default:
				break;
		}
	});
});