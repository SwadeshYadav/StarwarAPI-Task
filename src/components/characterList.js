import { useState, useEffect } from 'react';
import CharacterDetail from './characterDetail';


const CharacterList = () => {
  const [loader, setLoader] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [characters, setCharacters] = useState([]);
  const [movies, setMovies] = useState([]);
  const [species, setSpecies] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedMovieurl, setSelectedMovieurl] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [selectedBirthYearMin, setSelectedBirthYearMin] = useState('');
  const [selectedBirthYearMax, setSelectedBirthYearMax] = useState('');
  useEffect(() => {
    const fetchMovies = async () => {
      const cacheData = localStorage.getItem("cacheData")
      if (cacheData) {
        setMovies(JSON.parse(cacheData))
      }
      else {
        try {
          const response = await fetch('https://swapi.dev/api/films/');
          const data = await response.json();
          const movieTitles = data.results.map((movie) => {
            return {
              title: movie.title,
              url: movie.url
            };
          });
          setMovies(movieTitles);
          localStorage.setItem("cacheData", JSON.stringify(movieTitles))

        } catch (error) {
          console.error('Error fetching movies:', error);
        }
      }
    };

    const fetchSpecies = async () => {
      try {
        const response = await fetch('https://swapi.dev/api/species/');
        const data = await response.json();
        const speciesNames = data.results.map((species) => {
          return {
            name: species.name,
            url: species.url
          };
        });
        setSpecies(speciesNames);
      } catch (error) {
        console.error('Error fetching species:', error);
      }
    };


    fetchMovies();
    fetchSpecies();
  }, []);
  const fetchCharacters = async (page) => {
    setLoader(true)
    const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
    const data = await response.json();
    setCharacters(data.results);
    setLoader(false)
    setTotalPages(Math.ceil(data.count / 10));
  };
  useEffect(() => {
    fetchCharacters(currentPage);
  }, [currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleJumpToPage = (page) => {
    setCurrentPage(page);
  };


  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
  };

  const handleCloseModal = () => {
    setSelectedCharacter(null);
  };

  const handleMovieChange = (event) => {
    setSelectedMovie(event.target.value);
  };

  const handleSpeciesChange = (event) => {
    setSelectedSpecies(event.target.value);
  };

  const handleBirthYearMinChange = (event) => {
    setSelectedBirthYearMin(event.target.value);
  };

  const handleBirthYearMaxChange = (event) => {
    setSelectedBirthYearMax(event.target.value);
  };

  const filteredCharacters = characters.filter((character) => {
    if (selectedMovie && !character.films.includes(selectedMovie)) {
      return false;
    }
    if (selectedSpecies && !character.species.includes(selectedSpecies)) {
      return false;
    }

    if (selectedBirthYearMin && parseInt(character.birth_year) < parseInt(selectedBirthYearMin)) {
      return false;
    }

    if (selectedBirthYearMax && parseInt(character.birth_year) > parseInt(selectedBirthYearMax)) {
      return false;
    }

    return true;
  });

  console.log("filteredCharacters", filteredCharacters)
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Star Wars Characters</h1>
      <div className="flex">   <div className="flex items-center mb-4">
        <label htmlFor="movieSelect" className="mr-2">
          Movie:
        </label>
        <select
          id="movieSelect"
          value={selectedMovie}
          onChange={handleMovieChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All</option>
          {movies.map((movie) => (
            <option value={movie.url}>
              {movie.title}
            </option>
          ))}
        </select>
      </div>
        <div className="flex items-center mb-4">
          <label htmlFor="speciesSelect" className="mr-2">
            Species:
          </label>
          <select
            id="speciesSelect"
            value={selectedSpecies}
            onChange={handleSpeciesChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">All</option>
            {species.map((sp) => (
              <option key={sp} value={sp.url}>
                {sp.name}
              </option>
            ))}
          </select>
        </div></div>

      <div className="flex items-center mb-4">
        <label htmlFor="birthYearMin" className="mr-2">
          Birth Year Range:
        </label>
        <input
          type="text"
          id="birthYearMin"
          placeholder="Min"
          value={selectedBirthYearMin}
          onChange={handleBirthYearMinChange}
          className="p-2 border border-gray-300 rounded mr-2"
        />
        -
        <input
          type="text"
          id="birthYearMax"
          placeholder="Max"
          value={selectedBirthYearMax}
          onChange={handleBirthYearMaxChange}
          className="p-2 border border-gray-300 rounded ml-2"
        />
      </div>

      {filteredCharacters.length !== 0 ? <ul className="grid grid-cols-1 gap-4">
        {filteredCharacters.map((character, index) => (
          <li
            key={index}
            className="bg-gray-100 p-4 rounded-md cursor-pointer"
            onClick={() => handleCharacterClick(character)}
          >
              {character.name}
        </li>
        ))}
      </ul> : <span>No data on this page</span>}
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div>
          <div className="mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`mx-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ${index + 1 === currentPage ? 'bg-gray-500' : ''
                  }`}
                onClick={() => handleJumpToPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="text-center"> Page {currentPage} of {totalPages}</div>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>




      {selectedCharacter && (
        <CharacterDetail character={selectedCharacter} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default CharacterList;
