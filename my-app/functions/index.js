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
		let total = 0;
		let count = 0;

		Object.values(reviews).forEach(review => {
			if (typeof review.overallRating === 'number') {
				total += review.overallRating;
				count++;
			}
		});

		if (count === 0) {
			throw new functions.https.HttpsError('failed-precondition', 'No valid ratings');
		}

		const avgRating = parseFloat((total / count).toFixed(2));

		// Update the avgRating in courses
		await db.ref(`reviews/${courseCode}`).update({ avgRating });

		return { success: true, avgRating };
	} catch (error) {
		throw new functions.https.HttpsError('internal', error.message);
	}
});
