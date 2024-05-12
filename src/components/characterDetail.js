import { useState, useEffect } from 'react';

const CharacterDetail = ({ character, onClose }) => {
  


  const { name, species, films, starships } = character;
  const [movieTitles, setMovieTitles] = useState([]);
  const [starshipNames, setStarshipNames] = useState([]);
  const [speciesNames, setSpeciesNames] = useState([]);
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    setLoader(true)
    const fetchMovies = async () => {
      const response = await Promise.all(films.map((film) => fetch(film)));
      const movieData = await Promise.all(response.map((res) => res.json()));
      const titles = movieData.map((data) => data.title);
      setMovieTitles(titles);
    };

    const fetchStarships = async () => {
      const response = await Promise.all(
        starships.map((starship) => fetch(starship))
      );
      const starshipData = await Promise.all(response.map((res) => res.json()));
      const names = starshipData.map((data) => data.name);
      setStarshipNames(names);
    };
    const fetchSpecies = async () => {
      const response = await Promise.all(
        species.map((species) => fetch(species))
      );
      const speciesData = await Promise.all(response.map((res) => res.json()));
      const names = speciesData.map((data) => data.name);
      setSpeciesNames(names);
    };

    fetchSpecies();
    fetchMovies();
    fetchStarships();
  }, [films, starships, species]);

  return (
    <>

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-sm mx-auto">
          <h1 className="text-2xl font-bold mb-4">{name}</h1>
          <div>
            <strong>Species:</strong> {speciesNames.join(", ")}
          </div>
          <div>
            <strong>Movies:</strong> {movieTitles.join(", ")}
          </div>
          <div>
            <strong>Spaceships:</strong> {starshipNames.join(", ")}
          </div>
          <div className="mt-6">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

export default CharacterDetail;
