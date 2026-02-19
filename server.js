const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/find", async (req, res) => {

try{

let name = req.body.name.toLowerCase();
let link = req.body.link;

let match = link.match(/pid=([A-Z0-9]+)/);

if(!match){
return res.json({success:false,error:"Invalid link"});
}

let pid = match[1];

let reviewUrl =
`https://www.flipkart.com/product-reviews/${pid}?pid=${pid}`;

const browser = await puppeteer.launch({
headless:true,
args:["--no-sandbox"]
});

const page = await browser.newPage();

await page.goto(reviewUrl,{waitUntil:"networkidle2"});

await page.waitForTimeout(3000);

let reviews = await page.evaluate(()=>{

let arr = [];

document.querySelectorAll("._27M-vq").forEach(el=>{

let author =
el.querySelector("._2sc7ZR")?.innerText;

let reviewId =
el.getAttribute("data-review-id");

if(author && reviewId){

arr.push({
author:author,
reviewId:reviewId
});

}

});

return arr;

});

await browser.close();

for(let r of reviews){

if(r.author.toLowerCase().includes(name)){

let permalink =
`https://www.flipkart.com/reviews/${pid}:${r.reviewId}`;

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
catch(e){

return res.json({
success:false,
error:"Server error"
});

}

});

app.listen(process.env.PORT || 3000);
