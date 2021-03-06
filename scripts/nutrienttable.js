// Requires nutrientDataManager.js

var secondsBetweenSave = 5;

window.onload = function() {
	// loadData is defined in nutrientDataManager.js
	loadData(function() {
		buildTable();
		showNutrientFilters();
		addFilterListeners();
	});
}

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
			"<td><textarea id='" + cleanName + "_Function' oninput=\"saveTable()\">" + nutrient["Function"] + "</textarea></td>" +
			"<td><textarea id='" + cleanName + "_DSymptoms' oninput=\"saveTable()\">" + nutrient["Deficiency Symptoms"] + "</textarea></td>" +
			"<td><textarea id='" + cleanName + "_TSymptoms' oninput=\"saveTable()\">" + nutrient["Toxicity Symptoms"] + "</textarea></td>" +
			"<td><textarea id='" + cleanName + "_Sources' oninput=\"saveTable()\">" + nutrient["Food Sources"] + "</textarea></td>" +
			"</tr>"
		var nutrient = data[key];
	}

	table += "</tbody></table>";
	document.getElementById("tableBlock").innerHTML = table;
}

function saveTable()
{
	// Update data object
	for (var key in data) {
		var cleanName = key.replace(" ", "_");
		var nutrient = data[key];
		nutrient["Function"] = document.getElementById(cleanName + "_Function").value;
		nutrient["Deficiency Symptoms"] = document.getElementById(cleanName + "_DSymptoms").value;
		nutrient["Toxicity Symptoms"] = document.getElementById(cleanName + "_TSymptoms").value;
		nutrient["Food Sources"] = document.getElementById(cleanName + "_Sources").value;
	}
	saveToLocalStorage();	// Defined in nutrientDataManager.js
}

function showNutrientFilters()
{
	var checkboxes = "";
	for (var key in data) {
		var cleanName = key.replace(" ", "_");
		checkboxes += "<label><input type='checkbox' id='" + cleanName + "Checkbox' checked />" + key + "</label><br>";
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
		var cells = document.querySelector("#nutrientTable th:nth-child(" + parseInt(i + 2) + ")").style.display = displayMode;
		
		// column cells
		cells = document.querySelectorAll("#nutrientTable td:nth-child(" + parseInt(i + 2) + ")");
		for (var j = 0; j < cells.length; j++) {
			cells[j].style.display = displayMode;
		}
	}

	// Apply nutrient filters.
	var i = 1;
	for (var key in data) {
		var cleanName = key.replace(" ", "_");
		var displayMode = document.getElementById(cleanName + "Checkbox").checked ? "table-row" : "none";
		var row = document.querySelector("#nutrientTable tbody tr:nth-child(" + parseInt(i) + ")");
		row.style.display = displayMode;
		i++;
	}
}

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

  applyFilters();
}
