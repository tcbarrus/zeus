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
					"back": back,
					"seen": false,
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
	document.getElementById("restartButton").addEventListener("click", function() {
		restartFlashcards();
	});
	document.getElementById("yesButton").addEventListener("click", function() {
		markCorrect(true);
	});
	document.getElementById("noButton").addEventListener("click", function() {
		markCorrect(false);
	})
	document.onkeydown = function(event) {
		var key = event.keyCode ? event.keyCode : event.which;

		if (key == 37) // Left
			previousFlashcard();
		else if (key == 39) // Right
			nextFlashcard();
		else if (key == 38 || key == 40) { // Up and down
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

function markCorrect(correct) {
	flashcards[currentCard.index]["correct"] = correct;
	updateView();
}

function restartFlashcards() {
	currentCard.index = 0;
	currentCard.front = defaultToFrontSide;
	for (var i = 0; i < flashcards.length; i++) {
		flashcards[i].seen = false;
		delete flashcards[i].correct;
	}
	updateView();
}

function updateView() {
	flashcards[currentCard.index].seen = true; // Move to flipFlashcard if "seen" means both sides.
	updateFlashcardDisplay();
	updateStatsDisplay();
}

function updateFlashcardDisplay() {
	var card = flashcards[currentCard.index];
	flashcardDiv.innerHTML = currentCard.front ? card["front"] : card["back"];
}

function updateStatsDisplay() {
	var stats = calculateStats();
	document.getElementById("numberSeen").innerHTML = stats.numberSeen;
	document.getElementById("numberTotal").innerHTML = flashcards.length;
	document.getElementById("numberCorrect").innerHTML = stats.numberCorrect;
	document.getElementById("numberTotalGraded").innerHTML = stats.numberTotalGraded;
	var flipped = currentCard.front != defaultToFrontSide;
	document.getElementById("gradingPanel").style.visibility = flipped ? "visible" : "hidden";
}

function calculateStats() {
	var numberCorrect = 0;
	var numberTotalGraded = 0;
	var numberSeen = 0;

	for (var i = 0; i < flashcards.length; i++) {
		if (flashcards[i].correct !== undefined) {
			numberTotalGraded++;
			if (flashcards[i].correct) {
				numberCorrect++;
			}
		}
		if (flashcards[i].seen) {
			numberSeen++;
		}
	}
	return {
		"numberSeen": numberSeen,
		"numberCorrect": numberCorrect,
		"numberTotalGraded": numberTotalGraded,
	};
}

//SETTINGS FUNCTIONS
function checkAll(ID, checktoggle)
{
  var checkboxes = new Array(); 
  var x = document.getElementById(ID);
  checkboxes = x.getElementsByTagName('input');
 
  for (var i=0; i<checkboxes.length; i++)  {
    if (checkboxes[i].type == 'checkbox')   {
      checkboxes[i].checked = checktoggle;
    }
  }
}

function showModal() {
	document.getElementById("settings-block").style.visibility = "visible";
	// document.getElementById("background").className = "blur";
	//add blurring
	document.getElementById("shadow").style.visibility = "visible";
	document.getElementById("content").className = "blur";
	document.getElementById("navBar").className = "blur";	
}

function hideModal() {
	document.getElementById("settings-block").style.visibility = "hidden";
	// document.getElementById("background").className = "";
	checkAll('nutrients', false);
	checkAll('options', false);

	// remove blurring
	document.getElementById("shadow").style.visibility = "hidden";
	document.getElementById("content").className = "";
	document.getElementById("navBar").className = "";
}