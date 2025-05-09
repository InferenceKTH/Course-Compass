import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";


pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default async function transcriptScraperFunction(file, setErrorMessage, setErrorVisibility) {
    //const pdfjsLib = window['pdfjsLib'];
    //pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    if (!file) {
        console.log("element: 'PDF-Scraper-Input' changed, but we havent gotten a file yet.");
        return;
    }
    if (file.type !== "application/pdf") {
        throwTranscriptScraperError("Uploaded file isn't PDF.", setErrorMessage, setErrorVisibility);
        return;
    }

    setErrorVisibility("hidden");


    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);
    try {
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

        //this is our array we are going to work with
        let textObjects = [];


        //we will parse the whole pdf page-by-page, and going to push all the content into our array
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            //pushing all the text items from the page into our array
            textObjects.push(...textContent.items);
        }


        evaluatePDFtextObjectArray(textObjects, setErrorMessage, setErrorVisibility);

    }
    catch (e) {
        throwTranscriptScraperError("While parsing the pdf something went wrong.\n" + e, setErrorMessage, setErrorVisibility);
        console.log(e);
    }
}

function throwTranscriptScraperError(txt, setErrorMessage, setErrorVisibility) {
    console.log("PDF-Scraper-Error: " + txt);
    setErrorMessage("Error: " + txt);
    setErrorVisibility("visible");
}

function writeLocalStorage_completedCourses(codesArr) {
    //Getting the local storage contents
    let local = [];
    if (localStorage.getItem("completedCourses"))
        local = JSON.parse(localStorage.getItem("completedCourses"));
    else {
        localStorage.setItem("completedCourses", '[]');
    }

    local.sort();

    /*

    const months = [{id: "AA12", name: "Apple course"},
            {id: "BB33", name: "Banana course"},
            {id: "BB23", name: "anana course"},
            {id: "1B33", name: "Banana course"}
            ];
    
    months.sort((a, b) => a.id.localeCompare(b.id));

    */

    let newcodes = local.concat(codesArr);
    newcodes = [... new Set(newcodes)];


    localStorage.setItem("completedCourses", JSON.stringify(newcodes));

    window.dispatchEvent(new Event("completedCourses changed"));
}

function evaluatePDFtextObjectArray(textObjects, setErrorMessage, setErrorVisibility) {
    let scrapedCodes = [];

    //initializing couple flags.
    let flagKTH = false;
    let flagKTH_NeverSet = true;
    let flagTable = false;
    let flagTableDone = false;

    let flagErrorRecords = false;

    //we are going to go through each text object which is inside the pdf file.
    for (let i = 0; i < textObjects.length; i++) {
        //we are going to look for our university, KTH
        //current ladok generated National Official transcripts start at xposition 56.692
        if ((!flagKTH) && (textObjects[i].transform[4] === 56.692))
            if ((textObjects[i].str == "Kungliga Tekniska högskolan") || (textObjects[i].str == "KTH Royal Institute of Technology")) {
                flagKTH = true;
                flagKTH_NeverSet = false;
                continue;
            }

        if ((!flagErrorRecords) && ((textObjects[i].str == "Resultatintyg") || (textObjects[i].str == "Official Transcript of Records"))) {
            flagErrorRecords = true;
        }

        if (flagKTH) {
            //we have found KTH, the very next table containing records should be the one with completed courses
            //TODO: this might not be necessarily true, you might need to have a similar code to KTH checker, to check if its
            //      'completed courses'/'avslutade kurser'


            //the very first text in a table is always Code/Kod; we will start describing it; and we will detect when a new table starts
            //and check if its accidentally the same table which just got cut in half by a newline or an actually different table
            if ((textObjects[i].str === "Code") || (textObjects[i].str === "Kod")) {
                if (flagTable) flagTableDone = true; //we have already found one table and transcribed it

                if (!flagTableDone) {
                    flagTable = true;
                } else {
                    if ((textObjects[i - 1].transform[4] !== 532.71801758) && (textObjects[i - 11].transform[4] !== 532.71801758)) {
                        //if its i-1, the page number is the object directly behind, otherwise if -11 its because theres some filter,
                        //e.g. utskrift datum, personnummer and others. hopefully this should cover all base (probably doesn't)
                        //this is a very hardcoded solution to this problem.
                        //the new table (that is the new found "Kod" / "Code" is not because unexpected page break, therefore we are done transcribing
                        //KTH courses, these are either uncomplete courses, or courses from other universities
                        flagTable = false;
                        //we have finished the table!
                        flagKTH = false;
                    }
                }
            }
            //we are looking for text objects which are precisely at x coord 56.692; and also there exists such an element 12 ahead in the array
            //which is at coord 510.233; these are hardcoded values into the ladok pdf generator
            //for good measures we also make sure the text is not longer that 7 chars; the longest course ID found so far at KTH
            if ((textObjects[i].transform[4] === 56.692) && (textObjects[i + 12].transform[4] === 510.233) && (textObjects[i].str.length < 8))
                if (flagTable) {
                    //console.log(textObjects[i].str, textObjects[i].transform[4]);
                    //extractedText+= textObjects[i].str + "\n";
                    scrapedCodes.push(textObjects[i].str);
                }

        }

    }

    if (flagErrorRecords && (scrapedCodes.length == 0)) {
        throwTranscriptScraperError("Provided Official Transcript of Records instead of National Official transcript of records.", setErrorMessage, setErrorVisibility);
        return;
    }

    if (flagKTH_NeverSet) {
        throwTranscriptScraperError("Provided pdf doesn't contain KTH.", setErrorMessage, setErrorVisibility);
        return;
    }

    if (scrapedCodes.length == 0) {
        throwTranscriptScraperError("Couldn't find any tables to transcribe.", setErrorMessage, setErrorVisibility);
        return;
    }
    writeLocalStorage_completedCourses(scrapedCodes);

}