const mongoose = require('mongoose')

const inventorySchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    inventoryNumber:String,
    labNumber:String,
    category:String,
    licenceExpiryDate:String,
    status:String,
    comments:String

})

inventorySchema.statics.findByLabNumberAndCategory = function (labNumber,category) {
    return this.find({ labNumber,category });
  };

  inventorySchema.statics.findByInventoryNumber = function (inventoryNumber) {
    return this.findOne({ inventoryNumber });
  };

  inventorySchema.statics.findByLabNumber = function (labNumber){
    return this.findOne({labNumber})
  }


module.exports = mongoose.model("Inventory",inventorySchema)