import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import {
	get,
	getDatabase,
	ref,
	set,
	onValue,
	onChildRemoved,
	onChildAdded,
	runTransaction,
} from "firebase/database";
import { reaction, toJS } from "mobx";
import { push } from "firebase/database";

/**
 * Firebase configuration and initialization.
 * This code connects to Firebase, sets up authentication and allows to save and fetch courses as well as user data.
 * Data Synchronization and caching are also handled. 
 * The firebase realtime database is used to store courses, user data, and reviews.
 * If you would like to reuse this project, make sure to configure rules as shown in firebas_rules.json.
 */

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCBckVI9nhAP62u5jZJW3F4SLulUv7znis",
	authDomain: "findmynextcourse.firebaseapp.com",
	databaseURL:
		"https://findmynextcourse-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "findmynextcourse",
	storageBucket: "findmynextcourse.firebasestorage.app",
	messagingSenderId: "893484115963",
	appId: "1:893484115963:web:59ac087d280dec919ccd5e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

/**
 * Startup hook to connect the model to Firebase.
 * This function sets up the Firebase connection, fetches initial data and starts listener for syncing data.
 * @param {object} model The reactive model
 */
export async function connectToFirebase(model) {
	await loadCoursesFromCacheOrFirebase(model);
	fetchDepartmentsAndLocations(model);
	startAverageRatingListener(model);
	// setting missing
	// also save filters to local storage
	//
	const options = JSON.parse(localStorage.getItem("filterOptions"));
	const search = localStorage.getItem("search");
	if (options) {
		model.setFilterOptions(options);
	}
	if(search){
		model.setCurrentSearchText(search);
	}

	// automaticaly save filter and search to local storage whenever they change
	reaction(
		() => ({ filterOptions: JSON.stringify(model.filterOptions), search: model.currentSearchText }),
		({ filterOptions, search }) => {
			localStorage.setItem("filterOptions", filterOptions);
			localStorage.setItem("search", search);
		}
	);
	/**
	 * Hook to start synchronization when user is authenticated.
	 */
	onAuthStateChanged(auth, (user) => {
		if (user) {
			model.setUser(user); // Set the user ID once authenticated
			firebaseToModel(model); // Set up listeners for user-specific data
			syncModelToFirebase(model); // Start syncing changes to Firebase
			syncScrollPositionToFirebase(model);
		} else {
			model.setUser(null); // If no user, clear user-specific data
			model.setReady();
		}
	});
	
}

// fetches all relevant information to create the model
async function firebaseToModel(model) {
	const userRef = ref(db, `users/${model.user.uid}`);
	onValue(userRef, async (snapshot) => {
		if (!snapshot.exists()) return;
		const data = snapshot.val();

		// Use a transaction to ensure atomicity
		await runTransaction(userRef, (currentData) => {
			if (currentData) {
				if (data?.favourites) model.setFavourite(data.favourites);
				if (data?.currentSearchText)
					model.setCurrentSearchText(data.currentSearchText);
				// Add other fields as needed
			}
			return currentData; // Return the current data to avoid overwriting
		});
	});
	model.setReady();
}

/**
 * If the userid, favourites or search changes, sync to firebase.
 * @param {object} model reactive model object 
 */
export function syncModelToFirebase(model) {
	reaction(
		() => ({
			userId: model?.user.uid,
			favourites: toJS(model.favourites),
			currentSearchText: toJS(model.currentSearchText),
		}),
		async ({ userId, favourites, currentSearchText }) => {
			if (!userId) return;

			const userRef = ref(db, `users/${userId}`);
			await runTransaction(userRef, (currentData) => {
				// Merge the new data with the existing data
				return {
					...currentData,
					favourites,
					currentSearchText,
				};
			}).catch((error) => {
				console.error("Error syncing model to Firebase:", error);
			});
		}
	);
}

/**
 * Synchronizes the scroll position of the container to Firebase / local storage.
 * @param {object} model 
 * @param {*} containerRef 
 * @returns 
 */
export function syncScrollPositionToFirebase(model, containerRef) {
	if (!containerRef?.current) return;
	let lastSavedPosition = 0;

	// const throttledSet = throttle((scrollPixel) => {
	//     if (model?.user?.uid) {
	//         const userRef = ref(db, `users/${model.user.uid}/scrollPosition`);
	//         set(userRef, scrollPixel).catch(console.error);
	//     }
	// }, 500);

	const handleScroll = () => {
		const scrollTop = containerRef.current.scrollTop;
		// make a 100px threshold
		if (Math.abs(scrollTop - lastSavedPosition) < 100) return;

		lastSavedPosition = scrollTop;
		model.setScrollPosition(scrollTop);
		localStorage.setItem("scrollPosition", scrollTop);
		// throttledSet(scrollTop);
	};

	containerRef.current.addEventListener("scroll", handleScroll);
	return () =>
		containerRef.current?.removeEventListener("scroll", handleScroll);
}

/**
 * Caches the courses to IndexedDB.
 * @param {Array} courses The course array to save
 * @param {number} timestamp The last update of the course array
 */
function saveCoursesToCache(courses, timestamp) {
	const request = indexedDB.open("CourseDB", 1);

	function validateCourseData(course) {
		return course && typeof course === "object" && course.code;
	}

	request.onupgradeneeded = (event) => {
		const db = event.target.result;
		if (!db.objectStoreNames.contains("courses")) {
			db.createObjectStore("courses", { keyPath: "id" });
		}
		if (!db.objectStoreNames.contains("metadata")) {
			db.createObjectStore("metadata", { keyPath: "key" });
		}
	};

	request.onsuccess = (event) => {
		const db = event.target.result;
		const tx = db.transaction(["courses", "metadata"], "readwrite");
		const courseStore = tx.objectStore("courses");
		const metaStore = tx.objectStore("metadata");

		courseStore.clear();
		courses
			.filter(validateCourseData)
			.forEach((course) => courseStore.put(course));
		metaStore.put({ key: "timestamp", value: timestamp });

		tx.oncomplete = () => console.log("Saved courses to IndexedDB");
		tx.onerror = (e) => console.error("IndexedDB save error", e);
	};

	request.onerror = (e) => {
		console.error("Failed to open IndexedDB", e);
	};
}

async function updateLastUpdatedTimestamp() {
	const timestampRef = ref(db, "metadata/lastUpdated");
	await set(timestampRef, Date.now());
}

async function fetchLastUpdatedTimestamp() {
	const timestampRef = ref(db, "metadata/lastUpdated");
	const snapshot = await get(timestampRef);
	return snapshot.exists() ? snapshot.val() : 0;
}

/**
 * Admin function to add a course to the database.
 * @param {Array} course 
 */
export async function addCourse(course) {
	if (!auth.currentUser) throw new Error("User must be authenticated");
	if (!course?.code) throw new Error("Invalid course data");
	if (!course || typeof course !== "object")
		throw new Error("Invalid course object");
	if (!course.code || typeof course.code !== "string")
		throw new Error("Invalid course code");
	const myRef = ref(db, `courses/${course.code}`);
	await set(myRef, course);
	updateLastUpdatedTimestamp();
}

/**
 * Fetches all courses from the database.
 * @returns {Array} Array of courses
 */
export async function fetchAllCourses() {
	const myRef = ref(db, `courses`);
	const snapshot = await get(myRef);
	if (!snapshot.exists()) return [];

	const value = snapshot.val(); // Firebase returns an object where keys are course IDs
	const courses = [];

	for (const id of Object.keys(value)) {
		courses.push({ id, ...value[id] });
	}
	return courses;
}

/**
 * Admin function to upload departments and locations to the database.
 * @param {} departments 
 * @param {*} locations 
 * @returns 
 */
export async function uploadDepartmentsAndLocations(departments, locations) {
	if (departments) {
		const departmentsRef = ref(db, "departments");
		try {
			await set(departmentsRef, departments);
		} catch (error) {
			console.error("Failed to upload departments:", error);
			return false;
		}
	}
	if (locations) {
		const locationsRef = ref(db, "locations");
		try {
			await set(locationsRef, locations);
		} catch (error) {
			console.error("Failed to upload locations:", error);
			return false;
		}
	}
	return true;
}

/**
 * Fetches departments and locations from the database.
 * @param {object} model 
 * @returns {Array} Array of departments and locations
 */
export async function fetchDepartmentsAndLocations(model) {
	const departmentsRef = ref(db, "departments");
	const locationsRef = ref(db, "locations");
	let snapshot = await get(departmentsRef);
	if (snapshot.exists()) {
		const value = snapshot.val();
		const set = new Set();
		for (const id of Object.keys(value)) {
			set.add(value[id]);
		}
		model.setDepartments(Array.from(set));
	}
	snapshot = await get(locationsRef);
	if (snapshot.exists()) {
		const value = snapshot.val();
		const set = new Set();
		for (const id of Object.keys(value)) {
			set.add(value[id]);
		}
		model.setLocations(Array.from(set));
	}
}

/**
 * Try to restore the courses from IndexedDB.
 * @param {object} model 
 * @returns void
 * @throws Error if IndexedDB is not available or no courses are found
 */
async function loadCoursesFromCacheOrFirebase(model) {
	const firebaseTimestamp = await fetchLastUpdatedTimestamp();
	const dbPromise = new Promise((resolve, reject) => {
		const request = indexedDB.open("CourseDB", 1);
		// check if courses and metadata dirs exist
		request.onupgradeneeded = (event) => {
			const db = event.target.result;
			if (!db.objectStoreNames.contains("courses")) {
				db.createObjectStore("courses", { keyPath: "id" });
			}
			if (!db.objectStoreNames.contains("metadata")) {
				db.createObjectStore("metadata", { keyPath: "key" });
			}
		};

		request.onsuccess = (event) => resolve(event.target.result);
		request.onerror = (e) => reject(e);
	});

	try {
		const db = await dbPromise;
		const metaTx = db.transaction("metadata", "readonly");
		const metaStore = metaTx.objectStore("metadata");
		const metaReq = metaStore.get("timestamp");
		const cachedTimestamp = await new Promise((resolve) => {
			metaReq.onsuccess = () => resolve(metaReq.result?.value ?? 0);
			metaReq.onerror = () => resolve(0);
		});

		if (cachedTimestamp === firebaseTimestamp) {
			const courseTx = db.transaction("courses", "readonly");
			const courseStore = courseTx.objectStore("courses");
			const getAllReq = courseStore.getAll();
			const cachedCourses = await new Promise((resolve) => {
				getAllReq.onsuccess = () => resolve(getAllReq.result);
				getAllReq.onerror = () => resolve([]);
			});
			if (!cachedCourses) throw new Error("No courses found in IndexedDB");
			model.setCourses(cachedCourses);
			return;
		}
	} catch (err) {
		console.warn(
			"IndexedDB unavailable, falling back Posting anonymously is possible. Firebase:",
			err
		);
	}

	// fallback: fetch from Firebase
	const courses = await fetchAllCourses();
	model.setCourses(courses);
	saveCoursesToCache(courses, firebaseTimestamp);
}

/**
 * Function to add a review for a course. The firebase rules disallow to have more than one course per person.
 * Adding a review will automatically update the average rating of the course.
 * @param {string} courseCode The course code
 * @param {object} review The review object containing the review data
 * @param {string} review.userName The name of the user
 * @param {string} review.uid The user ID
 * @param {number} review.timestamp The timestamp of the review
 * @param {string} review.text The review text
 * @param {number} review.overallRating The overall rating
 * @param {number} review.difficultyRating The difficulty rating
 * @param {string} review.professorName The name of the professor
 * @param {string} review.grade The grade received
 * @param {boolean} review.recommended Whether the course is recommended
 * @throws {Error} If there is an error adding the review or updating the average rating
 */
export async function addReviewForCourse(courseCode, review) {
	try {
		const reviewsRef = ref(db, `reviews/${courseCode}/${review.uid}`);
		await set(reviewsRef, review);
		const updateCourseAvgRating = httpsCallable(functions, 'updateCourseAvgRating');
   		await updateCourseAvgRating({ courseCode });
		
	} catch (error) {
		console.error(
			"Error when adding a course to firebase or updating the average:",
			error
		);
	}
}

/**
 * Adding a course triggers a firebase function to update the average rating of the course. 
 * This function sets up a listener for the average rating of each course, to update the model onChange.
 * It also fetches the initial average ratings if the model is not initialized.
 * @param {object} model 
 */
function startAverageRatingListener(model) {
	const coursesRef = ref(db, "reviews");

	// Step 1: One-time fetch if model.avgRating is not initialized
	if (!model.avgRating || Object.keys(model.avgRating).length === 0) {
		get(coursesRef).then((snapshot) => {
			if (!snapshot.exists()) return;

			const initialRatings = {};

			snapshot.forEach((courseSnapshot) => {
				const courseCode = courseSnapshot.key;
				const avgRating = courseSnapshot.child("avgRating").val();

				if (avgRating && Array.isArray(avgRating)) {
					initialRatings[courseCode] = avgRating;
				}
			});
			model.setAverageRatings(initialRatings);
		});
	}

	// Step 2: listener for each courses avgRating
	onChildAdded(coursesRef, (courseSnapshot) => {
		const courseCode = courseSnapshot.key;
		const avgRatingRef = ref(db, `reviews/${courseCode}/avgRating`);

		onValue(avgRatingRef, (ratingSnapshot) => {
			if (!ratingSnapshot.exists()) return;

			const rating = ratingSnapshot.val();

			if (typeof rating === "number") {
				model.updateAverageRating(courseCode, rating);
			}
		});
	});

	onChildRemoved(coursesRef, (courseSnapshot) => {
		const courseCode = courseSnapshot.key;
		model.updateAverageRating(courseCode, null);
	});
}

/**
 * Fetches reviews for a specific course. 
 * @param {string} courseCode 
 * @returns 
 */
export async function getReviewsForCourse(courseCode) {
	const reviewsRef = ref(db, `reviews/${courseCode}`);
	const snapshot = await get(reviewsRef);
	if (!snapshot.exists()) return [];
	const reviews = [];
	snapshot.forEach((childSnapshot) => {
		if (childSnapshot.key != "avgRating")
			reviews.push({
				id: childSnapshot.key,
				...childSnapshot.val(),
			});
	});
	return reviews;
}
/**
 * Add a comment to a specific review
 * @param {string} courseCode - Course code (e.g. "A11HIB")
 * @param {string} reviewUserId - The user ID of the person who wrote the main review
 * @param {Object} commentObj - Object with { userName, text, timestamp }
 */
export async function addCommentToReview(courseCode, reviewUserId, commentObj) {
	const commentsRef = ref(db, `reviews/${courseCode}/${reviewUserId}/comments`);
	await push(commentsRef, commentObj);
}

/**
 * Get comments for a specific review
 * @param {string} courseCode 
 * @param {string} reviewUserId 
 * @returns {Promise<Array<Object>>} Array of comments: { id, userName, text, timestamp }
 */
export async function getCommentsForReview(courseCode, reviewUserId) {
	const commentsRef = ref(db, `reviews/${courseCode}/${reviewUserId}/comments`);
	const snapshot = await get(commentsRef);
	if (!snapshot.exists()) return [];
	const comments = [];
	snapshot.forEach((childSnapshot) => {
		comments.push({
			id: childSnapshot.key,
			...childSnapshot.val()
		});
	});
	return comments;
}
/**
 * Delete a review for a course (by userId).
 * @param {string} courseCode 
 * @param {string} userId 
 */
export async function deleteReview(courseCode, userId) {
	const reviewRef = ref(db, `reviews/${courseCode}/${userId}`);
	await set(reviewRef, null);
}

/**
 * Delete a specific comment from a review.
 * @param {string} courseCode 
 * @param {string} reviewUserId - UID of the review's author
 * @param {string} commentId - ID of the comment (Firebase push key)
 */
export async function deleteComment(courseCode, reviewUserId, commentId) {
	const commentRef = ref(db, `reviews/${courseCode}/${reviewUserId}/comments/${commentId}`);
	await set(commentRef, null);
}
// Delete a review or comment by its ID
export const deleteReviewById = async (courseCode, commentId, parentId = null) => {
  const db = getDatabase();

  if (!parentId) {
    // Top-level review
    const reviewRef = ref(db, `reviews/${courseCode}/${commentId}`);
    await remove(reviewRef);
  } else {
    // Nested reply - remove it from the parent's replies array
    const parentRef = ref(db, `reviews/${courseCode}/${parentId}`);
    const snapshot = await get(parentRef);
    if (snapshot.exists()) {
      const parentData = snapshot.val();
      const replies = parentData.replies || [];

      const updatedReplies = replies.filter((r) => r.id !== commentId);
      await update(parentRef, { replies: updatedReplies });
    }
  }
};