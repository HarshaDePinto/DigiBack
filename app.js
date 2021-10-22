const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const cors = require("cors");
require("dotenv").config();

//import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const mainSlideRoutes = require("./routes/mainSlider");
const saladCategoryRoutes = require("./routes/saladCategory");
const restaurantRoutes = require("./routes/restaurant");
const saladRoutes = require("./routes/salad");
const addonRoutes = require("./routes/addon");
const invoiceRoutes = require("./routes/invoice");
const soupRoutes = require("./routes/soup");
const foodRoutes = require("./routes/food");
const foodCategoryRoutes = require("./routes/foodCategory");
const promotionRoutes = require("./routes/promotion");
const customRoutes = require("./routes/custom");
const inventoryRoutes = require("./routes/inventory");
const recodeRoutes = require("./routes/recode");

//App
const app = express();
require("dotenv").config();

//db connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    createIndexes: true,
  })
  .then(() => console.log("DB Connected"));

mongoose.connection.on("error", (err) => {
  console.log(`DB Connection Error: ${err.message}`);
});

//Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());


//Routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", mainSlideRoutes);
app.use("/api", saladCategoryRoutes);
app.use("/api", restaurantRoutes);
app.use("/api", saladRoutes);
app.use("/api", addonRoutes);
app.use("/api", invoiceRoutes);
app.use("/api", soupRoutes);
app.use("/api", foodRoutes);
app.use("/api", foodCategoryRoutes);
app.use("/api", promotionRoutes);
app.use("/api", customRoutes);
app.use("/api", inventoryRoutes);
app.use("/api", recodeRoutes);
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
