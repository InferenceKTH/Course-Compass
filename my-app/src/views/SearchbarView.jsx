import React, { useState, useEffect } from "react";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import project_logo from "../assets/project_icon.png";
import FavouritesDropdown from "./Components/FavouriteDropdown.jsx";

/**
 * Displays a searchbar, which accepts user input, e.g. a course id.
 * @param {*} props 
 */
export function SearchbarView(props) {
//   const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [showFavourites, setShowFavourites] = useState(false);

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSearch = (query) => {
    props.resetScrollPosition();
    props.setSearchQuery(query);
    props.searchCourses(query);
  };

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
  };

    const handleClickOutside = (e) => {
        if (!e.target.closest('.favourites-container')) {
            setShowFavourites(false);
        }
    };

  return (
    <div
        className=" w-full sm:px-6 sm:py-6 pt-4 pb-4 sm:flex p-2 items-center sm:justify-between"
         onClick={handleClickOutside}>
      <a href="https://course-compass.se/"
         className="flex justify-center sm:h-[90px] h-[120px] w-auto ">
        <img src={project_logo} className="h-[90px] w-auto" alt="KTH Logo" />
      </a>

    <div className="flex justify-center sm:pr-20">
      <input
        type="text"
        placeholder="Search for courses..."
        value={props.searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="sm:w-[400px] max-w-full h-[44px] pl-4 pr-4 bg-white text-black rounded-full "
      />
    </div>

      <div className=" flex sm:gap-4 gap-1 pt-4 sm:pr-0">
        {props.share}
        <a
          className="flex items-center justify-center w-[120px] h-[44px] bg-[#003399] text-white rounded-full border border-[#000061] cursor-pointer hover:bg-[#001a4d] transition-all duration-200"
          href = "https://inferencekth.github.io/Course-Compass/"
          target="_blank"
          rel="noopener noreferrer"
          >
          About us
        </a>

                <div className="relative favourites-container">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowFavourites(!showFavourites);
                        }}
                        className={`w-[120px] h-[44px] ${
                            !showFavourites
                            ? 'bg-[#003399] text-white rounded-full border border-[#000061] cursor-pointer hover:bg-[#001a4d] transition-all duration-200'
                            : 'bg-[#003399]     rounded-full border border-red-600  transition-all duration-200 cursor-pointer text-red-600 hover:bg-red-600 hover:text-white border-solid font-bold'
                            // cursor-pointer text-red-600 hover:bg-red-600 hover:text-white border-r border-solid border-violet-400 font-semibold transition-colors
                        
                        }`}>
                        {showFavourites? "Close":"Favourites"}
                    </button>
                    {showFavourites && (
                        <FavouritesDropdown
                            {...props}
                            onClick={
                                    (e) => e.stopPropagation()           
                            }
                        />
                    )}
                </div>

          <div className=" flex items-center cursor-pointer">
              {user ? (
                  <button
                      onClick={handleSignOut}
                      className="w-[120px] h-[44px] bg-[#003399] text-white rounded-full border border-[#000061] cursor-pointer hover:bg-[#001a4d] transition-all duration-200">
                      Sign out
                  </button>
              ) : (
                  <button
                      onClick={handleSignIn}
                      className="w-auto min-w-[120px] h-[44px] bg-[#003399] text-white text-sm rounded-full border border-[#001a4d] cursor-pointer hover:bg-[#001a4d] transition-all duration-200 flex items-center justify-center px-4">
                      Sign in with Google
                  </button>

              )}

              {user && (
                  <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-[44px] h-[44px] rounded-full border border-[#000061] ml-2"
                  />
              )}

          </div>


      </div>
    </div>
  );
}

export default SearchbarView;
