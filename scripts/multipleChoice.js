// Requires nutrientDataManager.js
var questions = [];
var correctImmediately = true;

window.onload = function() {
	// loadData is defined in nutrientDataManager.js
	loadData(function() {
		generateQuestions();
		updateView();
		attachListeners();
	});
}

function generateQuestions() {
	var categories = ["Function", "Deficiency Symptoms", "Toxicity Symptoms", "Food Sources"];
	for (var key in data) {
		var nutrient = data[key];
		for (var i = 0; i < categories.length; i++) {
			var category = categories[i];
			var value = nutrient[category];
			if (value != "" && value.toLowerCase() != "none") {
				questions.push(createQuestion(key, category, value));
			}
		}
	}
	// TODO shuffle questions because right now they're in order...
}

function createQuestion(nutrient, category, value) {
	var question, answers, correctAnswer;
	if (category == "Food Sources") {
		question = "Which nutrient can be found in the following foods?<br>" + value;
	}
	else {
		question = "Which nutrient has the following " + category.toLowerCase() + "?<br>" + value;
	}

	var answersJSON = createNutrientAnswers(nutrient);

	return {
		"question": question,
		"answers": answersJSON.answers,
		"correctAnswer": answersJSON.correctAnswerIndex,
	}
}

// This function isn't particularly elegant, but it works... 
function createNutrientAnswers(correctNutrient) {
	var answers = [correctNutrient];
	var nutrients = ["Vitamin C", "Thiamin", "Riboflavin", "Niacin", "Folate", "Vitamin B12", "Calcium", "Magnesium", "Sodium", "Potassium", "Iron", "Iodine", "Zinc", "Flouride", "Selenium"];
	// Select three other nutrients at random
	while (answers.length < 4) {
		var i = parseInt(Math.random() * nutrients.length);
		var nutrient = nutrients[i];
		if (answers.indexOf(nutrient) == -1) {
			answers.push(nutrient);
		}
	}
	// Shuffle the correct answer
	var correctAnswerIndex = parseInt(Math.random() * 4);
	if (correctAnswerIndex != 0) {
		var removed = answers.splice(correctAnswerIndex, 1, correctNutrient);
		answers.splice(0, 1, removed[0]);
	}
	return {
		"answers": answers,
		"correctAnswerIndex": correctAnswerIndex
	}
}

function updateView() {
	var questionsDiv = document.getElementById("questions");
	var questionsContent = "<ol>";
	for (var i = 0; i < questions.length; i++) {
		var q = questions[i];
		questionsContent += "<li>";
		questionsContent += q.question + "<br>";
		for (var j = 0; j < q.answers.length; j++) {
			var a = q.answers[j];
			questionsContent += "<input type='radio' name='q-" + i + "' value='a-" + j + "' />" + a + "<br>";
		}
		questionsContent += "</li>";
	}
	questionsContent += "</ol>";
	questionsDiv.innerHTML = questionsContent;
}

function gradeQuestions() {
	var correct = 0;
	for (var i = 0; i < questions.length; i++) {
		var q = questions[i];
		var correctAnswerInput = document.querySelector("input[name='q-" + i + "'][value='a-" + q.correctAnswer + "']");
		var markedAnswerInput = document.querySelector("input[name='q-" + i + "']:checked");
		if (correctAnswerInput == markedAnswerInput) {
			correct++;
		}
		else {
			if (markedAnswerInput != null) {
				markedAnswerInput.className = "incorrectAnswer";
			}
			else {
				var questionDiv = document.querySelectorAll("#questions li")[i];
				questionDiv.innerHTML += "<p class='incorrectAnswer'>You didn't answer this question.</p>";
			}
		}
		correctAnswerInput.className = "correctAnswer";
	}
}

function attachListeners() {
	/*
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
	*/
}

