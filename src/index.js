// NPM Package
import  express  from "express";
import cors from "cors";

// Local Package
import {reviewRoute} from "./routes/review"

const port = process.env.port || 8000;
const app = express();

app.use(cors());
app.use(express.json)



//API ROUTE
app.use('/review', review)