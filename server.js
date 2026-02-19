const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

/*
 API endpoint:
 POST /api/find
 body:
 {
   name: "reviewer name",
   link: "flipkart product link"
 }
*/

app.post("/api/find", async (req, res) => {

try{

const name = req.body.name.toLowerCase().trim();
const link = req.body.link.trim();

if(!name || !link){

return res.json({
success:false,
error:"Missing name or link"
});

}

// extract PID
let pidMatch = link.match(/pid=([A-Z0-9]+)/);

if(!pidMatch){

return res.json({
success:false,
error:"Invalid product link"
});

}

const pid = pidMatch[1];

// FAST parallel scan
const maxScan = 150;
const concurrency = 10;

let foundUrl = null;

for(let i=1; i<=maxScan; i+=concurrency){

let batch = [];

for(let j=i; j<i+concurrency && j<=maxScan; j++){

const reviewUrl = `https://www.flipkart.com/reviews/${pid}:${j}`;

batch.push(

fetch(reviewUrl)
.then(r => r.text())
.then(text => {

if(foundUrl) return;

if(text.toLowerCase().includes(name)){

foundUrl = reviewUrl;

}

})
.catch(()=>{})

);

}

await Promise.all(batch);

if(foundUrl) break;

}

if(foundUrl){

return res.json({
success:true,
url:foundUrl
});

}else{

return res.json({
success:false,
error:"Review not found"
});

}

}catch(e){

return res.json({
success:false,
error:"Server error"
});

}

});

// start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{

console.log("Server running on port", PORT);

});
