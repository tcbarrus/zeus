// Creates a global variable called data that stores all the information from the nutrient table.
var data;
var onDataLoad;

// Populates the global data variable with existing nutrient data or creates an empty nutrient object structure.
function loadData(onLoadFunction) {
	onDataLoad = onLoadFunction;
	loadFromLocalStorage();
	if (data != null && onDataLoad) {
		onDataLoad();
	}
	else if (data == null) {
		loadFromFile("../json/emptyData.json");
		saveToLocalStorage();
	}
}

// Use a pre-defined data file instead. (../json/data.json contains full data)
function loadFromFile(filepath, onLoadFunction)
{
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			data = JSON.parse(xmlhttp.responseText);

			if (onDataLoad) {
				onDataLoad();
			}
		}
	}

	xmlhttp.open("GET", filepath, true);
	xmlhttp.send();
}

function loadFromLocalStorage()
{
	if (localStorage.getItem('nutrientTableData') != "undefined") {
		data = JSON.parse(localStorage.getItem('nutrientTableData'));
	}
}

// Saves current data variable to local storage.
function saveToLocalStorage()
{
	localStorage.setItem('nutrientTableData', JSON.stringify(data));
}