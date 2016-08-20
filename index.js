// var express = require('express');
// var app = express();
var app = require('express')();
var http = require('http').Server(app);
var chokidar = require('chokidar');
var fs = require('fs');

var watcher = chokidar.watch('html_repo', {ignored: /[\/\\]\./, persistent: true});

watcher
  .on('add', function(path) {
    console.log('File', path, 'has been added');
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
        if(lineCount == 1){
          console.log(line);
          lineCount++;
        }

    });
  })
  .on('addDir', function(path) {console.log('Directory', path, 'has been added');})
  .on('change', function(path) {console.log('File', path, 'has been changed');})
  .on('unlink', function(path) {console.log('File', path, 'has been removed');})
  .on('unlinkDir', function(path) {console.log('Directory', path, 'has been removed');})
  .on('error', function(error) {console.error('Error happened', error);})

// 'add', 'addDir' and 'change' events also receive stat() results as second argument.
// http://nodejs.org/api/fs.html#fs_class_fs_stats
watcher.on('change', function(path, stats) {
  console.log('File', path, 'changed size to', stats.size);

});

// require('chokidar').watch('html_repo', {ignored: /[\/\\]\./}).on('all', function(event, path) {
//   console.log(event, path);
// });

app.get('/', function(req, res){
  res.send('console running!');
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});

process.on( 'SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  // some other closing procedures go here
  process.exit( );
})

// // app.get('/', function (req, res) {
// //   res.send('Hello World!');
// // //    console.log("test");
// // });
//
// app.listen(3001, function () {
//   console.log('Example app listening on port 3001!');
// });
