const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/find", async (req, res) => {

try{

let name = req.body.name.toLowerCase().trim();
let link = req.body.link;

let match = link.match(/pid=([A-Z0-9]+)/);

if(!match){

return res.json({
success:false,
error:"Invalid link"
});

}

let pid = match[1];

let api =
`https://www.flipkart.com/api/3/product/reviews?pid=${pid}&page=1`;

let response = await fetch(api,{

headers:{
"User-Agent":"Mozilla/5.0",
"Accept":"application/json"
}

});

let data = await response.json();

let reviews = data.REVIEW;

if(!reviews){

return res.json({
success:false,
error:"No reviews"
});

}

for(let r of reviews){

let author = r.author.toLowerCase();

if(author.includes(name)){

let reviewId = r.reviewId;

let permalink =
`https://www.flipkart.com/reviews/${pid}:${reviewId}`;

return res.json({

success:true,
url:permalink,
author:r.author,
rating:r.rating,
title:r.title

});

}

}

return res.json({
success:false,
error:"Review not found"
});

}
catch{

return res.json({
success:false,
error:"Server error"
});

}

});

app.listen(process.env.PORT || 3000);
