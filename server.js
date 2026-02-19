const axios = require("axios");

app.post("/fetch-review", async (req, res) => {

try {

const { name, link } = req.body;

const pidMatch = link.match(/pid=([A-Z0-9]+)/i);

if (!pidMatch)
return res.json({success:false,error:"PID not found"});

const pid = pidMatch[1];

const url =
`https://www.flipkart.com/api/3/product/reviews?productId=${pid}&page=1`;

const response = await axios.get(url);

const reviews =
response.data.REVIEWS || [];

const filtered = reviews.filter(r =>
r.author.toLowerCase().includes(name.toLowerCase())
);

if(filtered.length===0)
return res.json({success:false,error:"No review found"});

const result = filtered.map(r=>({

name:r.author,

title:r.title,

permalink:
`https://www.flipkart.com/reviews/${pid}:${r.reviewId}`

}));

res.json({
success:true,
reviews:result
});

}
catch(e){
res.json({success:false,error:"Server error"});
}

});
