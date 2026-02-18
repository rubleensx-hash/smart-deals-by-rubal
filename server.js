const express=require("express");
const puppeteer=require("puppeteer");
const cors=require("cors");
const app=express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.post("/find",async(req,res)=>{
let {productLink,buyerName}=req.body;
let pid=productLink.match(/pid=([A-Z0-9]+)/)?.[1];
if(!pid)return res.json({success:false});
try{
const browser=await puppeteer.launch({headless:true,args:["--no-sandbox"]});
const page=await browser.newPage();
await page.goto(`https://www.flipkart.com/product-reviews/${pid}`,{waitUntil:"networkidle2"});
let link=await page.evaluate((name)=>{
let blocks=document.querySelectorAll("div._27M-vq");
for(let b of blocks){
let n=b.querySelector("p._2sc7ZR")?.innerText;
if(n?.toLowerCase().includes(name.toLowerCase()))
return b.querySelector("a")?.href;
}
return null;
},buyerName);
await browser.close();
res.json({success:!!link,permalink:link});
}catch(e){res.json({success:false});}
});
app.listen(3000,()=>console.log("Running on http://localhost:3000"));
