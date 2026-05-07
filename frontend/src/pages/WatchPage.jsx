import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useContentStore } from "../store/content";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ORIGINAL_IMG_BASE_URL } from "../../../../../../Downloads/mern-netflix-clone-master/frontend/src/utils/constants";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import { formatReleaseDate } from "../utils/dateFunction";
import WatchPageSkeleton from "../components/WatchPageSkeleton";


const WatchPage = () => {
  const { id } = useParams();
  const [trailers, setTrailers] = useState([]);
  const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  const [similarContent, setSimilarContent] = useState([]);
  const { contentType } = useContentStore();
  const sliderRef=useRef(null);
  
  useEffect(() => {
    const getTrailers = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/trailers`);
        setTrailers(res.data.trailers);
      } catch (error) {
        if (error.message.includes("404")) setTrailers([]);
      }
    };
    getTrailers();
  }, [contentType, id]);
  useEffect(() => {
    const getSimilarContent = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/similar`);
        setSimilarContent(res.data.similar);
      } catch (error) {
        if (error.message.includes("404")) setSimilarContent([]);
      }
    };
    getSimilarContent();
  }, [contentType, id]);
  useEffect(() => {
    const getContentDetails = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/details`);
        setContent(res.data.content);
      } catch (error) {
        if (error.message.includes("404")) setContent(null);
      } finally {
        setLoading(false);
      }
    };
    getContentDetails();
  }, [contentType, id]);
  const handleNext = () => {
    if (currentTrailerIdx < trailers.length - 1)
      setCurrentTrailerIdx(currentTrailerIdx + 1);
  };
  const handlePrev = () => {
    if (currentTrailerIdx > 0) setCurrentTrailerIdx(currentTrailerIdx - 1);
  };
   const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };
  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };
  if(loading) return (
    <div className="min-h-screen bg-black p-10">
        <WatchPageSkeleton />
    </div>
  )
  if(!content) {
    return (
        <div className="bg-black text-white h-screen">
            <div className="max-w-6xl mx-auto">
                <Navbar />
                <div className="text-center mx-auto px-4 py-8 h-full mt-40">
                    <h2 className=" text-2xl sm:text-5xl font-bold text-balance">Content not found 😢</h2></div>
                </div>
        </div>
    )
  }
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="mx-auto container px-4 py-8 h-full">
        <Navbar />
        {trailers.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <button
              className={`bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded ${
                currentTrailerIdx == 0 ? "opacity-50 cursor-not-allowed" : ""
              }}
                    `}
              disabled={currentTrailerIdx === 0}
              onClick={handlePrev}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className={`bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded ${
                currentTrailerIdx == trailers.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }}
                    `}
              disabled={currentTrailerIdx === trailers.length - 1}
              onClick={handleNext}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
        <div className="aspect-video mb-8 p-2 sm:px-10 md:px-32">
          {trailers.length > 0 && trailers[currentTrailerIdx] && (
            <iframe
              key={trailers[currentTrailerIdx].key}
              className="w-full h-full mx-auto rounded-lg"
              src={`https://www.youtube.com/embed/${trailers[currentTrailerIdx].key}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          {trailers.length === 0 && (
            <h2 className="text-xl text-center mt-5">
              No Trailers available for{" "}
              <span className="font-bold text-red-600">
                {content?.title || content?.name}
              </span>{" "}
              😢
            </h2>
          )}
        </div>
        {/* Movie Details  */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-20 max-w-6xl mx-auto">
            <div className="mb-4 md:mb-0">
                <h2 className="text-5xl font-bold text-balance">{content?.title || content?.name}</h2>
                <p className="mt-2 text-lg">
                    {formatReleaseDate(content?.release_date || content?.first_air_date)} | {" "}
                    {content?.adult?(
                        <span className="text-red-600">18+</span>
                    ):(
                        <span className="text-green-600">PG-13</span>
                    )}{" "}
                </p>
                <p className="mt-4 text-lg">{content?.overview}</p>
            </div>
            <img src={ORIGINAL_IMG_BASE_URL+content?.poster_path} alt="Poster Image" className="max-h-[600px] rounded-md"/>
        </div>
        {similarContent.length>0 && (
            <div className="mt-12 max-w-5xl mx-auto relative">
                <h3 className="text-3xl font-bold mb-4">
                    Similar Movies/Tv Show
                </h3>
                <div className="flex overflow-x-scroll no-scrollbar gap-4 pb-4 group" ref={sliderRef}>
                    {similarContent.map((content)=>{
                        if(content.poster_path ===null)return null;
                        return (
                            <Link key={content.id} to={`/watch/${content.id}`}
                        className="w-52 flex-none">
                            <img src={SMALL_IMG_BASE_URL+content?.poster_path} alt="Poster Path"
                             className="w-full h-full rounded-md"/>
                             <h4 className="mt-2 text-lg font-semibold">{content.title || content.name}</h4>
                        </Link>
                        )
                    }
                    )}
                    <button
            className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center size-12 rounded-full bg-black/50 hover:bg-red-600 text-white z-10 transition"
            onClick={scrollLeft}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="absolute top-1/2 -translate-y-1/2 right-0 md:right-0 flex items-center justify-center size-12 rounded-full bg-black/50 hover:bg-red-600 text-white z-10 transition"
            onClick={scrollRight}
          >
            <ChevronRight size={24} />
          </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage;
