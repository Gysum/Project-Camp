import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({
  path: "./.env",
});


const port = Number(process.env.PORT) || 3003;



app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
}); 