var mongoose = require('mongoose');

//Lets connect to our database using the DB server URL.
mongoose.connect('mongodb://localhost:27017/MongoD');

/**
 * Lets define our Model for User entity. This model represents a collection in the database.
 * We define the possible schema of User document and data types of each field.
 * */
var User = mongoose.model('User', {name: String, roles: Array, age: Number});

/**
 * Lets Use our Models
 * */

// //Lets create a new user
// var user1 = new User({name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']});
//
// //Some modifications in user object
// user1.name = user1.name.toUpperCase();
//
// //Lets try to print and see it. You will see _id is assigned.
// console.log(user1);
//
// //Lets save it
// user1.save(function (err, userObj) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('saved successfully:', userObj);
//   }
// });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!

    var kittySchema = mongoose.Schema({
      name: String
    });

    kittySchema.methods.speak = function () {
      var greeting = this.name
        ? "Meow name is " + this.name
        : "I don't have a name";
      // console.log(greeting);
    }


    var Kitten = mongoose.model('Kitten', kittySchema);

    var silence = new Kitten({ name: 'Silence3' });
    // console.log(silence.name); // 'Silence'
    silence.speak();

    silence.save(function (err, silence) {
      if (err) return console.error(err);
      silence.speak();
      Kitten.count({name: 'Silence3'}, function(err, c) {
           console.log('Count is ' + c);
      });
    });

    // Kitten.find(function (err, kittens) {
    //   if (err) return console.error(err);
    //   console.log(kittens);
    // })
    //
    // Kitten.find({ name: /^Silence/ }, function(data){
    //   // console.log(err);
    //   // console.log(data);
    //   // console.log('callback');
    // });






});
