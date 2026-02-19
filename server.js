const express = require("express");
const cors = require("cors");

const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

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

return res.json({
success:false,
error:"Invalid product link"
});

}

let pid = match[1];

let browser = await puppeteer.launch({

args:chromium.args,

defaultViewport:chromium.defaultViewport,

executablePath:await chromium.executablePath(),

headless:true

});


let page = await browser.newPage();

await page.goto(
`https://www.flipkart.com/product-reviews/${pid}?pid=${pid}`,
{waitUntil:"networkidle2"}
);

await page.waitForTimeout(3000);


let result = await page.evaluate((name)=>{

let reviews =
document.querySelectorAll("._27M-vq");

for(let r of reviews){

let author =
r.querySelector("._2sc7ZR")?.innerText;

let id =
r.getAttribute("data-review-id");

if(author && id){

if(author.toLowerCase().includes(name)){

return id;

}

}

}

return null;

},name);


await browser.close();


if(result){

return res.json({

success:true,

url:
`https://www.flipkart.com/reviews/${pid}:${result}`

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


app.listen(process.env.PORT || 3000);
