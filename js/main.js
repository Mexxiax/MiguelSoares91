var likeButtonClicked = false;
var dislikeButtonClicked = false;
var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
db.transaction(function (tx) {
	tx.executeSql('DROP TABLE books');
	tx.executeSql('CREATE TABLE IF NOT EXISTS books (id unique, opinion)');
});

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
	<input type="hidden" class="hiddenFieldId"></input>
	<h1></h1>
	<h3 style="display:inline;"></h3><a class="shop" target="blank"><span class="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span></a>
	<p></p>
	<h4>Editora:<label></label></h4><h5>Publicado em:<label></label></h5>
	<br>
	<br>
	<button data-opinion="dislike" class="btn down dislike pull-left btn-danger" type="button" aria-label="left Align">
	<span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>Não Gosto
	</button>
	<button data-opinion="like" class="btn up like pull-right btn-success" type="button" aria-label="left Align">
	<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>Gosto
	</button>
	</div>
	</div>
	</div>`;


	$("#bookContainer").append(HTMLtoInsert);
	$currentBook = $(".book").eq(-1);
	$("h1",$currentBook).text(book.volumeInfo.title);
	$('.hiddenFieldId',$currentBook).text(book.volumeInfo.title);
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
		likeButtonClicked = false;
		dislikeButtonClicked = false;
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



	$("body").on("click",".book button.like", function(){
		if(!likeButtonClicked){
			likeButtonClicked = true;
			count++;
			$parent = $(".book.active");
			$("#stats label.countlike").text("Gosto: "+count);
			$(".dislike",$(".book.active")).hide();
			$(".like",$(".book.active")).removeClass("pull-right");
			$(".like",$(".book.active")).addClass("liked");
			$id = $('.hiddenFieldId',$parent).text();

		// vamos buscar a opinion ao nosso custom attribute
		$opinion = $(this).attr('data-opinion');

		db.transaction(function (tx) {
			//insert na table que criámos
			tx.executeSql('INSERT INTO books(id, opinion) VALUES("' + $id + '","' + $opinion + '")');
		});
	}
	else{
		likeButtonClicked = false;
		count--;
		$("#stats label.countlike").text("Gosto: "+count);
		$(".dislike",$(".book.active")).show();
		$(".like",$(".book.active")).addClass("pull-right");
		$(".like",$(".book.active")).removeClass("liked");
	}
	
});
	var counte = 0;
	$("#stats label.countdislike").text("Não Gosto: "+counte);








	$("body").on("click",".book button.dislike", function(){
		if(!dislikeButtonClicked){
			dislikeButtonClicked = true;
			counte++;
			$parent = $(".book.active");
			$("#stats label.countdislike").text("Não Gosto: "+counte);
			$(".like",$(".book.active")).hide();
			$(".dislike",$(".book.active")).removeClass("pull-left");
			$(".dislike",$(".book.active")).addClass("disliked");
			$id = $('.hiddenFieldId',$parent).text();

		$opinion = $(this).attr('data-opinion');

		db.transaction(function (tx) {
			tx.executeSql('INSERT INTO books(id, opinion) VALUES("' + $id + '","' + $opinion + '")');
		});
	}
	else{
		dislikeButtonClicked = false;
		counte--;
		$("#stats label.countdislike").text("Não Gosto: "+counte);
		$(".like",$(".book.active")).show();
		$(".dislike",$(".book.active")).addClass("pull-left");
		$(".dislike",$(".book.active")).removeClass("disliked");

	}
});

	$("#moldura button.upagina").click(function(){
	$("#moldura").hide()
	$("#stats").show();
	db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM books', [], function (tx, results) {
				$.each(results.rows,function(index,item){
					if (item.opinion == "like"){
					var html = `<p>`+ item.id +`</p>`;
					$("#stats h3").append(html);
				}
				});
			}, null);
		});
	});















