// Requires nutrientDataManager.js
var questions = [];
var correctImmediately = true;

window.onload = function() {
	// loadData is defined in nutrientDataManager.js
	loadData(function() {
		generateQuestions();
		updateQuestionsView();
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

function updateQuestionsView() {
	var questionsDiv = document.getElementById("questions");
	var questionsContent = "<ol>";
	for (var i = 0; i < questions.length; i++) {
		var q = questions[i];
		questionsContent += "<li>";
		questionsContent += q.question + "<br>";
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
}

function gradeQuestions() {
	var numCorrect = 0;
	for (var i = 0; i < questions.length; i++) {
		var q = questions[i];
		var correctId = "q" + i + "a" + q.correctAnswer;
		var correctAnswerInput = document.getElementById(correctId);
		var markedAnswerInput = document.querySelector("input[name='q-" + i + "']:checked");
		if (correctAnswerInput == markedAnswerInput) {
			numCorrect++;
		}
		else {
			if (markedAnswerInput != null) {
				document.querySelector("label[for='" + markedAnswerInput.id + "']").className = "incorrectAnswer";
			}
			else {
				var questionDiv = document.querySelectorAll("#questions li")[i];
				questionDiv.innerHTML += "<p class='incorrectAnswer'>You didn't answer this question.</p>";
			}
		}
		document.querySelector("label[for='" + correctAnswerInput.id + "']").className = "correctAnswer";
		updateResults(numCorrect);
	}
}

function updateResults(numCorrect) {
	var resultsDiv = document.getElementById("results");
	var percent = +(100 * numCorrect / questions.length).toFixed(2);
	resultsDiv.innerHTML = "You got " + numCorrect + "/" + questions.length + " (" + percent + "%)" +  " questions correct."
	resultsDiv.display = "block";
}

function attachListeners() {
	document.getElementById("submitButton").addEventListener("click", function() {
		gradeQuestions();
		document.getElementById("submitButton").style.display = "none";
		window.scrollTo(0, 0);
	});
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
