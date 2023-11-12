const express = require('express');
const Inventory = require('../model/inventory');
const router = express.Router();
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');

router.use(bodyParser.json());

router.post('/register',(req,res,next) =>{

    const inventory = new Inventory({
        _id: new mongoose.Types.ObjectId,
        inventoryNumber:req.body.InventoryNumber,
        labNumber:req.body.LabNumber,
        category:req.body.Category,
        licenceExpiryDate:req.body.LicenceExpiryDate
    })
    console.log(inventory)

    inventory
    .save()
    .then((result) =>{
        res.status(200).json({
            message:"Inventory Registered Successfully",
        })
    })
    .catch((err) => {
        res.status(500).json({
            message:"Something went wrong"
        })
    })


})

router.post('/catalogue',(req,res,next) =>{
    
    Inventory.findByLabNumberAndCategory(req.body.LabNumber,req.body.Category)
    .then((result) =>{
        res.status(200).json({
            result
        })
    }).catch((ex) =>{
            res.status(400).json({
                message:"Details Not Found"
            })
    })

})


router.post('/compliant', (req, res, next) => {
    Inventory.findOne({ inventoryNumber: req.body.InventoryNumber })
        .then((existingInventory) => {
            if (!existingInventory) {
                return res.status(404).json({ message: "Inventory not found" });
            }

            existingInventory.labNumber = req.body.LabNumber || existingInventory.labNumber;
            existingInventory.category = req.body.Category || existingInventory.category;
            existingInventory.comments = req.body.Comments || existingInventory.comments;
            existingInventory.status = "Under Maintenance";

            return existingInventory.save();
        })
        .then((updatedInventory) => {
            res.status(200).json({
                message: "Inventory updated successfully",
                updatedInventory
            });
        })
        .catch((ex) => {
            res.status(400).json({
                message: "Error updating inventory",
                error: ex.message
            });
        });
});


router.get('/getCompliant', (req, res, next) => {
    Inventory.find({ status: "Under Maintenance" })
        .then((existingInventory) => {
            res.status(200).json({
                message: "Inventory Details",
                existingInventory
            });
        })
        .catch((ex) => {
            res.status(400).json({
                message: "Error updating inventory",
                error: ex.message
            });
        });
});

router.put('/updateInventories', async (req, res) => {
    const inventoryUpdates = req.body.complaints.existingInventory;
  
    try {
      const updatedInventories = await Promise.all(
        inventoryUpdates.map(async (update) => {
          const inventoryId = update._id;
  
          // Fetch the existing inventory
          const existingInventory = await Inventory.findById(inventoryId);
  
          if (!existingInventory) {
            throw new Error(`Inventory not found with ID: ${inventoryId}`);
          }
  
          // Update the existing inventory's properties
          existingInventory.labNumber = update.labNumber || existingInventory.labNumber;
          existingInventory.category = update.category || existingInventory.category;
          existingInventory.comments = update.comments || existingInventory.comments;
          existingInventory.status = update.status || existingInventory.status;
  
          // Save the updated inventory
          return existingInventory.save();
        })
      );
  
      res.status(200).json({
        message: "Inventories updated successfully",
        updatedInventories,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error updating inventories",
        error: error.message,
      });
    }
  });
  
  
  

module.exports = router;
