window.addEventListener("load", function()
{
let messageTime = document.getElementsByClassName("time");
let messageName = document.getElementsByClassName("name");
let inputMessage = document.getElementById("inputMessage");
let send = document.getElementById("send");
let loginButton = document.getElementById("login");
let logoutButton = document.getElementById("logout");
var inputName = document.getElementById("inputName");
let loginText = document.getElementById("loginText");
let showMessages = document.getElementById("showMessages");
let inlogBox = document.getElementById("inlog");
let cover = document.getElementById("cover");
var loggedInName;
var writtenMessage;
let totalMessages = 0;

loggedInName = localStorage.getItem("name"); // Hämtar inloggningsnamnet ifrån LocalStorage


//******************** HÄMTAR FRÅN DATABASEN ***********************//

firebase.database().ref('messages/').on('value', function(snapshot){        // måste inte heta snapshot
			
				console.log('första gången eller ändring i databasen');
				var data = snapshot.val();
				
				showMessages.innerHTML = "";         // tömmer tabellen innan jag fyller på den 
				
				for( let message in data){ 				// skriver kod som hämtar datan och lägger in den i tabellen. 
				
					let lastMessage = data[message];               // ett objekt
					//console.log('data[message]= ', data[message]); 
					
					totalMessages = data.length;
					console.log(totalMessages);
					
					let tr = document.createElement('tr');           // tr = tablerow
					tr.innerHTML = `
					<td style="font-size: 12px; "><b>${lastMessage.name}: </b><span style="color: #d2acb6; font-family: arial; font-size: 10px;">${lastMessage.time}</span> </td>
		`;
					
					let tm = document.createElement('tr');
					tm.innerHTML = `
					<td>${lastMessage.thisMessage}</td>
					`;
					//<td style="width=50px; background-color:${animal.farg};">${lastMessage.time}</td>
					
					showMessages.appendChild(tr);
					showMessages.appendChild(tm);

					// ta reda på hur man lägger till objekten i tabellen i ordning??? 
					
				}
			});	




//********* döljer "logged in as" om ingen är inloggad *****//
if (loggedInName == "")
{
	loginText.innerHTML = "";
}
else
{
	loginText.innerHTML = "You are logged in as " + loggedInName;
	inlogBox.style.display = "none";
	cover.style.display = "none";
}


//*********************** LOG IN KNAPP ***********************//

loginButton.addEventListener("click", function(event){
loggedInName = inputName.value;
localStorage.setItem("name", loggedInName); // Sparar inloggningsnamn i LocalStorage
console.log(localStorage.getItem("name"));
 console.log(loggedInName);
if (loggedInName == "")
{
	loginText.innerHTML = "";
}
else
{
	loginText.innerHTML = "You are logged in as " + loggedInName;
	
	console.log(inlogBox);
	console.log(cover);
	
	inlogBox.style.display = "none";
	cover.style.display = "none";
}

inputName.value = "";


});

//*********************** LOG OUT KNAPP ************************//
logoutButton.addEventListener("click", function(event){
loggedInName = localStorage.setItem("name", ""); // ska ligga i loginknapp
console.log(loggedInName);
loginText.innerHTML = "";
	inlogBox.style.display = "inherit";
	cover.style.display = "inherit";
});


//*************** SKICKA MEDDELANDE - KNAPP ******************//
send.addEventListener("click", function(event){
	writtenMessage = inputMessage.value;
	console.log(writtenMessage);
	inputMessage.value = "";
	
	
	console.log("Klickat på klicka-knappen");
	
	
	let message = { // exempel objekt meddelande
	name: loggedInName,											// till vänster är namnet på egenskapen och till höger är variabeln
	thisMessage: writtenMessage,
	id: totalMessages,  // skapa en lista för alla objekt i databas/messages ??
	time: currentTime()
};

firebase.database().ref('messages/' + message.id).set(message); // lägger till ett medelande i databasen'
	
	/*firebase.database().ref('messages/' + totalMessages + 1).set({          // hitta på namn på mapp där det skall sparas + något som är unikt för varje objekt
			
					name: loggedInName,											// till vänster är namnet på egenskapen och till höger är variabeln
					thisMessage: writtenMessage,
					id: totalMessages + 1,  // skapa en lista för alla objekt i databas/messages ??
					time: currentTime()
			
			})*/
});


console.log(inputMessage.value == "");
//******************* ENTER KNAPPEN ***********************//
window.addEventListener("keydown", dealWithKeyboard, false);


function dealWithKeyboard(e) {
	if (inputMessage.value == "")
{
	console.log("Du har inte skrivit något");
}
else{
    if(e.keyCode == "13")
{
	writtenMessage = inputMessage.value;
	console.log(writtenMessage);
	inputMessage.value = "";
	
	console.log("Klickat på enter-knappen");
	
	let message = { 
	name: loggedInName,	
	thisMessage: writtenMessage,
	id: totalMessages,
	time: currentTime()
};

	firebase.database().ref('messages/' + message.id).set(message); // lägger till ett medelande i databasen'
    return false; // returnera false hindrar eventet från att bubbla upp 
}
else
{
    return true;
}
}
}

//***************** CURRENT TIME FUNCTION ************************/

function currentTime() { 

	var currentDate = new Date();
	var time = currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + " " + currentDate.getHours() + ":" + currentDate.getMinutes();
	
	return time;
}


});
