var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
        "Name": { type: String, required: true },
        "Password": { type: String, required: true },
        "Username": { type: String, required: true, unique: true },
        "Role": { type: String, required: true }
    })

var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
