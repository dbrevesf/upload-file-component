const express = require("express");
const fileUpload = require("express-fileupload");
const resumable = require("resumablejs");
const { idText } = require("typescript");
const app = express();

app.use(fileUpload());

const allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
};


// Upload Endpoint
app.post("/upload", allowCrossDomain, (req, res) => {
  
  if (req.files === null) {
    res.status(400).send({ msg: "No file uploaded" });
  }

  console.log(req.body.importName);
  if (req.body.importName === 'Set an import name. Ex: modeldata') {
    return res.status(400).send('An import name is required');
  }

  console.log(`${req.body.resumableChunkNumber}/${req.body.resumableTotalChunks}`);  
  res.status(200).send('ok');

});

app.get("/upload", allowCrossDomain, (req, res) => {
  console.log(req.query);
  res.status(204).send('Tudo certo meu chapa!');
});

app.listen(5000, () => console.log("Server started..."));
