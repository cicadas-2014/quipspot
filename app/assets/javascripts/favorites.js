var QuoteFavorites = {

	init: function() {
		// user favorites a quote
		$(".quotes, .show-quote").on("click", "button.unliked-quote", this.addToFavorites.bind(this));
		// user unfavorites a quote
		$(".quotes, .show-quote").on("click", "button.liked-quote", this.removeFromFavorites.bind(this));
	},

	displayLikeQuote: function (selector) {
		$(selector).removeClass("unliked-quote");
		$(selector).addClass("liked-quote");
	},

	displayUnlikeQuote: function(selector) {
		$(selector).removeClass("liked-quote");
		$(selector).addClass("unliked-quote");
	},

	addToFavorites: function(e) {
		e.preventDefault();
		this.displayLikeQuote(e.target);

		var quoteId = $(e.target).parent().parent().attr("id");
		var ajaxRequest = $.ajax({
			url: "/quotes/" + quoteId + "/favorite",
			type: "post"
		});
	},

	removeFromFavorites: function(e) {
		e.preventDefault();
		this.displayUnlikeQuote(e.target);

		var quoteId = $(e.target).parent().parent().attr("id");
		var ajaxRequest = $.ajax({
			url: "/quotes/" + quoteId + "/unfavorite",
			type: "delete"
		});
	}
};

var UserFavorites = {
	init: function() {
		$(".nav-favorites").on("click", this.getFavoriteQuotes.bind(this));
	},

	getFavoriteQuotes: function(e) {

		// if user is on /quotes/:id or /bookclubs, redirect to /quotes/favorites
		// else, user is on / and we can render favorite quotes via ajax
		if ((!window.location.pathname.match(/\/bookclubs/)) && (!window.location.pathname.match(/\/quotes\/\d+/))) {
			e.preventDefault();
			$('.pagination').hide();
			var ajaxRequest = $.ajax({
				url: "/favorites",
				type: "get"
			});

			ajaxRequest.done(this.renderFavorites.bind(this));

		}

	},

	renderFavorites: function(response) {
		$(".quotes").html("");	

		$(".page-info").html("My Favorites");

		this.displayEmptyMessage(response.quotes);
		
		for (var i = 0; i < response.quotes.length; i++) {
			var html = this.getQuoteHtml(response.quotes[i]);
			$(".quotes").append(html);
		}
		makeDraggable();
	},

	displayEmptyMessage: function(quotes) {
		$(".no-search-results, .no-favorites, .no-bookclub-quotes, .no-user-quotes").html("");
		if (quotes.length == 0) {
			$(".page-info").after("<div class='no-favorites'>You currently have no favorited quotes.</div>");
		}
	},

	getQuoteHtml: function(quote) {
		var html = "<div class='quote' id='" + quote.id + "'>" +
			"<div class='content'><img src='/icons/openingquote.png'><p>" + quote.content + "</p><img src='/icons/closingquote.png'></div>" +
				"<div class='quote-info'><a class='search-author' data-method='get'" +
				"href='/search?q%5Bauthor_name_cont%5D=" + encodeURI(quote.author_name) + "' rel='nofollow'>" + quote.author_name + "</a>"
		if (quote.book_title != "") {
			html = html + "<br/>" +
				"<a class='search-title' data-method='get'" +
				"href='/search?q%5Bbook_title_cont%5D=" + encodeURI(quote.book_title) + 
				"' rel='nofollow'>" + quote.book_title + "</a>";
		}			

		html = html + "</div><a class='search-user' data-method='get'" + 
			"href='/search?q%5Buser_goodreads_name_cont%5D="+ encodeURI(quote.user_name) + 
			"' rel='nofollow'>Shared by: " + quote.user_name + "</a>" + 
			"<div class='quote-options'>" + 
			"<button class='share-quote'>Share Quote</button>" + 
			"<button class='liked-quote'></button>" + 
			"<button data-quote-id='" + quote.id + "' class='add-comment'>Add Comment</button></div></div>";

		return html;
	}

};

$(document).ready(function(){
	QuoteFavorites.init();
	UserFavorites.init();
});