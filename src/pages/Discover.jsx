import { Error, Loader, SongCard } from "../components";
import { genres } from "../assets/constants";
import { useGetSongsByGenreQuery } from "../redux/services/shazamCore";
import { useDispatch, useSelector } from "react-redux";
import { selectGenreListId } from "../redux/features/playerSlice";

const Discover = () => {

  const dispatch = useDispatch();
  // teraz uzywamy useDispatch = hook, który uzywamy, gdy chcemy zmodyfikować state; = chcemy konkretny rodzaj muzyki; i dzięki temu złapiemy zmodyfikowany state

  const { activeSong, isPlaying, genreListId } = useSelector((state) => state.player);
  // useSelector jest hookiem uzywanym po to, aby móc skorzystać z części state'u; czyli mam state, dzielę go jak tort, na kawałki, i korzystam z części, bo akurat ta konkretna część jest mi potrzebna
  //const {} = useSelector((CAKE) => CAKE.VANILLA);
  const { data, isFetching, error } = useGetSongsByGenreQuery(genreListId || "POP");
  const genreTitle = genres.find(({value }) => value === genreListId)?.title;

  if (isFetching) return <Loader title="Loading songs...." />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">Discover {genreTitle}</h2>
        <select
          onChange={(e) => dispatch(selectGenreListId(e.target.value))}
          value={genreListId || 'pop'}
          className="bg-black text-gray-300 p-3 text-sm rounded-lg outline-none sm:mt-0 mt-5"
        >
          {genres.map((genre) => (
            <option key={genre.value} value={genre.value}>
              {genre.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data.map((song, i) => (
          <SongCard
            key={song.key}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data}
            i={i}
          />
        ))}
        ;
      </div>
    </div>
  );
};

export default Discover;
