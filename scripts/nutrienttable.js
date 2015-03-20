var data;
var secondsBetweenSave = 5;

window.onload = function() {
	loadFromLocalStorage();
	if (data === null) {
		loadFromFile("../json/emptyData.json");
	}
	buildTable();
	showNutrientFilters();
	addFilterListeners();
}

// We could also have it save when a textarea changes or something
setInterval(function() {
	saveToLocalStorage();
}, secondsBetweenSave * 1000);

// Rebuilds the entire table from data and puts it in the table block div
function buildTable()
{
	var table = "<table id='nutrientTable'>" +
		"<thead>" +
		"<tr>" +
		"	<th></th>" +
		"	<th>Function</th>" +
		"	<th>Deficiency Syptoms</th>" +
		"	<th>Toxicity Symptoms</th>" +
		"	<th>Food Sources</th>" +
		"</tr>" +
		"</thead>" +
		"<tbody>";

	for (var key in data) {
		var cleanName = key.replace(" ", "_");
		var nutrient = data[key];
		table += "<tr>" +
			"<td>" + key + "</td>" +
			"<td><textarea id='" + cleanName + "_Function'>" + nutrient["Function"] + "</textarea></td>" +
			"<td><textarea id='" + cleanName + "_DSymptoms'>" + nutrient["Deficiency Symptoms"] + "</textarea></td>" +
			"<td><textarea id='" + cleanName + "_TSymptoms'>" + nutrient["Toxicity Symptoms"] + "</textarea></td>" +
			"<td><textarea id='" + cleanName + "_Sources'>" + nutrient["Food Sources"] + "</textarea></td>" +
			"</tr>"
		var nutrient = data[key];
	}

	table += "</tbody></table>";
	document.getElementById("tableBlock").innerHTML = table;
}

function loadFromFile(filepath)
{
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			data = JSON.parse(xmlhttp.responseText);
		}
	}

	xmlhttp.open("GET", filepath, true);
	xmlhttp.send();
}

function saveToLocalStorage()
{
	for (var key in data) {
		var cleanName = key.replace(" ", "_");
		var nutrient = data[key];
		nutrient["Function"] = document.getElementById(cleanName + "_Function").value;
		nutrient["Deficiency Symptoms"] = document.getElementById(cleanName + "_DSymptoms").value;
		nutrient["Toxicity Symptoms"] = document.getElementById(cleanName + "_TSymptoms").value;
		nutrient["Food Sources"] = document.getElementById(cleanName + "_Sources").value;
	}
	localStorage.setItem('nutrientTableData', JSON.stringify(data));
}

function loadFromLocalStorage()
{
	data = JSON.parse(localStorage.getItem('nutrientTableData'));
}

function showNutrientFilters()
{
	var checkboxes = "";
	for (var key in data) {
		var cleanName = key.replace(" ", "_");
		checkboxes += "<input type='checkbox' id='" + cleanName + "Checkbox' checked />" + key + "<br>";
	}
	document.querySelector("#nutrientCheckboxes").innerHTML = checkboxes;
}

function addFilterListeners()
{
	var checkboxes = document.querySelectorAll("#filterBlock input");
	for (var i = 0; i < checkboxes.length; i++) {
		checkboxes[i].addEventListener("click", function() {
			applyFilters();
		});
	}
}

function applyFilters()
{
	// Apply category filters
	var categories = ["function", "dSymptoms", "tSymptoms", "sources"];
	for (var i = 0; i < categories.length; i++) {
		var c = categories[i];
		var displayMode = document.getElementById(c + "Checkbox").checked ? "table-cell" : "none";
		
		// column header
		cells = document.querySelector("#nutrientTable th:nth-child(" + parseInt(i + 2) + ")").style.display = displayMode;
		
		// column cells
		var cells = document.querySelectorAll("#nutrientTable td:nth-child(" + parseInt(i + 2) + ")");
		for (var j = 0; j < cells.length; j++) {
			cells[j].style.display = displayMode;
		}
	}

	// Apply nutrient filters.
	var i = 0;
	for (var key in data) {
		var cleanName = key.replace(" ", "_");
		var displayMode = document.getElementById(cleanName + "Checkbox").checked ? "table-cell" : "none";
		var cells = document.querySelectorAll("#nutrientTable tr:nth-child(" + parseInt(i + 1) + ") td");
		for (var j = 0; j < cells.length; j++) {
			// Always update the nutrient label, the others only if the category hasn't already turned it off.
			if (j == 0 || cells[j].style.display != "none") {
				cells[j].style.display = displayMode;
			}
		}
		i++;
	}
}