const router = require("express").Router();
const Listing = require("../models/Listing");
//----create listing
router.post("/", async (req, res) => {
  const newListing = new Listing(req.body);
  try {
    const savedListing = await newListing.save();
    res.status(200).json(savedListing);
  } catch (err) {
    res.status(500).json(err);
  }
});
//----get all listings
router.get("/", async (req, res) => {
    try {
      const listings = await Listing.find();
      res.status(200).json(listings);
    } catch (err) {
      res.status(500).json(err);
    }
  });
//---- delete listing
router.delete("/:id", async (req, res) => {
  try{
    const id = req.params.id;
    const result = await Listing.findByIdAndDelete(id);
    res.send(result);
  }catch(err){
    console.log(err.msg);
  }
});
//---- patch listing
router.patch('/:id', async (req, res)=>{
  try{
    const id = req.params.id;
    const updates = req.body;
    const result = await Listing.findByIdAndUpdate(id, updates);
    res.send(result);
  }catch(err){
    console.log(err.msg);
  }
});


module.exports = router;
