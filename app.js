const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const quizRoutes = require('./routes/quizRoutes');

const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.dburl)
  .then((result) => {
    app.listen(process.env.PORT, () => {
      console.log("Connected to database and server is running on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });


app.use('/api/users', authRoutes);
app.use('/api', quizRoutes);

app.use("/", (req, res) => {
  res.json({ msg: "success" });
});

app.use((error, req, res, next) => {
  console.error("Error:", error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});
