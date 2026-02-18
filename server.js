async function findReview(){

const name = document.getElementById("name").value.trim().toLowerCase();
const link = document.getElementById("link").value;

const status = document.getElementById("status");
const result = document.getElementById("result");

result.innerHTML="";
status.innerHTML="Scanning reviews...";

let pidMatch = link.match(/pid=([A-Z0-9]+)/);

if(!pidMatch){

let shortMatch = link.match(/\/p\/.*\/([A-Z0-9]{16})/);

if(shortMatch){
pidMatch=[null,shortMatch[1]];
}

}

if(!pidMatch){

status.innerHTML="Invalid product link";
return;

}

let pid = pidMatch[1];

let found=false;

for(let i=1;i<=200;i++){

status.innerHTML="Scanning review "+i;

let reviewUrl=`https://www.flipkart.com/reviews/${pid}:${i}`;

try{

let response = await fetch(reviewUrl);

if(response.ok){

if(name===""){

result.innerHTML=reviewUrl;

status.innerHTML="Permalink found";

window.open(reviewUrl,"_blank");

found=true;

break;

}

let text = await response.text();

if(text.toLowerCase().includes(name)){

result.innerHTML=reviewUrl;

status.innerHTML="Review found";

window.open(reviewUrl,"_blank");

found=true;

break;

}

}

}catch(e){}

}

if(!found){

status.innerHTML="Review not found in first 200";

}

}
