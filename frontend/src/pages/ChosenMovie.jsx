import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import YouTube from 'react-youtube';
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";

const ChosenMovie = () => {
  const { type, id } = useParams(); 
  const [movieData, setMovieData] = useState(null);
  const [videoId, setVideoId] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await fetch(`${TMDB_BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        setMovieData(data);

        const videoResponse = await fetch(`${TMDB_BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`);
        const videoData = await videoResponse.json();
        const trailer = videoData.results.find(
          (video) => video.site === "YouTube" && video.type === "Trailer"
        );
        if (trailer) {
          setVideoId(trailer.key);
        }
      } catch (error) {
        console.error("Failed to fetch movie data:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`${TMDB_BASE_URL}/${type}/${id}/reviews?api_key=${API_KEY}&language=en-US&page=1`);
        const data = await response.json();
        setReviews(data.results.slice(0, 20));
        setLoadingReviews(false);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchMovieData();
    fetchReviews();
  }, [type, id]);

  if (!movieData) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <MovieCard>
        <div className="card">
          <div className="card_left">
            <img 
              src={movieData.poster_path ? `https://image.tmdb.org/t/p/original${movieData.poster_path}` : ''} 
              alt="cover" 
            />
          </div>

          <div className="card_right">
            <h1>{movieData.name || movieData.title}</h1>
            <div className="card_right__details">
              <ul>
                <li>{movieData.release_date || movieData.first_air_date}</li>
                <li>{movieData.runtime+" min"|| movieData.number_of_seasons} </li>
                <li>{movieData.vote_average} </li>
                <li>{movieData.genres.map(genre => genre.name).join(', ') || 'N/A'}</li>
              </ul>
              <div className="card_right__review">
                <p>{movieData.overview?.split(' ').slice(0, 50).join(' ') + '...'}</p>
              </div>
            </div>
            <div className="card_right__youtube">
              {videoId ? (
                <YouTube
                  videoId={videoId}
                  className="youtube-video"
                  opts={{
                    width: '100%',
                    height: '240px',
                    playerVars: {
                      autoplay: 0,
                      controls: 1,
                      showinfo: 0,
                      modestbranding: 1,
                      rel: 0,
                    },
                  }}
                />
              ) : (
                <p>No trailer available</p>
              )}
            </div>
          </div>
        </div>
      </MovieCard>

      <ReviewSection>
        <h2>Reviews</h2>
        {loadingReviews ? (
          <p>Loading reviews...</p>
        ) : reviews.length > 0 ? (
          reviews.map((review, index) => (
            <ReviewCard key={index}>
              <div className="review_author_info">
                <strong>{review.author || 'N/A'}</strong>
                <span>Rating: {review.author_details.rating || 'N/A'}</span>
              </div>
              <p>{review.content || 'N/A'}</p>
            </ReviewCard>
          ))
        ) : (
          <p>No reviews available for this movie.</p>
        )}
      </ReviewSection>
    </div>
  );
};

const MovieCard = styled.div`
  .card {
    width: 100%;
    height: 400px;
    background: transparent;
    position: relative;
    border-radius: 10px;
    box-shadow: 0px 20px 30px 3px rgba(0, 0, 0, 0.55);
    display: flex;
    overflow: hidden;

    .card_left {
      width: 40%;
      height: 100%;
      overflow: hidden;
      background: transparent;

      img {
        width: 100%;
        height: auto;
        border-radius: 10px 0 0 10px;
        object-fit: cover;
      }
    }

    .card_right {
      width: 60%;
      background: #000000;
      color: white;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;

      h1 {
        font-family: 'Montserrat', sans-serif;
        font-weight: 400;
        font-size: 40px;
        margin: 30px 0 0 0;
        letter-spacing: 1px;
      }

      .card_right__details {
        margin-top: 20px;

        ul {
          list-style-type: none;
          padding: 0;
          margin: 10px 0;
          
          li {
            display: inline;
            color: #e3e3e3;
            font-family: 'Montserrat', sans-serif;
            font-weight: 400;
            font-size: 14px;
            padding-right: 20px;
          }
        }
      }

      .card_right__review {
        p {
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          margin: 10px 0;
          line-height: 20px;
        }
      }

      .card_right__youtube {
        margin-top: 20px;
        .youtube-video {
          width: 100%;
          height: 240px;
          border-radius: 10px;
          overflow: hidden;
        }
      }
    }
  }
`;

const ReviewSection = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #000; 
  border-radius: 10px;
`;

const ReviewCard = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #444; 
  border-radius: 5px;
  background-color: #222;  
  color: #fff;  

  .review_author_info {
    strong {
      display: block;
      font-size: 16px;
      color: #fff;  /* Ensure author name is white */
    }

    span {
      display: block;
      font-size: 14px;
      color: #bbb;  /* Make the rating text color */
    }
  }
`;

export default ChosenMovie;
