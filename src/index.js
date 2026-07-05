import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});


const port = Number(process.env.PORT) || 3003;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on http://localhost:${port}`);
    }); 
  })
  .catch((err) => {
    console.error("MonogoDB connection error", err)
  })

