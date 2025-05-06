import { KTH_API_course_fetch, KTH_API_all_active_courses } from "./api_data_fetching.js";
import fs from "fs";



let previous_data = fs.readFileSync('all_courses_data4.json');
let previous_object = JSON.parse(previous_data);


let codes = Object.keys(previous_object);

//glosery
let orW = ["or", " or ", " or", "alternatively"];// or
let andW = ["and", " and ", "in parallel", "combined with"];// and

let testCodes = ["ID2218", "IK1203", "DD2421", "MH2037", "DD2350"];
console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");


function fixArr(arr) {
    let newArr = [];

    //replace all keywords with or / and
    for (let i = 0; i < arr.length; i++) {
        for (let k = 0; k < orW.length; k++) {
            if (arr[i] === orW[k]) {
                arr[i] = "or";
            }
        }
        for (let k = 0; k < andW.length; k++) {
            if (arr[i] === andW[k]) {
                arr[i] = "and";
            }
        }
    }

    //combine all or/and segments with the previous and the next array element
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "or" || arr[i] === "and") {
            newArr[newArr.length - 1] = (newArr[newArr.length - 1] + " " + arr[i] + " " + arr[i + 1]);
            i++;
        } else {
            newArr.push(arr[i]);
        }
    }
    arr = newArr;
    newArr = [];

    //combine elemnt wth and / or att the end with the next element
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].substring(arr[i].length - 4) === "and " || arr[i].substring(arr[i].length - 3) === " or ") {
            newArr.push(arr[i] + arr[i + 1]);
            i++;
        } else {
            newArr.push(arr[i]);
        }
    }
    arr = newArr;
    newArr = [];


    //for removing a verry iritating edge case "DD 1319"
    for (let i = 0; i < arr.length; i++) {
        let k = arr[i].search(/[A-Z]{2} [0-9]{4,5}/g);
        if (k != -1) {
            arr[i] = arr[i].substring(0, k + 2) + arr[i].substring(k + 3);
            i--;
        }
    }

    //expanding code-code
    for (let i = 0; i < arr.length; i++) {
        const regx = /(?:[A-Z]{3}[0-9]{4}|[A-Z]{2}[0-9]{4,5}|[A-Z]{2}[0-9]{3}[A-Z]|[A-Z][0-9][A-Z][0-9]{4}|[A-Z][0-9][0-9][A-Z]{3}|[A-Z]{3}[0-9]{3}|[A-Z][A-Z][0-9][A-Z]{3}|[A-Z][0-9]{2}[A-Z][0-9][A-Z]|[A-Z][A-Z][0-9][A-Z]{2}[0-9]|[A-Z]{2}[0-9][A-Z][0-9]{2}|[A-Z][0-9]{2}[A-Z][0-9]{2}|[A-Z]{4}[0-9]{2})-(?:[A-Z]{3}[0-9]{4}|[A-Z]{2}[0-9]{4,5}|[A-Z]{2}[0-9]{3}[A-Z]|[A-Z][0-9][A-Z][0-9]{4}|[A-Z][0-9][0-9][A-Z]{3}|[A-Z]{3}[0-9]{3}|[A-Z][A-Z][0-9][A-Z]{3}|[A-Z][0-9]{2}[A-Z][0-9][A-Z]|[A-Z][A-Z][0-9][A-Z]{2}[0-9]|[A-Z]{2}[0-9][A-Z][0-9]{2}|[A-Z][0-9]{2}[A-Z][0-9]{2}|[A-Z]{4}[0-9]{2})/g;

        let index = arr[i].search(regx);

        console.log(index);
        if (index != -1) {
            console.log((index != -1) + " index:" + index);
            let stringB = arr[i].substring(0, index);
            let expand = arr[i].match(regx)[0];
            let stringE = arr[i].substring(index + expand.length);
            let code1 = expand.split("-")[0];
            let code2 = expand.split("-")[1];
            let allCodes = [];
            let count = 0;

            const isNumeric = (string) => string == Number.parseFloat(string)

            while (true) {
                if (code1.length === 0 || code2.length === 0) {
                    throw new Error("One codelength of 0 found code1: " + code1.length + " code2: " + code2.length);
                }
                if (!isNumeric(code1.substring(count)) || !isNumeric(code2.substring(count))) {
                    count++;
                } else {
                    for (let g = code1.substring(count); g <= code2.substring(count); g++) {
                        allCodes.push(code1.substring(0, count) + g);
                    }
                    break;
                }
            }
            let expanded = allCodes[0];
            for (let k = 1; k < allCodes.length; k++) {
                expanded = expanded + "/" + allCodes[k];
            }
            expanded = stringB + expanded + stringE;

            arr[i] = expanded;
            i--;
        }
    }
    return arr;
}


for (let i = 0; i < testCodes.length; i++) {
    if (previous_object[testCodes[i]]["prerequisites_text"] != null) {

        console.log(testCodes[i]);

        console.log(previous_object[testCodes[i]]["prerequisites_text"]);

        let work = previous_object[testCodes[i]]["prerequisites_text"];

        let temp = work.match(/(([A-Z]{3}[0-9]{4}|[A-Z]{2}(?: ?)[0-9]{4,5}|[A-Z]{2}[0-9]{3}[A-Z]|[A-Z][0-9][A-Z][0-9]{4}|[A-Z][0-9][0-9][A-Z]{3}|[A-Z]{3}[0-9]{3}|[A-Z][A-Z][0-9][A-Z]{3}|[A-Z][0-9]{2}[A-Z][0-9][A-Z]|[A-Z][A-Z][0-9][A-Z]{2}[0-9]|[A-Z]{2}[0-9][A-Z][0-9]{2}|[A-Z][0-9]{2}[A-Z][0-9]{2}|[A-Z]{4}[0-9]{2})(?:( or )|( and )|[\/-]?))+|alternatively|in parallel| or( ?)|BSc degree|combined with/g);

        let fixed = fixArr(temp);

        console.log(fixed);

        console.log();
    }
}

/* 
let i = 0;
let saved_object = {};
for (let course of Object.keys(data_object)) {
    if (i < 4567) {i++; continue;}
    //if (!new_data_object[course]["prerequisites"]) {continue;} 
    //if (!(new_data_object[course]["prerequisites"].length == 0 || new_data_object[course]["prerequisites"] == "RERUNTHIS")) {continue;}

    if (data_object[course]["prerequisites"]) {
        try {
            let pruned_prereqs = await course_prereqs_interpreter(course);
            //console.log(data_object[course]["prerequisites"]);
            await sleep(6050);
            //console.log(pruned_prereqs);
            data_object[course]["prerequisites"] = JSON.parse(pruned_prereqs)["prerequisites"];
        } catch(err) {
            console.log(err);
            data_object[course]["prerequisites"] = "RERUNTHIS";
            break;
        }   
    } 
    saved_object[course] = data_object[course];
    console.log(saved_object[course]);
    
    let previous_saved = fs.readFileSync('all_courses_pruned.json');
    let previous_saved_object = JSON.parse(previous_saved);
    let new_object = {...previous_saved_object, ...saved_object}

    const jsonString = JSON.stringify(new_object, null, 4);  // Pretty print with 4 spaces

    fs.writeFileSync('all_courses_pruned.json', jsonString, (err) => {
        if (err) {
            console.error('\nError writing file\n', err);
        } 
    });
    
    i++;
    console.log("Course number " + i + " is done which is named " + course);
} */
