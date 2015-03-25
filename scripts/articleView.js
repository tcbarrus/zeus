var humanTitles = {
	"FoodInOurLives.pdf": "The Meaning of Food in Our Lives: A Cross Cultural Perspective",

};

function loadPageData() {

	// load pdf article
	var articleLocation = window.location.search.slice(1);
	var humanTitle = humanTitles[articleLocation] || "Article";
	document.getElementById("article-title").textContent = humanTitle;

	articleLocation = "../pdfs/" + articleLocation;
	document.getElementById("pdf").src = articleLocation;
	
	// load user's notes
}
