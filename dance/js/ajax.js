$(document).ready(function(){
$('#page7_form').submit(function(e){
    e.preventDefault();
    $.ajax({
      url: "send",
      type: "POST",
      data: $('#page7_form').serialize(),
      success: function(response) {
      	if(response == "1"){
          document.getElementById("top_page7").innerHTML = "Мы с вами свяжимся в ближайшее время!"
        }
        if(response == "2"){

        	 document.getElementById("error_page7").innerHTML = "Не корректно заполнены поля..."
        }
      }
    });
});



});