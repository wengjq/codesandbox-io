const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const proxy = require("./setupProxy");
const jsonfile = require("jsonfile");
const fs = require("fs");
const moment = require("moment");
const { randomString, decompress, runSchedule } = require("./utils");

const PORT = process.env.PORT || 3001;
const filePath = __dirname + "/tmp/data.json";

const app = express();
proxy(app);
app.use("/static", express.static("src"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

// 开始定时任务
runSchedule(filePath);

app.post("/api", (req, res) => {
  const randomStr = randomString();
  const currentTime = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

  if (fs.existsSync(filePath)) {
    let filesObj = jsonfile.readFileSync(filePath);

    filesObj[randomStr] = JSON.parse(decompress(req.body.parameters));
    filesObj[randomStr]["date"] = currentTime;
    jsonfile.writeFileSync(filePath, filesObj, { spaces: 2, EOL: "\r\n" });
  } else {
    let filesObj = {};

    fs.mkdirSync(__dirname + "/tmp", { recursive: true});
    filesObj[randomStr] = JSON.parse(decompress(req.body.parameters));
    filesObj[randomStr]["date"] = currentTime;
    jsonfile.writeFileSync(filePath, filesObj, { spaces: 2, EOL: "\r\n" });
  }

  res.redirect(301, `http://172.17.33.145:3000/${randomStr}`);
});

app.get("/files/:id", (req, res) => {
  const id = req.params.id;
  
  jsonfile
  .readFile(filePath)
  .then(obj => res.json(obj[id]))
  .catch(error => console.error(error))
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
}); 