const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/find", async (req, res) => {

try {

const name = req.body.name.toLowerCase().trim();
const link = req.body.link;

if(!name || !link){

return res.json({
success:false,
error:"Missing input"
});

}

// extract PID correctly
let pidMatch = link.match(/pid=([A-Z0-9]+)/);

if(!pidMatch){

return res.json({
success:false,
error:"Invalid Flipkart link"
});

}

const pid = pidMatch[1];

// Flipkart internal review API
const apiUrl = `https://www.flipkart.com/api/3/product/reviews?pid=${pid}&page=1`;

const response = await fetch(apiUrl, {

headers:{
"User-Agent":"Mozilla/5.0",
"Accept":"application/json"
}

});

const data = await response.json();

if(!data.REVIEW){

return res.json({
success:false,
error:"No reviews found"
});

}

// scan reviews
for(let review of data.REVIEW){

let author = review.author.toLowerCase();

if(author.includes(name)){

let reviewId = review.reviewId;

let permalink = `https://www.flipkart.com/reviews/${pid}:${reviewId}`;

return res.json({

success:true,
url:permalink

});

}

}

return res.json({
success:false,
error:"Review not found"
});

}
catch(err){

return res.json({
success:false,
error:"Server error"
});

}

});

app.listen(process.env.PORT || 3000, ()=>{

console.log("Server started");

});
