/* CS5002 - Assignment 4 - StacsYak
 * A program that gets infomation from the StacsYak system(Web API)
 * Student ID - 170022175, 170022936, 170023185
 */

var url = "https://cs5002-api.host.cs.st-andrews.ac.uk/api/";

window.onload = function() {
	getMsg();
};

function getKey() {
	var key = document.getElementById('Key').value;
	key = '?key=' + key;
	return key;
}

function clearTable(table_name) {
  var table = document.getElementById(table_name);
 	table.innerHTML = "";
};

var addCell = function(text, tr) {
 	var td = document.createElement('td');
 	var text = document.createTextNode(text);
 	td.appendChild(text);
 	tr.appendChild(td);
};

var add_vote_button = function(text, tr) {
  var td = document.createElement("td");
  var button = document.createElement("input");
  button.type = "button";
  button.value = "Vote Up";
  button.class = "waves-effect waves-light btn";
  button.onclick = function(){
 	   upvote(text);
  };
  td.appendChild(button);
  tr.appendChild(td);
};

var add_vote_down_button = function(text, tr) {
  var td = document.createElement("td");
  var button = document.createElement("input");
  button.type = "button";
  button.value = "Vote Down";
  button.class = "waves-effect waves-light btn";
  button.onclick = function(){
 	   downvote(text);
  };
  td.appendChild(button);
  tr.appendChild(td);
};

var add_del_button = function(text, tr) {
 	var td = document.createElement("td");
 	var button = document.createElement("input");
 	button.type = "button";
 	button.value = "Delete";
 	button.class = "waves-effect waves-light btn";
 	button.onclick = function(){
 		deleteMypost(text);
 	};
 	td.appendChild(button);
 	tr.appendChild(td);
};

// function for getting messages from server with api.
function getMsg() {
	var apiUrl = url + "yaks" + getKey(); // api url
  clearTable('messageContents');
    // getting messages
	fetch(apiUrl)
		.then(function(response) { // for handling responses
			// output application/json; charset=utf-8
			console.log(response.headers.get('Content-Type'));
			// output response status
			console.log(response.status);

			return response.json();
		})
		.then(function(data) { // getting response data (JSON format)
			//console.log(data);
			var table = document.getElementById('messageContents');
			for (var i = 0; i < data.length; i++) {
        var tr = document.createElement('tr');
				var item = data[i];
				addCell(item.id, tr);
				addCell(item.content, tr);
				addCell(item.userNick == undefined? 'Anonymous':item.userNick, tr);
        addCell(item.timestamp, tr);
				addCell(item.votes, tr);
				add_vote_button(item.id, tr);
				add_vote_down_button(item.id, tr);
				table.appendChild(tr);
			};
		})
		.catch(function(error) { //  error message from server
			console.log(error);
		});
	document.getElementById('table1').style.display = "";;
	document.getElementById('table2').style.display = "none";
	document.getElementById('table3').style.display = "none";
};


// data object for posting messages.
var initObject = {
	method: "POST",
	headers: {"Content-Type": "application/json"},
	body: "" // message content.
};

// posting message to server by api Url.
function postMsg() {
	var content = document.getElementById('postMsg').value; // getting the message content from text element
	var apiPostUrl = url + "yaks" + getKey();
	initObject.body = JSON.stringify({content: content});

	fetch(apiPostUrl, initObject)
	  .then(function(response) {
			console.log(response.headers.get('Content-Type'));
			console.log(response.status);
			if (response.status == 200) {alert("Successfully post your message!\n\nPlease click SHOW ALL MESSAGE to view the change.")};
	    return response.json();
	  })
	  .then(function(data) {
	  	console.log(data);
	  })
	  .catch(function(error) {
	  	console.log(error);
	  });
};

var VoteObject = {
	method: "POST",
	headers: {"Content-Type": "application/json"},
	body: JSON.stringify({direction: "up"})
};

function upvote(yaks_id) {
	fetch(url + "yaks/" + yaks_id + "/vote" + getKey(), VoteObject)
	  .then(function(response) {
		console.log(response.status);
		if (response.status == 200) {alert("Successfully vote for the message!\n\nPlease click SHOW ALL MESSAGE to view the change.")}
		else {alert("Sorry, you can't vote twice.")};
		return response.json();
	  })
	  .then(data => console.log(data))
	  .catch(error => console.log(error));
	  getMsg();
};

var VoteObject2 = {
	method: "POST",
	headers: {"Content-Type": "application/json"},
	body: JSON.stringify({direction: "down"})
};

function downvote(yaks_id) {
	fetch(url + "yaks/" + yaks_id + "/vote" + getKey(), VoteObject2)
	  .then(function(response) {
		console.log(response.status);
		if (response.status == 200) {alert("Successfully vote down for the message!\n\nPlease click SHOW ALL MESSAGE to view the change.")}
		else {alert("Sorry, you can't vote twice.")};
		return response.json();
	  })
	  .then(data => console.log(data))
	  .catch(error => console.log(error));
	  getMsg();
};


// data object for changing nickname.
var NameObject = {
	method: "POST",
	headers: {"Content-Type": "application/json"},
	body: "" // message content.
};

function changeName() {
	var content = document.getElementById('Nickname').value;
	var apiurl = url + "user" + getKey();
	NameObject.body = JSON.stringify({userNick: content});

	fetch(apiurl, NameObject)
	  .then(function(response) {
	  	console.log(response);
			if (response.status == 200) {alert("Successfully reset user name!\n\nPlease click USER INFORMATION to view the change.")};
	    return response.json();
	  })
	  .then(function(data) {
	  	console.log(data);
	  })
	  .catch(function(error) {
	  	console.log(error);
	  });
};

function getUser() {
  var apiUrl = url + "user" + getKey();
	fetch(apiUrl)
		.then(function(response) { // for handling responses
			// output application/json; charset=utf-8
			console.log(response.headers.get('Content-Type'));
			// output response status
			console.log(response.status);

			return response.json();
		})
		.then(function(data) { // getting response data (JSON format)
			//console.log(data);
      var tableObject = document.getElementById('UserInformation');
			var html = '';
			html += "<tr><td>" + data.id + "</td>" +
					    "<td>" + (data.userNick == undefined? 'Anonymous':data.userNick) + "</td>" +
					    "<td>" + data.totalPosts + "</td>" +
					    "<td>" + data.score + "</td>" +
					    "</tr>";
			tableObject.innerHTML = html;
		})
		.catch(function(error) { //  error message from server
			console.log(error);
		});
	document.getElementById('table1').style.display = "none";;
	document.getElementById('table2').style.display = "none";
	document.getElementById('table3').style.display = "";
}

function getMypost() {
	var apiUrl = url + "user/yaks" + getKey();
    // getting messages
  clearTable('messageMyContents');
	fetch(apiUrl)
		.then(function(response) { // for handling responses
			// output application/json; charset=utf-8
			console.log(response.headers.get('Content-Type'));
			// output response status
			console.log(response.status);

			return response.json();
		})
		.then(function(data) { // getting response data (JSON format)
			//console.log(data);
      var table = document.getElementById('messageMyContents');
			for (var i = 0; i < data.length; i++) {
        var tr = document.createElement('tr');
				var item = data[i];
				addCell(item.id, tr);
				addCell(item.content, tr);
				addCell(item.userNick == undefined? 'Anonymous':item.userNick, tr);
				addCell(item.timestamp, tr);
				addCell(item.votes, tr);
				add_del_button(item.id, tr);
				table.appendChild(tr);
			};
		})
		.catch(function(error) { //  error message from server
			console.log(error);
		});
	document.getElementById('table1').style.display = "none";;
	document.getElementById('table2').style.display = "";
	document.getElementById('table3').style.display = "none";
};


function deleteMypost(yaks_id) {
	fetch(url + "yaks/" + yaks_id + getKey(), {
  method: "DELETE"
}).then(function(response) {
  console.log(response.status);
	if (response.status == 200) {alert("Successfully delete your message!\n\nPlease click SHOW YOUR OWN MESSAGE to view the change.")};
	return response.json();
  })
  .then(messages => console.log(messages))
	.catch(error => console.log(error));
	getMypost();
}


function FilterOutNicknamer(){
 var nickname = prompt ('type a nick name');
 nickname = nickname.toLowerCase();

 var apiUrl = url + "yaks" + getKey(); // api url
 clearTable('messageContents');
	 // getting messages
 fetch(apiUrl)
	 .then(function(response) { // for handling responses
		 // output application/json; charset=utf-8
		 console.log(response.headers.get('Content-Type'));
		 // output response status
		 console.log(response.status);

		 return response.json();
	 })
	 .then(function(data) { // getting response data (JSON format)
		 //console.log(data);
		 var filteredData = data.filter(function(object){
			 if(object.userNick != undefined){
			 return object.userNick.toLowerCase() == nickname;
		 }
		 		
		 });
		 console.log(filteredData);
		 var table = document.getElementById('messageContents');
		 for (var i = 0; i < filteredData.length; i++) {
			 var tr = document.createElement('tr');
			 var item = filteredData[i];
			 addCell(item.id, tr);
			 addCell(item.content, tr);
			 addCell(item.userNick == undefined? 'Anonymous':item.userNick, tr);
			 addCell(item.timestamp, tr);
			 addCell(item.votes, tr);
			 add_vote_button(item.id, tr);
			 add_vote_down_button(item.id, tr);

			 table.appendChild(tr);
		 };
	 })
	 .catch(function(error) { //  error message from server
		 console.log(error);
	 });
 document.getElementById('table1').style.display = "";;
 document.getElementById('table2').style.display = "none";
 document.getElementById('table3').style.display = "none";
}


function SortByVotes(){
 var apiUrl = url + "yaks" + getKey(); // api url
 clearTable('messageContents');
	 // getting messages
 fetch(apiUrl)
	 .then(function(response) { // for handling responses
		 // output application/json; charset=utf-8
		 console.log(response.headers.get('Content-Type'));
		 // output response status
		 console.log(response.status);

		 return response.json();
	 })
	 .then(function(data) { // getting response data (JSON format)
		 //console.log(data);
		 data.sort(function(obj1,obj2){
			 	return obj2.votes-obj1.votes;
		 });
		 console.log(data);
		 var table = document.getElementById('messageContents');
		 for (var i = 0; i < data.length; i++) {
			 var tr = document.createElement('tr');
			 var item = data[i];
			 addCell(item.id, tr);
			 addCell(item.content, tr);
			 addCell(item.userNick == undefined? 'Anonymous':item.userNick, tr);
			 addCell(item.timestamp, tr);
			 addCell(item.votes, tr);
			 add_vote_button(item.id, tr);
			 add_vote_down_button(item.id, tr);

			 table.appendChild(tr);
		 };
	 })
	 .catch(function(error) { //  error message from server
		 console.log(error);
	 });
 document.getElementById('table1').style.display = "";;
 document.getElementById('table2').style.display = "none";
 document.getElementById('table3').style.display = "none";
    
}





