var getAllNames = {};

var HTMLModel = require('./../model/htmlmodel');

getAllNames.execute = function (res) {
    HTMLModel.find(function (err, items) {
        if (err) return console.error(err);
        //        console.log(items);

        var result = [];

        for (var i = 0; i < items.length; i++) {
            var tmp_obj = {};

            tmp_obj.url = items[i]["url"];

            result.push(tmp_obj);
        }

        //        console.log(result);

        var data = {};
        data.result = result;

        //        return data;
        res.send(data);

    });


}



module.exports = getAllNames;