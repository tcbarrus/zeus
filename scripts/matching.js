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
	if(e.target.getAttribute("draggable") == true || e.target.tagName == "STRONG"){
		e.dataTransfer.dropEffect = "none";
	}
}