const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage}); // multer({ dest: "uploads/" }) for local storage


router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
);

//New Route
router.get("/new", isLoggedIn,listingController.renderNewForm);

router
    .route("/:id")
    .get( wrapAsync(listingController.showListing))
    .put( 
        isLoggedIn,
        isOwner,
         upload.single('listing[image]'),
         validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete( 
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );


    


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,listingController.renderEditForm);

//Update Route
// router.put("/:id", isLoggedIn,async (req, res) => {
//   let { id } = req.params;
//     let listing=await Listing.findById(id);
//   if(!listing.owner._id.equals(res.locals.currUser._id)){
//     req.flash("error","You dont have permission to edit ");
//     return res.redirect(`/listings/${id}`);
//   }
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   req.flash("success","Listing Updated!");
//   res.redirect(`/listings/${id}`);
// });


module.exports=router;