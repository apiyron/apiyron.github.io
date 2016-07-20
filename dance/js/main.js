$(document).ready(function(){

	$('#header').css('-webkit-box-shadow','0px 4px 13px 0px rgba(50, 50, 50, 0.28)');
	$('#header').css('-moz-box-shadow','0px 4px 13px 0px rgba(50, 50, 50, 0.28)');
	$('#header').css('box-shadow','0px 4px 13px 0px rgba(50, 50, 50, 0.28)');





$('#go_to_top').click(function(){
	$('html, body').animate({ scrollTop: 0}, 500);
});


$('#go_to_prep').click(function(){
	$('html, body').animate({ scrollTop: $("#prep").offset().top - 90 }, 500);
});


$('#go_to_contacts').click(function(){
	$('html, body').animate({ scrollTop: $("#contacts").offset().top }, 500);
});








var elWrap = $('#block_7 .slider'),
			el =  elWrap.find('.slider_page .slider_page1'),
			indexImg = 1,
			indexMax = el.length;

		function change () {
			el.css('display', 'none');
			el.filter(':nth-child('+indexImg+')').css('display', 'block');
		}	
			


			
		$('#block_7 #next').click(function() {
			indexImg++;
			if(indexImg > indexMax) {
				indexImg = 1;
			}
			change ();
		});
		$('#block_7 #previous').click(function() {
			indexImg--;
			if(indexImg < 1) {
				indexImg = indexMax;
			}
			change ();
		});	




var elWrap1 = $('#block_8 .slider'),
			el1 =  elWrap1.find('img'),
			indexImg1 = 1,
			indexMax1 = el1.length;
		
		function change1 () {
			el1.css('display', 'none');
			el1.filter(':nth-child('+indexImg1+')').css('display', 'block');
		}	
			
		
		$('#block_8 #next').click(function() {
			indexImg1++;
			if(indexImg1 > indexMax1) {
				indexImg1 = 1;
			}
			change1 ();
		});
		$('#block_8 #previous').click(function() {
			indexImg1--;
			if(indexImg1 < 1) {
				indexImg1 = indexMax1;
			}
			change1 ();
		});	




	var menu_bar_block = '.menu_bar_block';
	var menu_background = '.menu_background';
	var open_menu_button = '#go_to_contacts1';
	var close_menu_button = '.krestik'
	var menu_pading_right = '40%';
	var menu_animation_speed = 300;
	var scroll_to_animation_speed = 500;
	var is_memu_open = false;
	//open_menu();
	//cloce_menu();

function open_menu(){
		if(!is_memu_open)
		{
      		$(menu_bar_block).css('display','flex');
			is_memu_open = true;
		}
	}
	function cloce_menu(){
		if(is_memu_open)
		{
      		$(menu_bar_block).css('display','none');
			is_memu_open = false;
		}
	}

   $(menu_background).click(cloce_menu);
	   $(open_menu_button).click(open_menu);
	   $(close_menu_button).click(cloce_menu);




});