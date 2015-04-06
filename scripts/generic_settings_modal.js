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

	document.getElementsByTagName("body")[0].style.overflow = "hidden";

	allowModalExit();
}

function hideModal() {
	document.getElementById("settings-block").style.visibility = "hidden";
	// document.getElementById("background").className = "";

	// remove blurring
	document.getElementById("shadow").style.visibility = "hidden";
	document.getElementById("content").className = "";
	document.getElementById("navBar").className = "";

	document.getElementsByTagName("body")[0].style.overflow = "auto";

	if (restoreOptions) {
		restoreOptions();
	}
}

function allowModalExit() {
	document.getElementById("cancelButton").style.display = "";
	document.getElementById("exit-button").style.display = "";
	document.getElementById("shadow").onclick = hideModal;
}

function preventModalExit() {
	document.getElementById("cancelButton").style.display = "none";
	document.getElementById("exit-button").style.display = "none";
	document.getElementById("shadow").onclick = function() {};
}