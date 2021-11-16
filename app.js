(
    function() {
        "use strict";
        const express = require('express')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
//const ffmpeg = require('ffmpeg')
const  fs=require('fs')
const ffmpeg = require('fluent-ffmpeg')



const app = express();



app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDire:'/tmp/'
    })
)

ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe");
ffmpeg.setFfprobePath("C:/ffmpeg/bin");
ffmpeg.setFlvtoolPath("C:/flvtool");
        app.get('/', function(req, res) {
            res.sendFile(__dirname+'/index.html');
        });
        
        app.post('/convert',(req,res)=>{
            var to=req.body.to;
            let file =req.files.file;
            let fileName = `output.${to}`;
            console.log(file);
            console.log(to);
        
            file.mv("tmp/" + file.name,function(err){
                if(err) return res.sendStatus(500).send(err);
                console.log("File upload success");
            })
        
            ffmpeg("tmp/" + file.name)
            .withOutputFormat(to)
            .on("end", function (stdout, stderr) {
                console.log("Finished");
                res.download(__dirname + fileName, function (err) {
                    if (err) throw err;
            
                    fs.unlink(__dirname + fileName, function (err) {
                      if (err) throw err;
                      console.log("File deleted");
                    });
                  });
                  fs.unlink("tmp/" + file.name, function (err) {
                    if (err) throw err;
                    console.log("File deleted");
                  });
                })
                .on("error", function (err) {
                  console.log("an error happened: " + err.message);
                  fs.unlink("tmp/" + file.name, function (err) {
                    if (err) throw err;
                    console.log("File deleted");
                  });
                })
                .saveToFile(__dirname + fileName);
            
        });
        
        let server = app.listen(3000, function () {
            console.log('Express server listening on port ' + server.address().port);
        });
        module.exports = app;
    }()
);