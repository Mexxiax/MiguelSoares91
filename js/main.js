var currsymb = {
	'USD': '$', // US Dollar
    'EUR': '€', // Euro
    'CRC': '₡', // Costa Rican Colón
    'GBP': '£', // British Pound Sterling
    'ILS': '₪', // Israeli New Sheqel
    'INR': '₹', // Indian Rupee
    'JPY': '¥', // Japanese Yen
    'KRW': '₩', // South Korean Won
    'NGN': '₦', // Nigerian Naira
    'PHP': '₱', // Philippine Peso
    'PLN': 'zł', // Polish Zloty
    'PYG': '₲', // Paraguayan Guarani
    'THB': '฿', // Thai Baht
    'UAH': '₴', // Ukrainian Hryvnia
    'VND': '₫', // Vietnamese Dong
};
function LoadDataWithHTML(book){
	var HTMLtoInsert = `
      <div class="book col-sm-10 col-sm-offset-1">
        <img alt="Sem capa disponível">
        <h1></h1>
        <h3 style="display:inline;"></h3><a class="shop" target="blank"><span class="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span></a>
        <p></p>
        <h4>Editora:<label></label></h4><h5>Publicado em:<label></label></h5>
        <br>
        <br>
          <button class="btn down dislike pull-left btn-danger" type="button" aria-label="left Align">
            <span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>Não Gosto
          </button>
          <button class="btn up like pull-right btn-success" type="button" aria-label="left Align">
            <span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>Gosto
          </button>
        </div>
        </div>
      </div>`;


		$("#bookContainer").append(HTMLtoInsert);
		$currentBook = $(".book").eq(-1);
		$("h1",$currentBook).text(book.volumeInfo.title);
		$("h4 label",$currentBook).text(book.volumeInfo.publisher);
		$("h5 label",$currentBook).text(book.volumeInfo.publishedDate);
		$("p",$currentBook).text(book.volumeInfo.description);	
		if (typeof book.volumeInfo.imageLinks !== "undefined"){
			//$("img",$currentBook).attr("alt","Sem capa disponível").css("color","#B22222");
			$("img",$currentBook).attr("src",book.volumeInfo.imageLinks.thumbnail);
		}
		//else{

		//}
		$("a.shop",$currentBook).attr("href",book.saleInfo.buyLink);
		if (book.saleInfo.saleability == "FOR_SALE"){
			$("h3",$currentBook).text(book.saleInfo.listPrice.amount + currsymb[book.saleInfo.listPrice.currencyCode]);
		}
		else{
			$("h3",$currentBook).text("Indisponível").css("color","#B22222");
		}


}

var APIKey ="AIzaSyAe6Pmvy0F37CzEUl6pFW5UbQ9PBPy9A_Q";
var UserID = "109471736623302330343";
var ShelfID = "1001";

$.ajax({
	url:"https://www.googleapis.com/books/v1/users/" + UserID + "/bookshelves/" + ShelfID + "/volumes?key=" + APIKey + "&maxResults=40"
	

}).done(function(data){
	$.each(data.items,function(index,value){
		console.log(value);
		LoadDataWithHTML(value);
	});
	$(".book").eq(0).addClass("active");

});
var inAnimation = false;
$("#moldura button.previous").click(function(){
	$allBooks = $(".book");
	$parent = $(".book.active");
	var index = $allBooks.index($parent);

	if(!inAnimation && index > 0){
		inAnimation = true;
		$previous = $parent.prev(".book");

		if( index >= $allBooks.length-1){
			$previous = $allBooks.eq(0);
		}
		$parent.fadeOut(100,function(){
			$parent.removeClass("active");
			$previous.fadeIn(100,function(){
				$previous.addClass("active");
				inAnimation = false;
			})
		})
	};
});
var inAnimation = false;
$("#moldura button.next").click(function(){
	if(!inAnimation){
		inAnimation = true;
	$allBooks = $(".book");
	$parent = $(".book.active");
	
	
	var index = $allBooks.index($parent);
	$next = $parent.next(".book");

	if( index >= $allBooks.length-1){
		$next = $allBooks.eq(0);
		$("#moldura").hide()
		$("#stats").show();

	}
	$parent.fadeOut(100,function(){
		$parent.removeClass("active");
		$next.fadeIn(100,function(){
			$next.addClass("active");
			inAnimation = false;
		})
	})
};
});

var count = 0;
$("#stats label.countlike").text("Gosto: "+count);
// $(".book button.like").click(function(){
$("body").on("click",".book button.like", function(){
	count++;
	$("#stats label.countlike").text("Gosto: "+count);
	$(".dislike",$(".book.active")).hide();
	$(".like",$(".book.active")).removeClass("pull-right");

});
var counte = 0;
$("#stats label.countdislike").text("Não Gosto: "+counte);
// $(".book button.dislike").click(function(){
$("body").on("click",".book button.dislike", function(){
	counte++;
	$("#stats label.countdislike").text("Não Gosto: "+counte);
	$(".like",$(".book.active")).hide();
	$(".dislike",$(".book.active")).removeClass("pull-left");
});
