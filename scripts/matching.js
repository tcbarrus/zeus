var nutrientFilters = [];
var categoryFilters = [];
var timeMyself = true;
var correctImmediately = true;

window.onload=function(){
	loadData(function() {

	});
}

function drop(e){
	e.preventDefault();
    var data = e.dataTransfer.getData("text");
    e.target.appendChild(document.getElementById(data));
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
	document.querySelector("input[value='correctImmediately']").checked = correctImmediately;
}