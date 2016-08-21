var mongoose = require('mongoose');

//Lets connect to our database using the DB server URL.
mongoose.connect('mongodb://localhost:27017/MongoD');

// var User = mongoose.model('User', {name: String, roles: Array, age: Number});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!

    var HTMLArchiveSchema = mongoose.Schema({
      url: String,
      version:Number,
      path:String
    });

    // HTMLArchiveSchema.methods.speak = function () {
    //   var greeting = this.name
    //     ? "Meow name is " + this.name
    //     : "I don't have a name";
    //   // console.log(greeting);
    // }


    var HTMLModel = mongoose.model('HTMLModel', HTMLArchiveSchema);

    // var HTMLItem = new HTMLModel({ url: 'test data',version:1234 , path:'test path' });
    // // console.log(silence.name); // 'Silence'
    // // HTMLItem.speak();
    //
    // HTMLItem.save(function (err, HTMLItem) {
    //   if (err) return console.error(err);
    //
    // });

    HTMLModel.find(function (err, kittens) {
      if (err) return console.error(err);
      console.log(kittens);
    })

});
