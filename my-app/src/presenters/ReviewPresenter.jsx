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
        }
        fetchReviews();
    }, [course.code, model]);

    const handleReviewSubmit = async () => {
        if(model?.user){
            setErrorMessage("You need to be logged in to post a comment - Posting anonymously is possible.");
            return;
        }
        if (formData.text.trim()) {
            const review = {
                userName: postAnonymous ? "Anonymous" : model.user?.displayName,
                userID: model?.user?.userid,
                timestamp: Date.now(),
                ...formData,

            };
            if(!await model.addReview(course.code, review)){
                if(model.getReviews(course.code).filter((review)=>{review.userid == model.user.userid}))
                    setErrorMessage("Everyone can only post once. Edit your comment instead.");
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
            postAnonymous={postAnonymous}
            setAnonymous={setAnonymous}
        />

    );
});
