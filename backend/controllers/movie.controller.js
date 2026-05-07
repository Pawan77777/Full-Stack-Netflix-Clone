import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getTrendingMovie(req,res){
    try {
        const data=await fetchFromTMDB("https://api.themoviedb.org/3/trending/movie/day?language=en-US");
        const randomMovie=data.results[Math.floor(Math.random()*data.results?.length)];
        res.json({success:true,content: randomMovie});
    }
    catch (error) {
        console.error("Error in getTrendingMovies controller: " , error.message);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}

export async function getMovieTrailers(req,res){
    const {id}=req.params;
    try {
        const data=await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);
        res.json({success:true,trailers:data.results || []});
    }
    catch (error) {
        if(error.message.includes("404")){
            return res.json({
                success: true,
                trailers: [],
            });
        }
        console.error("Error in getMovieTrailers controller: " , error.message);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}

export async function getMovieDetails(req,res){
    const {id}=req.params;
    try {
        const data=await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`)
        res.status(200).json({success:true,content:data});
    }
    catch (error) {
        if(error.message.includes("404")){
            return res.status(404).send(null);
        }
        console.error("Error in getMovieDetails controller: ",error.message);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}

export async function getSimilarMovies(req,res){
    const {id}=req.params;
    try {
        const data=await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`)
        res.status(200).json({success:true,similar:data.results});
    }
    catch (error) {
        console.log("error occured is : ",error);
        if (error.response?.status === "404") {
            return res.status(200).json({
                success: true,
                similar: [], // fallback instead of crashing
            });
        }
        console.error("Error in getSimilarMovies controller: ",error.message);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}

export async function getMoviesByCategory(req,res){
    const {category}=req.params;
    try {
        const data=await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`)
        res.status(200).json({success:true,content:data.results})
    }
    catch (error) {
        console.error("Error in getMoviesByCategory controller: ",error.message);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}