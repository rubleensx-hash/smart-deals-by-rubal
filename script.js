document.getElementById("fetchBtn").addEventListener("click", async function(){

const name = document.getElementById("name").value.toLowerCase().trim();

const link = document.getElementById("link").value;

const result = document.getElementById("result");

result.innerHTML="Scanning fast...";

let pidMatch = link.match(/pid=([A-Z0-9]+)/);

if(!pidMatch){

result.innerHTML="Invalid product link";
return;

}

let pid = pidMatch[1];

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

let promises = [];

for(let i=1;i<=100;i++){

promises.push(checkReview(i));

}

await Promise.all(promises);

if(!found){

result.innerHTML="Review not found";

}

});
