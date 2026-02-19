async function findReview(){

let name =
document.getElementById("name").value;

let link =
document.getElementById("link").value;

let result =
document.getElementById("result");

result.innerHTML = "Searching...";

let response = await fetch("/api/find",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
name:name,
link:link
})

});

let data = await response.json();

if(data.success){

result.innerHTML = `
Author: ${data.author}<br>
Rating: ${data.rating}<br>
Title: ${data.title}<br><br>

<a href="${data.url}" target="_blank">
Open Review
</a>
`;

}
else{

result.innerHTML =
data.error;

}

}
