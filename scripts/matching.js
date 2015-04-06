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
}



function generateFacts() {
	facts = [];
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
			var fact = "<strong>" + category + ":</strong> " + nutrient[category];
			if (fact != "" && fact.toLowerCase() != "none") {
				facts.push({
					"fact": fact,
					"answer": key,
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

function initView() {
	factsHTML = "";
	for (var i = 0; i < 5; i++) {
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

	// Correct answer
	var index = data.split("-")[1];
	var correctAnswer =facts[index].answer
	var userAnswer = e.target.querySelector("strong").innerHTML;
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

/*
restoreOptions is currently an exact copy of multipleChoice's.
You'll either have to be consistent with variable names or change accordingly.
*/
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