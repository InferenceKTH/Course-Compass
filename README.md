Project Structure Draft:


# Course-Compass 
## by team Inference
//explanation of project

## How to run

After downloading the repository navigate to the folder my-app and install the dependencies with 

```bash
npm install
```
The website can run for developers with
```bash
npm run dev
```

for production use
```bash
npm run build
```

## Project structure
The project uses the **[Model–view–presenter (MVP)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter)** paradime. The view displays the data. The presenter contains the logic. The model contains the data. 

//Where everything is 

//comments in file tree and files


```
.
├── docker-compose.yml
├── Dockerfile
├── docs
│   ├── _config.yml
│   └── index.md
├── my-app
│   ├── eslint.config.js
│   ├── firebase.js
│   ├── firebase.json
│   ├── firebaseModel.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── src
│   │   ├── assets
│   │   │   ├── example.json
│   │   │   ├── project_icon.png
│   │   │   └── share_icon.png
│   │   ├── dev
│   │   │   ├── index.js
│   │   │   ├── palette.jsx
│   │   │   ├── previews.jsx
│   │   │   ├── README.md
│   │   │   └── useInitial.js
│   │   ├── index.jsx
│   │   ├── model.js
│   │   ├── pages
│   │   │   ├── App.jsx
│   │   │   └── SharedView.jsx
│   │   ├── presenters
│   │   │   ├── AddToDB.jsx
│   │   │   ├── FilterPresenter.jsx
│   │   │   ├── ListViewPresenter.jsx
│   │   │   ├── PrerequisitePresenter.jsx
│   │   │   ├── ReviewPresenter.jsx
│   │   │   ├── SearchbarPresenter.jsx
│   │   │   ├── SidebarPresenter.jsx
│   │   │   ├── Tests
│   │   │   │   ├── AddToDB.jsx
│   │   │   │   ├── AllCoursesPresenter.jsx
│   │   │   │   └── JsonToDatabase.jsx
│   │   │   └── UploadTranscriptPresenter.jsx
│   │   ├── scripts
│   │   │   ├── eligibility_refined.js
│   │   │   └── transcript-scraper
│   │   │       ├── transcript-gpt.html
│   │   │       ├── transcript-scraper-htmlTester.html
│   │   │       └── transcript-scraper.mjs
│   │   ├── styles.css
│   │   └── views
│   │       ├── Components
│   │       │   ├── CoursePagePopup.jsx
│   │       │   ├── CourseViewComponents
│   │       │   │   ├── ModalComponent.jsx
│   │       │   │   └── SampleComponent.jsx
│   │       │   ├── FavouriteDropdown.jsx
│   │       │   ├── PrerequisiteTreeComponents
│   │       │   │   └── BoxTest.jsx
│   │       │   ├── RatingComponent.jsx
│   │       │   ├── SideBarComponents
│   │       │   │   ├── ButtonGroupField.jsx
│   │       │   │   ├── CollapsibleCheckboxes.jsx
│   │       │   │   ├── CourseTranscriptList.jsx
│   │       │   │   ├── DropDownField.jsx
│   │       │   │   ├── FilterEnableCheckbox.jsx
│   │       │   │   ├── SliderField.jsx
│   │       │   │   ├── ToggleField.jsx
│   │       │   │   ├── ToolTipIcon.jsx
│   │       │   │   ├── ToolTip.jsx
│   │       │   │   └── UploadField.jsx
│   │       │   └── StarComponent.jsx
│   │       ├── ListView.jsx
│   │       ├── PrerequisiteTreeView.jsx
│   │       ├── ReviewView.jsx
│   │       ├── SearchbarView.jsx
│   │       ├── SidebarView.jsx
│   │       ├── TestAllCoursesView.jsx
│   │       └── TestWithButtonView.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md

16 directories, 68 files
```




## Other branches

The **[docs](https://github.com/InferenceKTH/Course-Compass/tree/kth-api)** branch contains the team website.

The **[kth-api](https://github.com/InferenceKTH/Course-Compass/tree/kth-api)** contains most of the tools used for gathering and processing the course info.