
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


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", travelguideRoutes);

app.use("/api/accommodation", accommodationRoutes);
app.use("/api/itinerary", itineraryRoutes);
// app.use("/api/experience", experienceRoutes);

app.use("/api/destinations", destinationRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/experience", experienceRoutes);
// app.use("/api/accommodations", accommodationRoutes);

connectDB()
const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server running on ${PORT}`))

app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });


});


