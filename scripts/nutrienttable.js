var data;
var secondsBetweenSave = 5;

window.onload = function() {
	loadFromLocalStorage();
	if (data === null) {
		loadFromFile("../json/emptyData.json");
	}
	buildTable();
}

// We could also have it save when a textarea changes or something
setInterval(function() {
	saveToLocalStorage();
}, secondsBetweenSave * 1000);

// Rebuilds the entire table from data and puts it in the table block div
function buildTable()
{
	var table = "<table>" +
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
