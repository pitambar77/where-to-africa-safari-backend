const tripSchema = new mongoose.Schema({
  destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
  title: String,
  subtitle: String,
  location: String,
  image: String,
  duration: String,
  price: String,
  rating: Number,
  description: String,
  gallery: [String],
  itinerary: [
    { 
    day: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  accommodationName: { type: String, required: true },
  image: { type: String }, // Cloudinary URL
  imagePublicId: { type: String }, // store Cloudinary public_id for deletion
     },
  ],
});
