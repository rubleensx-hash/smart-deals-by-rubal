async function fetchPermalink(){

const name=document.getElementById("name").value.trim();
const link=document.getElementById("link").value.trim();
const result=document.getElementById("result");
const btn=document.getElementById("btn");

if(!name || !link){
result.innerHTML="<span class='error'>Enter name and link</span>";
return;
}

btn.innerText="Searching...";
btn.disabled=true;

try{

const res=await fetch("/api/find",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name:name,
link:link
})
});

const data=await res.json();

if(data.success){

result.innerHTML=
`<span class="success">Found:</span><br>
<a href="${data.url}" target="_blank">${data.url}</a>`;

}else{

result.innerHTML="<span class='error'>Review not found</span>";

}

}catch(e){

result.innerHTML="<span class='error'>Server error</span>";

}

btn.innerText="Fetch Review Permalink";
btn.disabled=false;

}
