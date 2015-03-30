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
}

function hideModal() {
	document.getElementById("settings-block").style.visibility = "hidden";
	// document.getElementById("background").className = "";
	checkAll('nutrients', false);
	checkAll('options', false);

	// remove blurring
	document.getElementById("shadow").style.visibility = "hidden";
	document.getElementById("content").className = "";
	document.getElementById("navBar").className = "";

	document.getElementsByTagName("body")[0].style.overflow = "auto";

}