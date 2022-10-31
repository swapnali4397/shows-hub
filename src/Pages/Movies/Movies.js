import axios from "axios";
import React, { useEffect, useState } from "react";
import Genres from "../../components/Genres";
import CustomPagination from "../../components/Pagination/CustomPagination";
import SingleContent from "../../components/SingleContent/SingleContent";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useGenres from "../../hooks/useGenres";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Movies() {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const genreforURL = useGenres(selectedGenres);

  const fetchMovies = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreforURL}`
    );

    // console.log(data.results);
    setContent(data.results);
    setNumOfPages(data.total_pages);
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchMovies();
    // eslint-disable-next-line
  }, [page, genreforURL]);
  return (
    <div>
      <span className="pageTitle">Discover Movies</span>
      <ThemeProvider theme={darkTheme}>
        <Genres
          type="movie"
          selectedGenres={selectedGenres}
          genres={genres}
          setGenres={setGenres}
          setSelectedGenres={setSelectedGenres}
          setPage={setPage}
          color="primary"
        />
      </ThemeProvider>
      <div className="trending">
        {content &&
          content.map((c) => (
            <SingleContent
              key={c.id}
              id={c.id}
              poster={c.poster_path}
              title={c.title || c.name}
              date={c.release_date || c.first_air_date}
              media_type="movie"
              vote_average={Math.round(c.vote_average * 10) / 10}
            />
          ))}
      </div>
      {numOfPages > 1 && (
        <CustomPagination setPage={setPage} numOfPages={numOfPages} />
      )}
    </div>
  );
}

export default Movies;
