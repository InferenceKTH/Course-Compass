import React, { useState, useEffect } from 'react';
import { SidebarPresenter } from '../presenters/SidebarPresenter.jsx';
import { SearchbarPresenter } from '../presenters/SearchbarPresenter.jsx';
import { ListViewPresenter } from '../presenters/ListViewPresenter.jsx';
import { FilterPresenter } from "../presenters/FilterPresenter.jsx";
import { slide as Menu } from "react-burger-menu";

/**
 * Contains the root of our one-page app.
 * All root elements (Menu, Sidebar, Filter, List, Searchbar) are initialized here.
 *
 * @param {object} model The reactive model used in the application
 * @returns
 */
function App({ model }) {
	const [sidebarIsOpen, setSidebarIsOpen] = useState(model.sidebarIsOpen);

	useEffect(() => {
		const clearStorageOnUnload = () => {
		  localStorage.removeItem("filterOptions");
		};
	
		window.addEventListener("unload", clearStorageOnUnload);
	
		return () => {
		  window.removeEventListener("unload", clearStorageOnUnload);
		};
	  }, []);
	
	useState(() => {
		if (window.innerWidth < 700) {
			setSidebarIsOpen(false);
		}
	});

	return (
		/* The sidebar styling(under the menu)*/
		<div className=" flex h-screen w-screen bg-gradient-to-t from-[#4f3646] to-[#6747c0] overflow-hidden">
			{/* If sidebar is open, set length to 400px, else it should not be visible  */}
			<div
				className={`${sidebarIsOpen ? "w-[400px] min-w-[300px]" : "w-[50px]"}`}
			>
				<Menu
					width={
						window.innerWidth < 700
							? "100%"
							: Math.min(Math.max(window.innerWidth * 0.26, 300), 400)
					}
					isOpen={sidebarIsOpen}
					onStateChange={(state) => setSidebarIsOpen(state.isOpen)}
					className="bg-gradient-to-t from-[#4f3646] to-[#6747c0] z-0 "
					noOverlay
					styles={{
						bmMenuWrap: {
							zIndex: "10",
						},
						bmBurgerButton: {
							position: "absolute",
							top: "20px",
							left: "8px",
							width: "36px",
							height: "30px",
							zIndex: "20",
						},
					}}
					customBurgerIcon={
						<img src="https://img.icons8.com/ios-filled/50/ffffff/menu-2.png" />
					}
				>
					<SidebarPresenter model={model} />
				</Menu>
			</div>

			<div className="flex-1 h-full flex flex-col ">
				<div className="flex items-center bg-gradient-to-t  from-[#6246a8] to-[#6747c0] text-white">
					<SearchbarPresenter model={model} />
				</div>

				<div className="flex sm:flex-auto h-screen w-screen sm:w-full bg-gradient-to-t from-[#4f3646] to-[#6747c0] overflow-hidden">
					<ListViewPresenter model={model} />
				</div>

				<FilterPresenter model={model} />
			</div>
		</div>
	);
}

export default App;
