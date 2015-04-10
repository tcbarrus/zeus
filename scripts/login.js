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


function displayRegisterBlock() {
	document.getElementById("loginBlock").style.display = "none";
	document.getElementById("registerBlock").style.display = "block";
}

function displayLoginBlock() {
	document.getElementById("loginBlock").style.display = "block";
	document.getElementById("registerBlock").style.display = "none";
}


function submitCredentials() {
	var form = document.getElementById("login-frm");
	var username = form.elements[0].value;
	var password = form.elements[1].value;

	for(var i = 0; i < credentialData.length; i++) {
		if(credentialData[i].user == username && credentialData[i].pass == password) {
			window.location = "articles.html";
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
	window.location = "articles.html";
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
