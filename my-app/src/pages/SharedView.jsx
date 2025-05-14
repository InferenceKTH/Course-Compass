/**
 * The SharedView processes a URL containing a favourite selection 
 * and starts the main app with the given parameters.
 */

import React, { useEffect } from "react";
import App from "./App.jsx";

function SharedView({ model }) {
	useEffect(() => {
		const processFavouritesFromURL = () => {
			const hash = window.location.hash;
			const queryString = hash.includes("?") ? hash.split("?")[1] : "";
			const params = new URLSearchParams(queryString);
			const favCodes = (params.get("favs") || "").split(",").filter(Boolean);

			if (!model.courses || model.courses.length === 0) return;

			const favCourses = favCodes
				.map((code) => model.getCourse(code))
				.filter(Boolean);

			model.favourites = favCourses;
		};

		const interval = setInterval(() => {
			if (model.courses && model.courses.length > 0) {
				processFavouritesFromURL();
				clearInterval(interval);
			}
		}, 200);

		return () => clearInterval(interval);
	}, [model]);

	return <App model={model} />;
}

export default SharedView;
