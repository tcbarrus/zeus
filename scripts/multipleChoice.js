// Requires nutrientDataManager.js
var nutrientFilters = [];
var categoryFilters = [];
var questions = [];
var correctImmediately = false;
var timeMyself = true;
var numberCorrect = 0;
var outOf = 0;
var timerText,
seconds = 0, minutes = 0, hours = 0,
t;


window.onload = function() {
	// loadData is defined in nutrientDataManager.js
	showModal();
	preventModalExit();
	loadData(function() {
		generateQuestions();
		initView();
		attachListeners();
	});
}

function generateQuestions() {
	questions = [];
	var categories = ["Function", "Deficiency Symptoms", "Toxicity Symptoms", "Food Sources"];
	for (var key in data) {
		if (nutrientFilters.indexOf(key.replace(" ", "_")) != -1) {
			continue;
		}
		var nutrient = data[key];
		for (var i = 0; i < categories.length; i++) {
			var category = categories[i];
			if (categoryFilters.indexOf(category.replace(" ", "_")) != -1) {
				continue;
			}
			var value = nutrient[category];
			if (value != "" && value.toLowerCase() != "none") {
				questions.push(createQuestion(key, category, value));
			}
		}
	}
	questions = shuffle(questions);
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex ;

	while (0 !== currentIndex) {

	randomIndex = Math.floor(Math.random() * currentIndex);
	currentIndex -= 1;

	temporaryValue = array[currentIndex];
	array[currentIndex] = array[randomIndex];
	array[randomIndex] = temporaryValue;
	}

	return array;
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

function initView() {
	var questionsDiv = document.getElementById("questions");
	var questionsContent = "<ol>";
	for (var i = 0; i < questions.length; i++) {
		var q = questions[i];
		questionsContent += "<li>";
		questionsContent += "<div class=\"prompt\">" + q.question + "</div>";
		for (var j = 0; j < q.answers.length; j++) {
			var a = q.answers[j];
			var radioId = "q" + i + "a" + j;
			questionsContent += "<input id='" + radioId + "'type='radio' name='q-" + i + "' value='a-" + j + "' />";
			questionsContent += "<label for='" + radioId + "'>" + a + "</label><br>";
		}
		questionsContent += "</li>";
	}
	questionsContent += "</ol>";
	questionsDiv.innerHTML = questionsContent;

	// start the timer
	timerText = document.getElementById('time');
	stopTimer();
	seconds = 0, minutes = 0, hours = 0;
	timer();
	document.getElementById("timer").style.display = timeMyself ? "block" : "none";


	// Restart results
	document.getElementById("results").style.display = "none";
	numberCorrect = 0;
	outOf = 0;

	// Set up the listeners for correcting immediately
	if (correctImmediately) {
		document.getElementById("submit-btn").style.display = "none";
		var inputs = document.querySelectorAll("#questions input");
		for (var i = 0; i < inputs.length; i++){
			inputs[i].addEventListener("click", choiceHandler, false);
		}
	}
	else {
		document.getElementById("submit-btn").style.display = "block";
	}
}

function choiceHandler(event) {
	var qId = this.name.split("-")[1];
	if (gradeQuestion(qId)) {
		numberCorrect++;
	}
	outOf++;

	if (outOf == questions.length) {
		stopTimer();
	}

	updateResults();
	disableQuestion(this.name);
}

function disableQuestion(name) {
	var inputs = document.querySelectorAll("#questions input[name='" + name + "']");
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].disabled = true;
		inputs[i].removeEventListener("click", choiceHandler, false);
	}
}

function gradeQuestion(index) {
	var q = questions[index];
	var correctId = "q" + index+ "a" + q.correctAnswer;
	var correctAnswerInput = document.getElementById(correctId);
	var markedAnswerInput = document.querySelector("input[name='q-" + index + "']:checked");
	
	if (correctAnswerInput != markedAnswerInput) {
		if (markedAnswerInput != null) {
			document.querySelector("label[for='" + markedAnswerInput.id + "']").className = "incorrectAnswer";
		}
		else {
			var questionDiv = document.querySelectorAll("#questions li")[index];
			questionDiv.innerHTML += "<p class='incorrectAnswer'>You didn't answer this question.</p>";
		}
	}
	document.querySelector("label[for='" + correctAnswerInput.id + "']").className = "correctAnswer";
	return correctAnswerInput == markedAnswerInput;
}


function gradeQuestions() {
	for (var i = 0; i < questions.length; i++) {
		if (gradeQuestion(i)) {
			numberCorrect++;
		}
		outOf++;
	}
	updateResults();
}

function updateResults() {
	var resultsDiv = document.getElementById("results");
	var percent = +(100 * numberCorrect / outOf).toFixed(2);
	resultsDiv.innerHTML = "<h2>" + percent + "%</h2>" + "You got " + numberCorrect + "/" + outOf +  " questions correct."
	resultsDiv.style.display = "block";
}

function add() {
	seconds++;
	if (seconds >= 60) {
		seconds = 0;
		minutes++;
		if (minutes >= 60) {
			minutes = 0;
			hours++;
		}
	}

	timerText.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
}

function timer() {
	if (timeMyself) {
		t = setInterval(add, 1000);
	}
	else {
		timerText.textContent = "";
	}
}

function stopTimer() {
	clearInterval(t);
}

function attachListeners() {
	document.getElementById("submit-btn").addEventListener("click", function() {
		stopTimer();
		gradeQuestions();
		document.getElementById("submit-btn").style.display = "none";
		window.scrollTo(0, 0);
	});

	document.getElementById("newTestButton").addEventListener("click", function() {
		saveOptions();
		hideModal();
	});
}

function saveOptions() {
	// Update nutrient filter
	nutrientFilters = [];
	var uncheckedNutrientsInputs = document.querySelectorAll("input[name='nutrients']:not(:checked)");
	for (var i = 0; i < uncheckedNutrientsInputs.length; i++) {
		nutrientFilters.push(uncheckedNutrientsInputs[i].value);
	}

	// Update category filter
	categoryFilters = [];
	var uncheckedCategoriesInputs = document.querySelectorAll("input[name='category']:not(:checked)");
	for (var i = 0; i < uncheckedCategoriesInputs.length; i++) {
		categoryFilters.push(uncheckedCategoriesInputs[i].value);
	}
	
	// Update options
	timeMyself = document.querySelector("input[name='option'][value='timeMyself']").checked;
	correctImmediately = document.querySelector("input[name='option'][value='correctImmediately']").checked;

	// Rebuild
	generateQuestions();
	initView();
}

// Cancel changes if they close without pressing save.
function restoreOptions() {
	var nutrientInputs = document.querySelectorAll("input[name='nutrients']");
	for (var i = 0; i < nutrientInputs.length; i++) {
		nutrientInputs[i].checked = (nutrientFilters.indexOf(nutrientInputs[i].value) == -1);
	}

	var categoryInputs = document.querySelectorAll("input[name='category']");
	for (var i = 0; i < categoryInputs.length; i++) {
		categoryInputs[i].checked = (categoryFilters.indexOf(categoryInputs[i].value) == -1);
	}

	document.querySelector("input[value='timeMyself']").checked = timeMyself;
	document.querySelector("input[value='correctImmediately']").checked = correctImmediately;
}

//MULTIPLE CHOICE SETTINGS FUNCTIONS
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
