const mongoose = require('mongoose');



const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String,
         required: true,
          unique: true,
          //check if it not a email address by regex
          match: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
        },
    password: {type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);