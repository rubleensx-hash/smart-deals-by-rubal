document.getElementById("fetchBtn").addEventListener("click", async function(){

const name = document.getElementById("name").value.toLowerCase().trim();

const link = document.getElementById("link").value;

const result = document.getElementById("result");

result.innerHTML="Scanning fast...";

let pid = null;

// Try method 1: extract pid=
let match = link.match(/pid=([A-Z0-9]+)/);

if(match){
pid = match[1];
}

// Try method 2: extract from /p/
if(!pid){

let match2 = link.match(/\/p\/([a-zA-Z0-9]+)/);

if(match2){

result.innerHTML="Extracting PID...";

try{

let res = await fetch(link);

let text = await res.text();

let pidMatch = text.match(/\"productId\":\"([A-Z0-9]+)\"/);

if(pidMatch){

pid = pidMatch[1];

}

}catch(e){}

}

}

if(!pid){

result.innerHTML="Invalid product link";
return;

}

let found = false;

async function checkReview(i){

if(found) return;

let url = `https://www.flipkart.com/reviews/${pid}:${i}`;

try{

let res = await fetch(url);

let text = await res.text();

if(text.toLowerCase().includes(name)){

found=true;

result.innerHTML =
`✅ Found:<br>
<a href="${url}" target="_blank">${url}</a>`;

}

}catch(e){}

}

let promises=[];

for(let i=1;i<=100;i++){

promises.push(checkReview(i));

}

await Promise.all(promises);

if(!found){

result.innerHTML="Review not found";

}

});
