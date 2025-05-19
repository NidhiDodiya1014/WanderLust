const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const app = express()
const methodOverride = require("method-override")
const Listing = require("./models/listing")
const ejsMate = require("ejs-mate")

// Database connection
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust")
}

main()
  .then(() => console.log("Connected to DB ✅"))
  .catch((err) => console.log("Database connection error:", err))

// App configuration
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)

// Server start
const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Server is running on port ${port} 🚀`)
})

// Routes
app.get("/", (req, res) => {
  res.redirect("/listings")
})

// Get all listings
app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find()
    res.render("./Listings/index.ejs", { allListings })
  } catch (error) {
    console.error("Error fetching listings:", error)
    res.status(500).send("An error occurred while fetching listings")
  }
})

// Create new listing form
app.get("/listing/new", (req, res) => {
  res.render("./Listings/createListing.ejs")
})

// Create new listing
app.post("/listings", async (req, res) => {
  try {
    const { title, description, price, location, country, image } = req.body
    const newListing = new Listing({
      title,
      description,
      price,
      location,
      country,
      image,
    })
    await newListing.save()
    res.redirect("/listings")
  } catch (error) {
    console.error("Error creating listing:", error)
    res.status(500).send("An error occurred while creating the listing")
  }
})

// Delete listing
app.delete("/listing/:id", async (req, res) => {
  try {
    const id = req.params.id
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
  } catch (error) {
    console.error("Error deleting listing:", error)
    res.status(500).send("An error occurred while deleting the listing")
  }
})

// View listing details
app.get("/listing/:id/view", async (req, res) => {
  try {
    const id = req.params.id
    const ListingP = await Listing.findById(id)
    if (!ListingP) {
      return res.status(404).send("Listing not found")
    }
    res.render("./Listings/viewListing.ejs", { ListingP })
  } catch (error) {
    console.error("Error viewing listing:", error)
    res.status(500).send("An error occurred while viewing the listing")
  }
})

// Edit listing form
app.get("/listing/:id/edit", async (req, res) => {
  try {
    const id = req.params.id
    const listing = await Listing.findById(id)
    if (!listing) {
      return res.status(404).send("Listing not found")
    }
    res.render("./Listings/editListing.ejs", { listing })
  } catch (error) {
    console.error("Error editing listing:", error)
    res.status(500).send("An error occurred while editing the listing")
  }
})

// Update listing
app.put("/listings/:id", async (req, res) => {
  try {
    const { title, description, price, location, country, image } = req.body
    const id = req.params.id
    await Listing.findByIdAndUpdate(id, { title, description, price, location, country, image })
    res.redirect("/listings")
  } catch (error) {
    console.error("Error updating listing:", error)
    res.status(500).send("An error occurred while updating the listing")
  }
})

// API routes for AJAX requests
app.get("/api/listings", async (req, res) => {
  try {
    const listings = await Listing.find()
    res.json(listings)
  } catch (error) {
    console.error("API error:", error)
    res.status(500).json({ error: "Failed to fetch listings" })
  }
})

// 404 route
app.use((req, res) => {
  res.status(404).render("error.ejs", {
    errorCode: 404,
    errorMessage: "The page you're looking for doesn't exist",
  })
})
