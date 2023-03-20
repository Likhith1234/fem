const fs = require("fs");
const express = require("express");
const cors = require("cors");

const { spawn } = require('child_process');

const app = express();
app.use(express.json());
app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));


let runPy = new Promise(function(success, nosuccess) {

  const pyprog = spawn('python', ['./Project_FEM.py']);

  pyprog.stdout.on('data', function(data) {

      success(data);
  });

  pyprog.stderr.on('data', (data) => {

      nosuccess(data);
  });
});


app.post("/server", (req, res) => {
    console.log(req.body);
  fs.writeFile("data.json", JSON.stringify(req.body), (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
      console.log("The written has the following contents:");
      console.log(fs.readFileSync("data.json", "utf8"));
    }

    runPy.then(function(fromRunpy) {
      console.log(fromRunpy.toString());
      // res.end(fromRunpy);
      res.json({"msg": "success", "code": 200});
    });
    runPy.catch((err) => {
      console.log(err.message);
    });

  });
});

app.listen(5000, () => {console.log("Connected @ 5000")});