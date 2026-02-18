document.getElementById("fetchBtn").addEventListener("click", async function(){

const name = document.getElementById("name").value.toLowerCase();

const link = document.getElementById("link").value;

const result = document.getElementById("result");

result.innerHTML="Scanning...";

let pidMatch = link.match(/pid=([A-Z0-9]+)/);

if(!pidMatch){

result.innerHTML="PID not found in link";

return;

}

let pid = pidMatch[1];

for(let i=1;i<=100;i++){

let reviewLink = `https://www.flipkart.com/reviews/${pid}:${i}`;

try{

let res = await fetch(reviewLink);

let text = await res.text();

if(text.toLowerCase().includes(name)){

result.innerHTML =
`<a href="${reviewLink}" target="_blank">${reviewLink}</a>`;

return;

}

}catch(e){}

}

result.innerHTML="Review not found";

});
