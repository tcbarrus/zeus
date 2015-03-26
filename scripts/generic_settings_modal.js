function showModal() {
	document.getElementById("settings-block").style.visibility = "visible";
	document.getElementById("background").className = "blur";	
}

function hideModal() {
	document.getElementById("settings-block").style.visibility = "hidden";
	document.getElementById("background").className = "";
}