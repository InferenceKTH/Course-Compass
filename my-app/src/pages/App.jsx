import React, { useState } from 'react';
import { SidebarPresenter } from '../presenters/SidebarPresenter.jsx';
import { SearchbarPresenter } from '../presenters/SearchbarPresenter.jsx';
import { ListViewPresenter } from '../presenters/ListViewPresenter.jsx';
import { FilterPresenter } from "../presenters/FilterPresenter.jsx";
import { Routes, Route } from 'react-router-dom';
import SharedView from '../pages/SharedView.jsx';
import { slide as Menu } from 'react-burger-menu';

function MainAppLayout({ model }) {
	const [sidebarIsOpen, setSidebarIsOpen] = useState(true);

	const toggleSidebar = () => {
		setSidebarIsOpen(!sidebarIsOpen);
	}


	return (
			/* The sidebar styling(under the menu)*/
		<div className=" flex h-screen w-screen bg-gradient-to-t from-[#4f3646] to-[#6747c0] overflow-hidden">
			{	/* If sidebar is open, set length to 400px, else it should not be visible  */}
			<div className={`${sidebarIsOpen ? 'w-[400px]' : 'w-0'}`}>
				<Menu
					width={400} // menu width
					isOpen={sidebarIsOpen}
					onStateChange={(state) => setSidebarIsOpen(state.isOpen)}
					className="bg-gradient-to-t from-[#4f3646] to-[#6747c0] z-0 h-screen" // The menu styling
					noOverlay
					styles={{
						bmMenuWrap: {
							zIndex: '10'
						}
					}}
				>
					{/* The menu contents */}
					<SidebarPresenter model={model} />
				</Menu>
			</div>

			<div className="flex-1 h-full flex flex-col ">

				<div className="bg-gradient-to-t from-[#6246a8] to-[#6747c0] text-white">
					<div className="flex items-center">
						{/* The button to open the menu */}
						<button
							onClick={toggleSidebar}
							className="p-2 ml-2 text-white hover:bg-purple-700 rounded"
						>
							<img
								src="https://img.icons8.com/ios-filled/50/ffffff/menu-2.png"
								alt="menu icon"
								className="w-6 h-6"
							/>
						</button>
						<SearchbarPresenter model={model} />
					</div>
				</div>


				<div className="flex-auto border bg-[#121212] relative">
					<ListViewPresenter model={model} />
				</div>

				<FilterPresenter model={model} />
			</div>
		</div>)
}

function App({ model }) {
	return (
		<Routes>
			<Route path="/" element={<MainAppLayout model={model} />} />
			<Route path="/share" element={<SharedView model={model} />} />
		</Routes>
	);
}

export default App;