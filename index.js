// var express = require('express');
// var app = express();
var app = require('express')();
var http = require('http').Server(app);
var chokidar = require('chokidar');
var fs = require('fs');
var mongoose = require('mongoose');
var moment = require('moment');

//NEED MONGO CONNECTION
mongoose.connect('mongodb://localhost:27017/MongoD');

var fileCount = 0;

var watcher = chokidar.watch('html_repo', {
    ignored: /[\/\\]\./,
    persistent: true
});

watcher
    .on('add', function (path) {
        fileCount++;
        console.log(fileCount);

        // console.log('File', path, 'has been added');
        //read the file and get the data input
        var readStream = fs.createReadStream(path);
        var lineReader = require('readline').createInterface({
            input: readStream
        });

        // console.log(lineReader);
        var lineCount = 1;
        lineReader.on('line', function (line) {

            // console.log('Line from file:', line);
            // readStream.close();
            // readStream.destroy();
            if (lineCount == 1) {
                // console.log(line);
                parseParameters(line, path);
                lineCount++;
            }


        });


    })
    .on('addDir', function (path) {
        console.log('Directory', path, 'has been added');
    })
    .on('change', function (path) {
        console.log('File', path, 'has been changed');
    })
    .on('unlink', function (path) {
        console.log('File', path, 'has been removed');
    })
    .on('unlinkDir', function (path) {
        console.log('Directory', path, 'has been removed');
    })
    .on('error', function (error) {
        console.error('Error happened', error);
    })

// 'add', 'addDir' and 'change' events also receive stat() results as second argument.
// http://nodejs.org/api/fs.html#fs_class_fs_stats
watcher.on('change', function (path, stats) {
    console.log('File', path, 'changed size to', stats.size);

});

// require('chokidar').watch('html_repo', {ignored: /[\/\\]\./}).on('all', function(event, path) {
//   console.log(event, path);
// });

app.get('/', function (req, res) {
    // res.send('console running!');
    res.sendFile('index.html', {
        root: 'client'
    });
});

app.get('/search', function (req, res) {

    var url = req["query"]["url"];
    console.log(url);


    //input is url >>> output is version
    var HTMLModel = require('./model/htmlmodel');

    // var HTMLItem = new HTMLModel({ url: url_value,version:version_value , path:path_value });

    HTMLModel.find({
        url: url
    }, null, {
        sort: {
            version: -1
        }
    }, function (err, docs) {

        var data = {};
        var result = [];
        console.log('Items are  is ' + docs);

        for (var i = 0; i < docs.length; i++) {

            var tmpObj = {};

            tmpObj.url = url;
            tmpObj.version = moment(parseInt(docs[i]["version"])).format('MMMM Do YYYY, h:mm:ss a');


            result.push(tmpObj);


        }

        data.result = result;

        res.send(data);

    });



    // res.send('console running!');
    // res.sendFile('client/index.html' , { root : 'client'});
});

app.get('/raw', function (req, res) {

    var url = req["query"]["url"];
    var version = req["query"]["version"];



    var html_data = "<h1>No Valid Data Found! Its all the Developer's Fault!!</h1>";

    var HTMLModel = require('./model/htmlmodel');
    HTMLModel.findOne({
        url: url,
        version: version
    }, null, {}, function (err, docs) {

        if (docs != null) {



            var data = {};


            var tmpObj = {};

            tmpObj.url = url;
            tmpObj.version = moment(parseInt(docs["version"])).format('MMMM Do YYYY, h:mm:ss a');
            tmpObj.html = "";

            //parse from new path for html

            var path_from_db = docs["path"];

            if (path_from_db.indexOf('html_repo') >= 0) {
                // Found word
                // fs.unlinkSync(path_from_db);
            } else {
                var output_readStream = fs.createReadStream(path_from_db);
                var output_lineReader = require('readline').createInterface({
                    input: output_readStream
                });

                // console.log(lineReader);
                var lineCount = 1;
                output_lineReader.on('line', function (line) {

                    // console.log('Line from file:', line);
                    // readStream.close();
                    // readStream.destroy();
                    if (lineCount != 1) {
                        // console.log(line);
                        tmpObj.html = tmpObj.html + "   " + line;
                        lineCount++;
                    }


                });

                output_lineReader.on('end', function () {
                    console.log("End");
                    data = tmpObj;

                    res.send(data);
                });


            }


            tmpObj.html = "" + html_data;



            data = tmpObj;

            res.send(data);

        } else {
            data = {
                html: "error"
            }
            res.send(data);
        }

    });


});

http.listen(3001, function () {
    console.log('listening on *:3001');
});

process.on('SIGINT', function () {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    // some other closing procedures go here
    process.exit();
})

// // app.get('/', function (req, res) {
// //   res.send('Hello World!');
// // //    console.log("test");
// // });
//
// app.listen(3001, function () {
//   console.log('Example app listening on port 3001!');
// });


function checkLogRegex(str) {
    var re1 = '((?:http|https)(?::\\/{2}[\\w]+)(?:[\\/|\\.]?)(?:[^\\s"]*))'; // HTTP URL 1
    var re2 = '(\\s+)'; // White Space 1
    var re3 = '(\\d+)'; // Integer Number 1
    var re4 = '(\\s+)'; // White Space 2
    var re5 = '(\\d+)'; // Integer Number 2

    var p = new RegExp(re1 + re2 + re3 + re4 + re5, ["i"]);
    var m = p.exec(str);
    if (m != null) {
        return true;
    }
}

function parseParameters(str, path) {
    var re1 = '((?:http|https)(?::\\/{2}[\\w]+)(?:[\\/|\\.]?)(?:[^\\s"]*))'; // HTTP URL 1
    var re2 = '(\\s+)'; // White Space 1
    var re3 = '(\\d+)'; // Integer Number 1
    var re4 = '(\\s+)'; // White Space 2
    var re5 = '(\\d+)'; // Integer Number 2

    var p = new RegExp(re1 + re2 + re3 + re4 + re5, ["i"]);
    var m = p.exec(str);
    if (m != null) {
        var httpurl1 = m[1];
        var ws1 = m[2];
        var int1 = m[3];
        var ws2 = m[4];
        var int2 = m[5];
        console.log("URL>>>>>" + httpurl1.replace(/</, "&lt;"));
        console.log("TIMESTAMP>>>>>" + int1.replace(/</, "&lt;"));
        // console.log("STATUS CODE>>>>>"+int2.replace(/</,"&lt;"))

        //Create a DB model with values url, timestamp, path
        //if older version available in all_files with same url
        //get old url - path and delete it from all_files & delete the entry
        //copy the new file into the path - add db entry



        // var db = mongoose.connection;
        //
        // db.once('open', function() {
        // we're connected!

        var url_value = httpurl1.replace(/</, "&lt;");
        var version_value = parseInt(int1.replace(/</, "&lt;"));
        var path_value = path;



        var HTMLModel = require('./model/htmlmodel');


        HTMLModel.count({
            url: url_value,
            version: version_value
        }, function (err, c) {

            var fileName = "";
            var fname_re1 = '(html_repo)'; // Variable Name 1
            var fname_re2 = '((?:\\/[\\w\\.\\-]+)+)'; // Unix Path 1

            var p = new RegExp(fname_re1 + fname_re2, ["i"]);
            var m = p.exec(path_value);
            if (m != null) {

                fileName = m[2];
                // document.write("("+var1.replace(/</,"&lt;")+")"+"("+unixpath1.replace(/</,"&lt;")+")"+"\n");
            }

            if (c == 0) {
                var HTMLItem = new HTMLModel({
                    url: url_value,
                    version: version_value,
                    path: "all_files" + fileName
                });
                HTMLItem.save(function (err, HTMLItem) {

                    if (err) return console.error(err);

                    // HTMLModel.find(function (err, items) {
                    //   if (err) return console.error(err);
                    //   console.log(items);
                    // })



                    fs.createReadStream(path_value).pipe(fs.createWriteStream("all_files" + fileName));

                    //Code to restrict 3 files
                    // HTMLModel.count({url: url_value}, function(err, c) {
                    //      console.log('Count for '+url_value+' is ' + c);
                    //
                    //      if(parseInt(c) > 3){
                    //
                    //        HTMLModel.find({url: url_value}).sort({version : 1}).limit((parseInt(c)-3)).remove().exec(function(err,result){
                    //           if (err) {return err;}
                    //
                    //           // do stuff with maxResult[0]
                    //           HTMLModel.count({url: url_value}, function(err, c) {
                    //                console.log('Count for '+url_value+' is ' + c);
                    //                fs.unlinkSync(path_value);
                    //           });
                    //
                    //       });
                    //
                    //      }
                    // });

                    // HTMLModel.find({url: url_value}, null, {sort: {version: -1}}, function(err, docs) {
                    //
                    //    console.log('Items are  is ' + docs);
                    //
                    // });


                    //Code to remove the lease valued
                    // HTMLModel.find({url: url_value}).sort({version : 1}).limit(1).remove().exec(function(err,result){
                    //     if (err) {return err;}
                    //
                    //     // do stuff with maxResult[0]
                    //     HTMLModel.count({url: url_value}, function(err, c) {
                    //          console.log('Count for '+url_value+' is ' + c);
                    //     });
                    //
                    // });

                });



            } else {
                fs.unlinkSync(path_value);
            }


        });


        // console.log(silence.name); // 'Silence'
        // HTMLItem.speak();




    }
}