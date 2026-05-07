import express from 'express';
import authRoutes from './routes/auth.route.js';
import movieRoutes from './routes/movie.route.js';
import tvRoutes from './routes/tv.route.js';
import searchRoutes from './routes/search.route.js';
import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import { protectRoute } from './middleware/protectRoute.js';
import path from 'path';

const app=express();
app.use(express.json()); // will allow us to parse JSON bodies in requests / req.body
app.use(cookieParser()); // will allow us to parse cookies in requests / req.cookies
const PORT=ENV_VARS.PORT
const __dirname=path.resolve();

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/movie",protectRoute,movieRoutes);
app.use("/api/v1/tv",protectRoute,tvRoutes);
app.use("/api/v1/search",protectRoute,searchRoutes);

if(ENV_VARS.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"/frontend/dist")));
}
app.use((req, res) => {
  res.sendFile(path.resolve("frontend", "dist", "index.html"));
});
app.listen(PORT,()=>{
    connectDB();
})
