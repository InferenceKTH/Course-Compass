import { observer } from "mobx-react-lite";
import { useState } from "react";
import SearchbarView  from "../../views/SearchbarView.jsx";

// A dummy presenter, which adds the course supplied in the text field to the db.
export const AddToDB = observer(function AddToDB({ model }) {
    const [text, setText] = useState("");
	return <SearchbarView text={text} onTextChanged={onTextChanged} onSubmit={onSubmit}/>;

    function onTextChanged(e){
        setText(e.target.value);
    }

    function onSubmit(){
        const course = {courseCode : text, data : "A course"};
        model.addCourse(course);
    }
});
