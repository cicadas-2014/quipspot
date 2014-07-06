

var Quote = {
	// make quote draggable and droppable to add to bookclub
	addToBookclub: function(quoteId,bookclubId) {
		var ajaxRequest = $.ajax({
			url: '/bookclubs/' + bookclubId + '/quotes/' + quoteId,
			type: "post"
		});



		ajaxRequest.done(function(response){
			console.log(response);
			if (response.quote_added == false) {
				this.mouseDropClass="mouse-drop-false";
			}
			else {
				this.mouseDropClass="mouse-drop";
			}
		});

		ajaxRequest.fail(function(response){
			console.log(response);
		})
	},

	mouseDropClass: "mouse-drop-false",

	offOfBookclub: function(event,ui) {
		ui.draggable.mouseup(function(){
			var top = ui.draggable.data('orgTop');
			var left = ui.draggable.data('orgLeft');
			ui.position = { top: top, left: left };
			console.log(ui.position);
		});
	}

};

$(document).ready(function(){
	//quote is a draggable object that reverts back to original position
	
	$("div.quote").draggable({
		revert: function(dropped){
			var dropped = dropped && dropped[0].id == "droppable";
           return !dropped;
		},
		start: function(e, ui) { $(this).css('z-index', 1);
															ui.helper.animate({
																width: 80,
																height: 50,
																marginLeft: (400-80)/2 - (400/2 - e.offsetX),
																marginTop: (82-50)/2 - (82/2 - e.offsetY)
															});

														 $(this).find('button, form').hide(); 
														},
														 // $(this).css('width', '20%')},
		stop:  function(e) { $(this).css('z-index', 0); 
												 $(this).find('button, form').show(); 
												 $(this).css('width','400px'); 
												 $(this).css('marginLeft','0');
												 $(this).css('marginTop','0.5em');},
		revertDuration: 150
	}).each(function() {
		var top = $(this).position().top;
		var left = $(this).position().left;
		var quoteId = $(this).attr("id")
		$(this).data('orgTop', top);
		$(this).data('orgLeft', left);

	});

	//quote can be dropped on bookclub li and will be added to bookclub quotes
	$("li").droppable({
		hoverClass: "mouse-hover",
		drop:function(event,ui) {
			var quoteId = $(ui.draggable).attr("id");
			var bookclubId = $(this).attr("id");
			Quote.addToBookclub(quoteId,bookclubId);
			$(this).addClass(Quote.mouseDropClass);
			$(this).removeClass(Quote.mouseDropClass, 600);
	},
		over:Quote.almostToBookclub,
		out:Quote.offOfBookclub
	
	});

})
