var credentialData;

window.onload = function() {
	// load credential data from the JSON file and the local storage
	var xmlhttp = new XMLHttpRequest();
	var localData = JSON.parse(localStorage.getItem('credentials')) || [];

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var fileData = JSON.parse(xmlhttp.responseText);
			// augment the credentials stored on the file system with the ones stored in local storage
			credentialData = fileData.concat(localData); 
		}
	}

	xmlhttp.open("GET", "../json/credentials.json", true);
	xmlhttp.send();
}


function displayLoginModal(){
	// make the login modal visible
	document.getElementById("loginModal").style.display = "block";

	// blur the background
	document.getElementById("shadow").style.visibility = "visible";
	document.getElementById("content").className = "blur";
	document.getElementById("navBar").className = "blur";
}


function displayRegisterModal(){
	// make the login modal visible and blur the background
	document.getElementById("registerModal").style.display = "block";
}


function hideModals() {
	// hide login modal
	document.getElementById("loginModal").style.display = "none";

	// hide register modal
	document.getElementById("registerModal").style.display = "none";

	// remove blurring
	document.getElementById("shadow").style.visibility = "hidden";
	document.getElementById("content").className = "";
	document.getElementById("navBar").className = "";	
}


function submitCredentials() {
	var form = document.getElementById("login-frm");
	var username = form.elements[0].value;
	var password = form.elements[1].value;

	for(var i = 0; i < credentialData.length; i++) {
		if(credentialData[i].user == username && credentialData[i].pass == password) {
			window.location = "home.html";
		}
	}

	// indicate that the credentials are incorrect
	form.elements[0].className += "incorrect";
	form.elements[1].className += "incorrect";
}


function registerUser() {
	var form = document.getElementById("register-frm");
	var username = form.elements[0].value;

	if(username == "" || usernameTaken(username)) {
		// indicate an error if this username is already used
		form.elements[0].className += "incorrect";
		return;
	}

	removeErrorBorder(form.elements[0]);

	var password = form.elements[1].value;
	var confirmPassword = form.elements[2].value;

	if(password == "" || password != confirmPassword) {
		// indicate an error if the passwords are blank or don't match each other
		form.elements[1].className += "incorrect";
		form.elements[2].className += "incorrect";

		return;
	}

	// register the user by augmenting the local storage of the credentials
	
	var localStorageData = JSON.parse(localStorage.getItem('credentials')) || [];
	localStorageData.push({
		"user": username,
		"pass": password
	});

	localStorage.setItem('credentials', JSON.stringify(localStorageData));
	window.location = "home.html";
}


function usernameTaken(username) {
	for(var i = 0; i < credentialData.length; i++) {
		if(credentialData[i].user == username) {
			return true;
		}
	}

	return false;
}


function removeErrorBorder(elem) {
	elem.style.border = "0px";
}
