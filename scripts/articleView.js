var articleLocation;

var humanTitles = {
	"FoodInOurLives.pdf": "The Meaning of Food in Our Lives",
	"UnderTheInfluence.pdf": "Under The Influence",
	"QuickStart.pdf": "Quick Start Gluten-Free Diet Guide",
	"Perfection.pdf": "Seeking Perfection Without Being a Perfectionist",
	"Vitamins.pdf": "Vitamins and Supplements: 10 dangers that may surprise you",
	"Medicine.pdf": "National Center for Complementary and Alternative Medicine",
	"Feeding.pdf": "Ellyn Satter's Division of Responsibility in Feeding",
	"BMI.pdf": "Body Mass Index",
	"Diets.pdf": "Evaluate These Diets",
	"Lipids.pdf": "Lipids",
	"Fat.pdf": "Fat Transport",
	"DailyValues.pdf": "Dietary Reference Intakes and Daily Values for Food Labels",
	"Labels.pdf": "What can you learn from these labels?",
	"Protein.pdf": "Protein digestion and absorption"

};


function loadPageData() {

	// load pdf article
	articleLocation = window.location.search.slice(1);
	var humanTitle = humanTitles[articleLocation] || "Article";
	document.getElementById("article-title").textContent = humanTitle;
	document.getElementById("pdf").src = "../pdfs/" + articleLocation;
	
	// load user's notes
	document.getElementById('note-block').value = localStorage.getItem(articleLocation + '-notes') || "";

	document.getElementById("note-view").style.display = "none";
}

function saveNote() {
	var note = document.getElementById('note-block').value;
	localStorage.setItem(articleLocation + '-notes', note);
}

function back() {
	history.back();
}

function toggleNoteView() {
	var elem = document.getElementById("note-view");

	if(elem.style.display == "none") {
		elem.style.display = "block";
	} else {
		elem.style.display = "none";
	}
}