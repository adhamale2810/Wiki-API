const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = mongoose.Schema({
	title: String,
	content: String
});
const article = mongoose.model("article", articleSchema);


/////////////////////////////////////////Requests targetting all Articles///////////////////////////////////
app.route("/articles")
	.get(function (req, res) {
		article.find({}, function (err, results) {
			if (!err) {
				res.send(results);
			}
			else {
				res.send(err);
			}
		})
	})
	.post(function (req, res) {
		const post = new article({
			title: req.body.title,
			content: req.body.content
		});
		post.save(function (err) {
			if (err) {
				res.send(err);
			}
			else {
				res.send("Successfully added a new article");
			}
		})
	})
	.delete(function (req, res) {
		article.deleteMany({}, function (err) {
			if (err) {
				res.send(err)
			}
			else {
				res.send("Deleted Successfully");
			}
		})
	});


/////////////////////////////////////Requests targetting specific Articles///////////////////////////////////

app.route("/articles/:title")
	.get(function (req, res) {
		article.findOne({ title: req.params.title }, function (err, results) {
			if (!err) {
				res.send(results);
			}
			else {
				console.log(err);
			}
		})
	})
	.put(function (req, res) {
		article.update({ title: req.params.title },
			{ title: req.body.title, content: req.body.content },
			{ overwrite: true },
			function (err) {
				if (err) {
					res.send(err);
				}
				else {
					res.send("Successfully Updated");
				}
			})
	})
	.patch(function (req, res) {
		article.updateOne(
			{ title: req.params.title },
			{ $set: req.body},
			function (err) {
				if (err) {
					res.send(err)
				}
				else {
					res.send("Successfully Updated.")
				}
			})
	})
	.delete(function(req,res){
		article.deleteOne({title:req.params.title},function(err){
			if(err){
				res.send(err);
			}
			else{
				res.send("Deleted Successfully!");
			}
		})
	});

app.listen("3000", function () {
	console.log("Server running on port 3000");
});


/*
{
	"_id": "60508b4df8b33286936f3af6",
		"title": "REST",
			"content": "REST is short for REpresentational State Transfer. It's an architectural style for designing APIs."
},
{
	"_id": "5c139771d79ac8eac11e754a",
		"title": "API",
			"content": "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer."
},
{
	"_id": "5c1398aad79ac8eac11e7561",
		"title": "Bootstrap",
			"content": "This is a framework developed by Twitter that contains pre-made front-end templates for web design"
},
{
	"_id": "5c1398ecd79ac8eac11e7567",
		"title": "DOM",
			"content": "The Document Object Model is like an API for interacting with our HTML"
},
{
	"_id": "60519367f7e44b827ae32c2a",
		"title": "JS",
			"content": "JavaScript is a popular scripting language.",
				"__v": 0
}
*/