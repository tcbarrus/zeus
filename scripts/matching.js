var facts = [];
var chosenNutrients = [];
var nutrientFilters = [];
var categoryFilters = [];
var timeMyself = true;

var timerText,
seconds = 0, minutes = 0, hours = 0,
t;

window.onload=function(){
	
	loadData(function() {
		generateFacts();
		if (chosenNutrients.length != 4 || facts.length == 0) {
			showNoInfoModal();
			preventModalExit();
		}
		else {
			showModal();
			preventModalExit();
			attachListeners();
		}
	});
}

function attachListeners() {
	document.getElementById("newGameButton").addEventListener("click", function() {
		saveOptions();
		hideModal();
	});
}

function generateFacts() {
	facts = [];
	var categories = ["Function", "Deficiency Symptoms", "Toxicity Symptoms", "Food Sources"];
	chosenNutrients = chooseNutrients();
	for (var i = 0; i < chosenNutrients.length; i++) {
		var nutrient = chosenNutrients[i];
		var nutrientInfo = data[nutrient];
		for (var j = 0; j < categories.length; j++) {
			var category = categories[j];
			if (categoryFilters.indexOf(category.replace(" ", "_")) != -1) {
				continue;
			}
			var fact = nutrientInfo[category];
			if (fact != "" && fact.toLowerCase() != "none") {
				facts.push({
					"fact":  "<strong>" + category + ":</strong> " + fact,
					"answer": nutrient,
				});
			}
		}
	}
	
	facts = shuffle(facts);
}

// Return an array of four nutrients from applicable ones.
function chooseNutrients() {
	// Return empty array if they have filtered out too many nutrients.
	var allNutrients = shuffle(Object.keys(data));
	if (allNutrients.length - nutrientFilters.length < 4) {
		return [];
	}

	var chosenNutrients = [];
	for (var i = 0; i < allNutrients.length; i++) {
		if (nutrientFilters.indexOf(allNutrients[i].replace(" ", "_")) != -1) {
			continue;
		}
		chosenNutrients.push(allNutrients[i]);
		if (chosenNutrients.length == 4) 
			break;

	}
	return chosenNutrients
}

function initView() {
	document.getElementById("nutrient1").innerHTML = "";
	document.getElementById("nutrient2").innerHTML = "";
	document.getElementById("nutrient3").innerHTML = "";
	document.getElementById("nutrient4").innerHTML = "";
	factsHTML = "";
	if (chosenNutrients.length != 4 || facts.length == 0) {
		showNoInfoModal();
	}
	else {

		for (var i = 0; i < chosenNutrients.length; i++) {
			document.getElementById("nutrient" + (i + 1)).innerHTML = "<h3>" + chosenNutrients[i] + "</h3>";
		}
		for (var i = 0; i < facts.length; i++) {
			var fact = facts[i];
			factsHTML += '<div class="fact" id="fact-' + i + '" draggable="true" ondragstart="drag(event)"><p>' + fact["fact"] +'</p><div class="marker"></div></div>';	
		}
	}

	document.getElementById("facts").innerHTML = factsHTML;

	// start the timer
	timerText = document.getElementById('time');
	stopTimer();
	seconds = 0, minutes = 0, hours = 0;
	timer();
	document.getElementById("timer").style.display = timeMyself ? "block" : "none";
	
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


function drop(e){
	e.preventDefault();
	var data = e.dataTransfer.getData("text");
	var factDiv = document.getElementById(data);
	var target = e.target;

	// Correct the target when they release over a child of main div
	while (!target.classList.contains("nutrient_target")) {
		target = target.parentElement;
	}
	target.appendChild(factDiv);

	// Check answer
	var index = data.split("-")[1];
	var correctAnswer =facts[index].answer
	var userAnswer = target.querySelector("h3").innerHTML;
	if (correctAnswer == userAnswer) {
		factDiv.classList.remove("incorrect");
		factDiv.classList.add("correct");
	}
	else {
		factDiv.classList.remove("correct");
		factDiv.classList.add("incorrect");
	}

	var numberCorrect = document.querySelectorAll(".correct");
	if(numberCorrect.length == facts.length) {
		stopTimer();
	}
}

function drag(e){
	e.dataTransfer.setData("text", e.target.id);
}

function allowDrop(e){
	e.preventDefault();
}


// Cancel changes if they close modal without pressing save.
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

	// Rebuild
	generateFacts();
	initView();
}
