import fs from "fs";

/* 
This file contains an atempted version of a regex based prerequiste scraper. Due to the unconsistency that the prerequsites have when extracted from the api 
this project is mostly a falure. It is no longer worth it to deal with all the spelling errors and unstandardised human langage that webpages contain. 
For this to be fesable in the future there would have to be a restructuring of the kth api prerequsites.
*/

let previous_data = fs.readFileSync('all_courses_data4.json');
let previous_object = JSON.parse(previous_data);
let codes = Object.keys(previous_object);



// corses that is iposible to deal with curently with this method and are therfore stoped before they break something
let areBroken = ["SF250X", "LT2033", "A42SES", "MF2091", "LT1035", "IL2233", "DD2434"];
function isBroken(key) {
    for (let i = 0; i < areBroken.length; i++) {
        if (areBroken[i] === key) {
            return true;
        }
    }
    return false;
}

//glosery for geting synonyms 
let orW = ["or", " or ", " or", "alternatively"];// or
let andW = ["and", " and ", "in parallel", "combined with", "together with"];// and

//let testCodes = ["ID2218", "IK1203", "DD2421", "MH2037", "DD2350", "AG2415", "DD2448", "SF2942","MG2117"];
let testCodes = codes;
console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");

function fixArr(arr, key) {
    let newArr = [];

    //if the code is on the blacklist as imposible return error string
    if (isBroken(key)) {
        return ["This course is known to be broken: " + key];
    }

    //If the array is null just return an empty array there is no point in continuing anyway
    if (arr == null || arr == undefined) {
        return [];
    }



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

        if (index != -1) {
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


    //remove anamalies from edge cases (there is a lot of them)
    let toRemove = [" or undefined", " and undefined", " or or", "-", " or ", " or and", "/"];
    for (let i = 0; i < arr.length; i++) {
        //replacing all "or or or" with "or"
        let regx = /or or or/g;
        arr[i] = arr[i].replace(regx, "or");
        //replacing all " / " and ", " with "/"
        regx = /( \/ )|(, )/g;
        arr[i] = arr[i].replace(regx, "/");

        //removing all anomalies from the toRemove list
        for (let k = 0; k < toRemove.length; k++) {
            let temp = arr[i].substring(arr[i].length - toRemove[k].length);
            if (temp === toRemove[k]) {
                arr[i] = arr[i].substring(0, arr[i].length - toRemove[k].length);
            }
        }
    }
    return arr;
}




let count = [];
for (let i = 0; i < testCodes.length; i++) {
    if (previous_object[testCodes[i]]["prerequisites_text"] != null) {

        let work = previous_object[testCodes[i]]["prerequisites_text"];

        let temp = work.match(/(([A-Z]{3}[0-9]{4}|[A-Z]{2}(?: ?)[0-9]{4,5}|[A-Z]{2}[0-9]{3}[A-Z]|[A-Z][0-9][A-Z][0-9]{4}|[A-Z][0-9][0-9][A-Z]{3}|[A-Z]{3}[0-9]{3}|[A-Z][A-Z][0-9][A-Z]{3}|[A-Z][0-9]{2}[A-Z][0-9][A-Z]|[A-Z][A-Z][0-9][A-Z]{2}[0-9]|[A-Z]{2}[0-9][A-Z][0-9]{2}|[A-Z][0-9]{2}[A-Z][0-9]{2}|[A-Z]{4}[0-9]{2})(?:( or )|( and )|( \/ )|[\/-]|(, )?))+|alternatively|in parallel| or( ?)|BSc degree|combined with|together with|Bachelor's degree/g);

        let fixed = fixArr(temp, testCodes[i]);
        if (count[fixed.length] == null) {
            count[fixed.length] = 1;
        } else {
            count[fixed.length]++;
        }

        if (fixed.length > 6) {
            console.log(testCodes[i]);
            console.log(fixed);
            console.log();
        }

    }
}
console.log;
for (let i = 0; i < count.length; i++) {
    if (count[i] == null) {
        count[i] = 0;
    }
    console.log(i + ": " + count[i]);
}



//Writen by Elias Tosteberg