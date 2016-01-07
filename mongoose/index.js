var mongoose = require('mongoose');

var options = {
    user: 'lost',
    pass: 'b6DNfHABKU'
};

mongoose.connect('mongodb://localhost/lost', options, function (err) {
    if (err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});