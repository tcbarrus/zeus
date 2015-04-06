var facts = [];
var nutrientFilters = [];
var categoryFilters = [];
var timeMyself = true;

window.onload=function(){
	showModal();
	loadData(function() {
		generateFacts();
		initView();
	});
	attachListeners();
}


function attachListeners() {
	document.getElementById("newGameButton").addEventListener("click", function() {
		saveOptions();
		hideModal();
	});
}

/*
if (nutrientFilters.indexOf(key.replace(" ", "_")) != -1) {
			continue;
		}
		*/
function generateFacts() {
	facts = [];
	var categories = ["Function", "Deficiency Symptoms", "Toxicity Symptoms", "Food Sources"];
	var chosenNutrients = chooseNutrients();
	for (var i = 0; i < chosenNutrients.length; i++) {
		var nutrient = chosenNutrients[i];
		var nutrientInfo = data[nutrient];
		for (var j = 0; j < categories.length; j++) {
			var category = categories[j];
			if (categoryFilters.indexOf(category.replace(" ", "_")) != -1) {
				continue;
			}
			var fact = "<strong>" + category + ":</strong> " + nutrientInfo[category];
			if (fact != "" && fact.toLowerCase() != "none") {
				facts.push({
					"fact": fact,
					"answer": nutrient,
				});
			}
		}
	}
	/*
	if (randomizeOrder) {
		flashcards = shuffle(flashcards);
	}
	*/
}

// Return an array of four nutrients from applicable ones.
function chooseNutrients() {

}

function initView() {
	factsHTML = "";
	for (var i = 0; i < facts.length; i++) {
		var fact = facts[i];
		factsHTML += '<div class="fact" id="fact-' + i + '" draggable="true" ondragstart="drag(event)">' + fact["fact"] +'</div>';
	}

	document.getElementById("facts").innerHTML = factsHTML;
}



function drop(e){
	e.preventDefault();
	var data = e.dataTransfer.getData("text");
	var factDiv = document.getElementById(data);
	e.target.appendChild(factDiv);

	// Check answer
	var index = data.split("-")[1];
	var correctAnswer =facts[index].answer
	var userAnswer = e.target.querySelector("h3").innerHTML;
	if (correctAnswer == userAnswer) {
		factDiv.classList.remove("incorrect");
		factDiv.classList.add("correct");
	}
	else {
		factDiv.classList.remove("correct");
		factDiv.classList.add("incorrect");
	}

}

function drag(e){
	e.dataTransfer.setData("text", e.target.id);
}

function allowDrop(e){
	e.preventDefault();
	if(e.target.classList.contains("fact") || e.target.tagName == "STRONG"){
		e.dataTransfer.dropEffect = "none";
	}
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