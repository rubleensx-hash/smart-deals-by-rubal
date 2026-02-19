const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));


// Extract PID from Flipkart link
function getPID(link) {

const match = link.match(/\/p\/(itm[0-9a-zA-Z]+)/);

return match ? match[1] : null;

}


// Fetch reviews fast from Flipkart API
app.post("/fetch-review", async (req, res) => {

try {

const nameInput = req.body.name.toLowerCase();

const link = req.body.link;

const pid = getPID(link);

if (!pid)
return res.json({
success:false,
error:"Invalid Flipkart link"
});


const url =
`https://www.flipkart.com/api/3/product/reviews?pid=${pid}&page=1`;


const response = await axios.get(url, {

headers: {
"User-Agent":"Mozilla/5.0"
}

});


const reviews = response.data.REVIEWS || [];

const matched = reviews
.filter(r =>
r.author.toLowerCase().includes(nameInput)
)
.map(r => ({

name: r.author,

title: r.title,

permalink:
`https://www.flipkart.com/reviews/${r.reviewId}`

}));


if (matched.length === 0)
return res.json({
success:false,
error:"Review not found"
});


res.json({
success:true,
reviews:matched
});

}
catch (err) {

console.log(err.message);

res.json({
success:false,
error:"Server error"
});

}

});


// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log("Server running on port", PORT);
});
