import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './db/index.js'
import accommodationRoutes from './routes/accomodationRoutes/accommodationRoutes.js'
import itineraryRoutes from './routes/itineraryRoutes/itineraryRoutes.js'
// import experienceRoutes from './routes/experienceRoutes/experienceRoutes.js'

import destinationRoutes from './routes/destinationRoutes.js'
import tripRoutes from './routes/tripRoutes.js'
import experienceRoutes from './routes/experienceRoutes.js'
// import accommodationRoutes from './routes/accommodationRoutes.js'
import travelguideRoutes from './routes/travelguideRoutes/travelguideRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import authRoutes from "./routes/authRoutes.js";
import seoRoutes from "./routes/seoRoutes/seoRoutes.js"
import experiencelandingRoutes from "./routes/experiencelandingRoutes/experiencelandingRoutes.js"
import itinenarylandingRoutes from "./routes/itinenarylandingRoutes/itinenarylandingRoutes.js"
import accommodationlandingRoutes from "./routes/accommodationlandingRoutes/accommodationlandingRoutes.js"
import aboutusRoutes from './routes/aboutusRoutes/aboutusRoutes.js'
import conservationRoutes from './routes/conservationRoutes/conservationRoutes.js'
import contactuspageRoutes from './routes/contactuspageRoutes/contactuspageRoutes.js'
import homeRoutes from './routes/homeRoutes/homeRoutes.js'
import footerRoutes from './routes/footerRoutes/footerRoutes.js'


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", travelguideRoutes);
app.use("/api/contact", contactRoutes);

app.use("/api/accommodation", accommodationRoutes);
app.use("/api/itinerary", itineraryRoutes);
// app.use("/api/experience", experienceRoutes);
app.use("/api/itinenarylanding", itinenarylandingRoutes);

app.use("/api/destinations", destinationRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/experience", experienceRoutes);

app.use("/api/experiencelanding", experiencelandingRoutes);

app.use("/api/accommodationlanding", accommodationlandingRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/seo", seoRoutes);


app.use("/api/aboutus", aboutusRoutes);
app.use("/api/conservation", conservationRoutes);
app.use("/api/contactus", contactuspageRoutes);
app.use("/api/home",homeRoutes)
app.use("/api/footer",footerRoutes)


connectDB()
const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server running on ${PORT}`))

app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });


});


