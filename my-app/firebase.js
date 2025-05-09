import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { get, getDatabase, ref, set, onValue, onChildRemoved, onChildAdded } from "firebase/database";
import { reaction, toJS } from "mobx";

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
let noUpload = false;

export function connectToFirebase(model) {
	loadCoursesFromCacheOrFirebase(model);
	fetchDepartmentsAndLocations(model);
	// setting missing
	// also save filters to local storage
	//
	const options = JSON.parse(localStorage.getItem("filterOptions"));
	if (options) {
		model.setFilterOptions(options);
		console.log("Restore options from local storage");
	}

	reaction(
		() => ({ filterOptions: JSON.stringify(model.filterOptions) }),
		// eslint-disable-next-line no-unused-vars
		({ filterOptions }) => {
			localStorage.setItem("filterOptions", filterOptions);
		}
	);

	onAuthStateChanged(auth, (user) => {
		if (user) {
			model.setUser(user); // Set the user ID once authenticated
			firebaseToModel(model); // Set up listeners for user-specific data
			syncModelToFirebase(model); // Start syncing changes to Firebase
			syncScrollPositionToFirebase(model);
			startAverageRatingListener(model);
		} else {
			model.setUser(null); // If no user, clear user-specific data
		}
	});
}

// fetches all relevant information to create the model
async function firebaseToModel(model) {
	const userRef = ref(db, `users/${model.user.uid}`);
	onValue(userRef, (snapshot) => {
		if (!snapshot.exists()) return;
		const data = snapshot.val();
		noUpload = true;
		if (data?.favourites) model.setFavourite(data.favourites);
		if (data?.currentSearchText)
			model.setCurrentSearchText(data.currentSearchText);
		// if (data.scrollPosition)
		// 	model.setScrollPosition(data.scrollPosition);
		// if (data.filterOptions) model.setFilterOptions(data.filterOptions);
		noUpload = false;
	});
}

export function syncModelToFirebase(model) {
	reaction(
		() => ({
			userId: model?.user.uid,
			favourites: toJS(model.favourites),
			currentSearchText: toJS(model.currentSearchText),
			// filterOptions: toJS(model.filterOptions),
			// Add more per-user attributes here
		}),
		// eslint-disable-next-line no-unused-vars
		({ userId, favourites, currentSearchText }) => {
			if (noUpload || !userId) return;
			const userRef = ref(db, "users/${userId}");
			const dataToSync = {
				favourites,
				currentSearchText,
				// filterOptions,
			};
			set(userRef, dataToSync).catch(console.error);
		}
	);
}

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

				if (typeof avgRating === "number") {
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


function saveCoursesToCache(courses, timestamp) {
	const request = indexedDB.open("CourseDB", 1);

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
		courses.forEach((course) => courseStore.put(course));
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

export async function addCourse(course) {
	if (!course?.code) return;
	const myRef = ref(db, `courses/${course.code}`);
	await set(myRef, course);
	updateLastUpdatedTimestamp();
}

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

export async function uploadDepartmentsAndLocations(departments, locations) {
	if (departments) {
		const departmentsRef = ref(db, "departments");
		try {
			await set(departmentsRef, departments);
			console.log("Uploaded Departments");
		} catch (error) {
			console.error("Failed to upload departments:", error);
			return false;
		}
	}
	if (locations) {
		const locationsRef = ref(db, "locations");
		try {
			await set(locationsRef, locations);
			console.log("Uploaded Locations");
		} catch (error) {
			console.error("Failed to upload locations:", error);
			return false;
		}
	}
	return true;
}

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
			console.log("Using cached courses from IndexedDB...");
			const courseTx = db.transaction("courses", "readonly");
			const courseStore = courseTx.objectStore("courses");
			const getAllReq = courseStore.getAll();
			const cachedCourses = await new Promise((resolve) => {
				getAllReq.onsuccess = () => resolve(getAllReq.result);
				getAllReq.onerror = () => resolve([]);
			});
			model.setCourses(cachedCourses);
			return;
		}
	} catch (err) {
		console.warn("IndexedDB unavailable, falling back to Firebase:", err);
	}

	// fallback: fetch from Firebase
	console.log("Fetching courses from Firebase...");
	const courses = await fetchAllCourses();
	model.setCourses(courses);
	saveCoursesToCache(courses, firebaseTimestamp);
}

export async function addReviewForCourse(courseCode, review) {
	try {
		const reviewsRef = ref(db, `reviews/${courseCode}/${review.uid}`);
		await set(reviewsRef, review);
		const updateCourseAvgRating = httpsCallable(functions, 'updateCourseAvgRating');
   		const result = await updateCourseAvgRating({ courseCode });
		
		console.log('Average rating updated:', result.data.avgRating);
	} catch (error) {
		console.error("Error when adding a course to firebase or updating the average:", error);
	}
}

export async function getReviewsForCourse(courseCode) {
	const reviewsRef = ref(db, `reviews/${courseCode}`);
	const snapshot = await get(reviewsRef);
	if (!snapshot.exists()) return [];
	const reviews = [];
	snapshot.forEach((childSnapshot) => {
		if(childSnapshot.key!="avgRating")
		reviews.push({
			id: childSnapshot.key,
			...childSnapshot.val(),
		});
	});
	return reviews;
}
