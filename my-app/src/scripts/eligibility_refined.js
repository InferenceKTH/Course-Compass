function prereq_convert(courses_taken, current_object, previous_key, hash_bool, count_object) {
    if (current_object == undefined) {return}
    /* STEP 1: Sets courses taken to true, and not taken to false */
    if (!Array.isArray(current_object)) {   // Is object
        let key = Object.keys(current_object)[0];
        prereq_convert(courses_taken, current_object[key], key, hash_bool, count_object);      
    } else {    // Is an array
        for (let i = 0; i < current_object.length; i++) {
            if (typeof current_object[i] == "string") {
                if (current_object[i][0] == '#') {
                    current_object[i] = hash_bool;
                } else if (courses_taken.includes(current_object[i])) {
                    current_object[i] = true;
                    if (count_object != undefined) {count_object["count"]++;}
                } else {
                    current_object[i] = false;
                    if (count_object != undefined) {count_object["count"]++;}
                }
            } else {
                prereq_convert(courses_taken, current_object[i], previous_key, hash_bool, count_object);
            }
        }
    }
    
    /* STEP 2: Check if an object is true or false based on content of the inner object */
    if (typeof current_object == "object" && !Array.isArray(current_object)) {
        let key = Object.keys(current_object)[0];
        let object_array = current_object[key];
        let num_of_matches = 0;
        for (let i = 0; i < object_array.length; i++) {
            if (Array.isArray(object_array[i])) {
                let num_of_inner_matches = 0;
                for (let j = 0; j < object_array[i].length; j++) {
                    if (object_array[i][j]) {
                        num_of_inner_matches ++;
                    }
                }
                if (key == "or" && num_of_inner_matches > 0) {object_array[i] = true; num_of_matches++; continue;}
                if (key == "and" && num_of_inner_matches == object_array[i].length) {object_array[i] = true; num_of_matches++; continue;}
                object_array[i] = false;
            } else if (typeof object_array[i] == "object") {
                let inner_key = Object.keys(object_array[i])[0];
                if (object_array[i][inner_key]) {num_of_matches++;}
            } else if(object_array[i]) {num_of_matches++}
        }
        if (key == "or" && num_of_matches > 0) {current_object[key] = true}
        else if (key == "and" && num_of_matches == object_array.length) {current_object[key] = true}
        else {current_object[key] = false}
    }

}


function eligibility_check(courses_taken, prereqs_object, hash_bool, count_object) {
    if (!Array.isArray(courses_taken)) {
        throw new Error('Courses taken must be an array');
    }
    if (!prereqs_object || typeof prereqs_object !== 'object') {
        throw new Error('Prerequisites must be an object');
    }
    prereq_convert(courses_taken, prereqs_object, null, hash_bool, count_object);
    let key = Object.keys(prereqs_object);
    return prereqs_object[key];
}

export default function eligibility(courses_taken, prereqs_object) {
    let prereqs_object1 = JSON.parse(JSON.stringify(prereqs_object));
    let prereqs_object2 = JSON.parse(JSON.stringify(prereqs_object));
    let return_object = {strong: false, zero: false, moderate: false, weak: false};
    let count_object = {count: 0};

    if (Array.isArray(prereqs_object)) {
        return_object["zero"] = true;
        return return_object;
    }
    
    if (eligibility_check(courses_taken, prereqs_object1, false)) {
        return_object["strong"] = true;
    } 
    else if (eligibility_check(courses_taken, prereqs_object2, true, count_object)) {
        if (count_object["count"] > 0) {
            return_object["moderate"] = true;
        } else {
            return_object["weak"] = true;
        }
    }
    return return_object;
}
