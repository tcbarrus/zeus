// Requires nutrientDataManager.js
var flashcards = [];
var flashcardDiv;
var currentCard = {"index": 0, "front": true};
var defaultToFrontSide = true;

window.onload = function() {
	flashcardDiv = document.querySelector("#flashcard h3");
	// loadData is defined in nutrientDataManager.js
	loadData(function() {
		generateFlashcards();
		updateView();
	});
	attachListeners();
}

function generateFlashcards() {
	var categories = ["Function", "Deficiency Symptoms", "Toxicity Symptoms", "Food Sources"];
	for (var key in data) {
		var nutrient = data[key];
		for (var i = 0; i < categories.length; i++) {
			var category = categories[i];
			var front = key + " &mdash; " + category;
			var back = nutrient[category];
			if (back != "" && back.toLowerCase() != "none") {
				flashcards.push({
					"front": front,
					"back": back
				});
			}
		}
	}
	// TODO: randomize
}

function attachListeners() {
	document.getElementById("previousButton").addEventListener("click", function() {
		previousFlashcard();
	});
	document.getElementById("nextButton").addEventListener("click", function() {
		nextFlashcard();
	});
	document.getElementById("flipButton").addEventListener("click", function() {
		flipFlashcard();
	});
	document.onkeydown = function(event) {
		var key = event.keyCode ? event.keyCode : event.which;

		if (key == 37)
			previousFlashcard();
		else if (key == 39)
			nextFlashcard();
		else if (key == 38 || key == 40) {
			flipFlashcard();
			// Prevent scrolling:
			event.preventDefault();
			return false;
		}
	}
}

function nextFlashcard() {
	if (currentCard.index + 1 < flashcards.length) {
		currentCard.index++;
		currentCard.front = defaultToFrontSide;
		updateView();
	}
}

function previousFlashcard() {
	if (currentCard.index != 0) {
		currentCard.index--;
		currentCard.front = defaultToFrontSide;
		updateView();
	}
}

function flipFlashcard() {
	currentCard.front = !currentCard.front;
	updateView();
}

function updateView() {
	updateFlashcardDisplay();
	// update stats panel
}

function updateFlashcardDisplay() {
	var card = flashcards[currentCard.index];
	flashcardDiv.innerHTML = currentCard.front ? card["front"] : card["back"];
}