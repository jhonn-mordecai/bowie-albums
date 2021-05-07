$(document).ready(function() {
		  
	//LOAD JSON
	loadAlbums();
	
	$("div#headings").hide().fadeIn(1000);
	$("div#main").hide().fadeIn(1000);
	$("footer").hide().fadeIn(1000);
	
	//ATTACH LISTENER FOR CATEGORY SELECT
	$('div.category').on('click', function() {
	  categorySelect(this);
	});
	
	//ATTACH LISTENER FOR SUBMIT ALBUM SEARCH
	$("form#album_submit").on('submit', function(){
	  recommendAlbum();
	  return false;
	});
	
	//ATTACH LISTENER FOR RESET SEARCH & CLEAR ALBUM BOX  
	$("div#album_area").on("click", "a#reset", function(){  //Listens for element that will be loaded
	  resetAlbums();
	});
	
});
	    
	  	
//LOAD ALBUM LIST DATA FROM JSON
var albums = null;  // SETS albums AS A GLOBAL VARIABLE  (THEN IT CAN BE SET WHERE NEEDED, SEE LINE 80)
function loadAlbums() {
	$.ajax({
		url: 'bowie_albums.json',
		dataType: 'json',
		contentType: 'application/json',
		method: 'get',
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
		},
	
		success: function(data, textStatus, jqXHR) {
			albums = data.bowie_albums;
			//console.log(albums);
		}
	});	   		  			 
}

	  	
//USER SELECTS CATEGORIES
function categorySelect(div) {	
	$("p.error").css("display", "none");
	
	var maxCat = $("div.selected");
	 	
	if ($(div).hasClass("selected")) {
		$(div).removeClass("selected");
	} else if (maxCat.length === 3) {
		return false;		  	
	} else {
		$(div).addClass("selected");
	}	
}
	  		
	  	
//RECOMMEND NEW ALBUM BASED ON SELECTED CATEGORIES
function recommendAlbum(){
	// Validate three categories
	
	var selCat = $("div.selected");
	
	var noCat = $("li div:not(.selected)");
	
	if (selCat.length < 3) {
		$("p.error").css("display", "block");
		return false;
	} 
	
	var catNames = [];
	
	$.each(selCat, function(k,v){
  		catNames.push(v.id);
	});
							  	
	// Loop through the data	
	var albumPoints = [];
	//Loops through the entire object
	$.each(albums, function(k,v){	
		var numerator = 0;
		var denominator = 0;
		//Loops through each object in array
		$.each(v.album_points, function(x,y){
	  		denominator += y;
	  		if ($.inArray(x, catNames) != -1) {
		  		numerator += y;
		  	}
		});
		albumPoints[k] = numerator/denominator*100;
	});
		
	maxValue = Math.max.apply(this, albumPoints);
	matchKey = ($.inArray(maxValue,albumPoints));
	
	var matching_album = albums[matchKey];
	
	// var newAlbum = $("<div id='album_box'><p class='listen'>Listen to...</p><img src="+matching_album.cover+" /><h2>"+matching_album.album+"</h2><p class='blurb'>"+matching_album.blurb+"</p><p><a class='btn btn-default btn-spotify' href='"+matching_album.spot_link+"' target='_blank'><i class='fa fa-spotify' aria-hidden='true'></i>&nbsp; Listen</a></p><p><a id='reset' class='reset btn btn-default form-buttons' href='#' title='reset'>DO IT AGAIN</a></p></div>");
	
	let newAlbum = `
		<div id="album_box">
			<p class="listen">Listen to...</p>
			<img src="${matching_album.cover}" />
			<h2>${matching_album.album}</h2>
			<p class="blurb">${matching_album.blurb}</p>
			<p><a class="btn btn-default btn-spotify" href="${matching_album.spot_link}" target="_blank"><i class="fa fa-spotify" aria-hidden="true"></i>&nbsp; Listen</a></p>
			<p><a id="reset" class="reset btn btn-default form-buttons" href="#" title="reset">DO IT AGAIN</a></p>
		</div>
	`;
	
	$("div#album_area").empty().prepend(newAlbum).hide().fadeIn(2000); 
}
	  	
	  	
//RESETS ALL SELECTIONS AND ALBUM RECOMMENDATION
function resetAlbums() {
	$("div.category").removeClass("selected");

	$("div#album_box").empty().fadeOut(800, function(){
		$(this).remove();
	});
}