var express = require("express");
var router = express.Router();
var sdk = require("sdk-abc-voice");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("demo", { title: "Express" });
});
const multer = require("multer");
var upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});
router.post("/", upload.single("myFile"), function(req, res, next) {
  let wdRes = res;
  let wdReq = req;
  const file = req.file;
  if (
    file.mimetype !== "audio/wav" &&
    file.mimetype !== "audio/wave" &&
    file.mimetype !== "audio/x-wav"
  ) {
    wdRes.render("demo", { error: "chỉ nhận file WAV" });
    return;
  }
  if (!file) {
    wdRes.render("demo", { error: "Vui lòng upload một file" });
    return;
  }
  var formData = {
    voice: {
      value: file.buffer,
      options: {
        filename: file.originalname,
        contentType: file.mimetype
      }
    }
  };
  // Here is the way you use SDK to conver data
  // your API Key to verify with server
  var apiKey = req.body.apiKey;
  console.log("apikey------", apiKey);
  // Call API with apiKey and formdata
  console.log("formData------", formData);
  var result = sdk(apiKey, formData)
    .then(data => {
      console.log("data: ", data);
      wdRes.render("demo", { result: data.text });
    })
    .catch(err => console.log(err));
  //show result
  // console.log('result:   ', result);
  // res.json({ message: result });
});
module.exports = router;
