const mongoose = require('mongoose')

const authSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    email:String,
    password:String,
    role:String
})

authSchema.statics.findByEmail = function (email) {
    return this.findOne({ email });
  };


module.exports = mongoose.model("Auth",authSchema)