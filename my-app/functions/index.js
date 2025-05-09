const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.database();

// eslint-disable-next-line no-unused-vars
exports.updateCourseAvgRating = functions.https.onCall(async (data, context) => {
	const courseCode = data.courseCode || data?.data?.courseCode;
	if (!courseCode) {
		throw new functions.https.HttpsError('invalid-argument', 'Missing courseCode');
	}

	try {
		// Get all reviews for the course
		const reviewsSnap = await db.ref(`reviews/${courseCode}`).once('value');
		const reviews = reviewsSnap.val();

		if (!reviews) {
			throw new functions.https.HttpsError('not-found', 'No reviews found for this course');
		}

		// Compute average from overallRating
		let totalOverall = 0;
		let countOverall = 0;
		let totalDifficulty = 0;
		let countDifficulty = 0;
		let totalProfessor = 0;
		let countProfessor = 0;

		Object.values(reviews).forEach(review => {
			if (typeof review.overallRating === 'number') {
				totalOverall += review.overallRating;
				countOverall++;
			}
			if (typeof review.difficultyRating === 'number') {
				totalDifficulty += review.difficultyRating;
				countDifficulty++;
			}
			if (typeof review.professorRating === 'number') {
				totalProfessor += review.professorRating;
				countProfessor++;
			}
		});

		let avgRatingOverall = 0;
		let avgRatingDifficulty = 0;
		let avgRatingProfessor = 0;

		if (!(countOverall === 0)) {
			avgRatingOverall = parseFloat((totalOverall / countOverall).toFixed(2));
		}
		if (!(countDifficulty === 0)) {
			avgRatingDifficulty = parseFloat((totalDifficulty / countDifficulty).toFixed(2));
		}
		if (!(countProfessor === 0)) {
			avgRatingProfessor = parseFloat((totalProfessor / countProfessor).toFixed(2));
		}
		if (countOverall === 0 && countDifficulty === 0 && countProfessor === 0) {
			throw new functions.https.HttpsError('failed-precondition', 'No valid ratings');
		}

		// Update the avgRating in reviews
		await db.ref(`reviews/${courseCode}`).update({"avgRating" :[avgRatingOverall, avgRatingDifficulty, avgRatingProfessor] } );

		return { success: true, "avgRating": [avgRatingOverall, avgRatingDifficulty, avgRatingProfessor] };
	} catch (error) {
		throw new functions.https.HttpsError('internal', error.message);
	}
});
