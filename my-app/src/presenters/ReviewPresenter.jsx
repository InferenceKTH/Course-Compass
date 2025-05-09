import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { ReviewView } from '../views/ReviewView.jsx';

export const ReviewPresenter = observer(({ model, course }) => {
    const [reviews, setReviews] = useState([]);
    const [postAnonymous, setAnonymous] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        text: "",
        overallRating: 0,
        difficultyRating: 0,
        professorName: "",
        professorRating: 0,
        grade: "",
        recommend: null,
        avgRating: 0,
    });

    useEffect(() => {
        async function fetchReviews() {
            const data = await model.getReviews(course.code);
            setReviews(data);
            if(data.filter((review)=>{review.userid == model?.user?.uid}))
                setErrorMessage("Everyone can only post once. Submitting a new comment will override the old one.");
        }
        fetchReviews();
    }, [course.code, model]);

    useEffect(() => {
        async function fetchReviews() {
            const data = await model.getReviews(course.code);
            if(data.filter((review)=>{review.userid == model?.user?.uid}))
                setErrorMessage("Everyone can only post once. Submitting a new comment will override the old one.");
        }
        fetchReviews();
    }, [reviews]);

 
    const handleReviewSubmit = async () => {
        if(!model?.user){
            setErrorMessage("You need to be logged in to post a comment - Posting anonymously is possible.");
            return;
        }
        if (formData.text.trim()) {
            const review = {
                userName: postAnonymous ? "Anonymous" : model.user?.displayName,
                uid: model?.user?.uid,
                timestamp: Date.now(),
                ...formData,

            };
            if(!await model.addReview(course.code, review)){    
                setErrorMessage("Something went wrong when posting. Are you logged in?")
                return;
            }
            const updatedReviews = await model.getReviews(course.code);
            setReviews(updatedReviews);
            setFormData({
                text: "",
                overallRating: 0,
                difficultyRating: 0,
                professorName: "",
                grade: "",
                recommended: false,
                avgRating: 0,
            });
        }
    };


    return (
        <ReviewView
            course={course}
            reviews={reviews}
            formData={formData}
            setFormData={setFormData}
            handleReviewSubmit={handleReviewSubmit}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            postAnonymous={postAnonymous}
            setAnonymous={setAnonymous}
        />

    );
});
