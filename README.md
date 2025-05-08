# Course-Compass 
## by team [Inference](https://inferencekth.github.io/Course-Compass/)
Course-Compass is a webpage for interacting with the kth courses via the kth api. It allows for searching and filtering through all active courses.

## How to run

Running this project locally can be done via docker or by building and running it with npm. 

### Running via docker

Executing

```bash
docker compose up
```
or
```bash
docker-compose up
```
builds and starts the container. 


### Building with NPM
After downloading the repository navigate to the folder my-app and install the dependencies with 

```bash
npm ci
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
│   ├── dist
│   │   ├── assets
│   │   │   ├── index-BNDm07oX.js
│   │   │   ├── index-Bwi9_b9d.css
│   │   │   ├── pdf.worker-CKnUz2wA.mjs
│   │   │   └── project_icon-CgaTQWFX.png
│   │   └── index.html
│   ├── eslint.config.js
│   ├── firebase.js
│   ├── firebase.json
│   ├── firebaseModel.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── public
│   │   ├── favicons-dark
│   │   │   ├── android-chrome-192x192.png
│   │   │   ├── android-chrome-512x512.png
│   │   │   ├── apple-touch-icon.png
│   │   │   ├── favicon-16x16.png
│   │   │   ├── favicon-32x32.png
│   │   │   ├── favicon.ico
│   │   │   └── site.webmanifest
│   │   └── favicons-light
│   │       ├── android-chrome-192x192.png
│   │       ├── android-chrome-512x512.png
│   │       ├── apple-touch-icon.png
│   │       ├── favicon-16x16.png
│   │       ├── favicon-32x32.png
│   │       ├── favicon.ico
│   │       └── site.webmanifest
│   ├── src
│   │   ├── assets
│   │   │   ├── example.json
│   │   │   ├── project_icon1.png
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
│   │       │   │   ├── ButtonGroupFullComponent.jsx
│   │       │   │   ├── CollapsibleCheckboxes.jsx
│   │       │   │   ├── CourseTranscriptList.jsx
│   │       │   │   ├── DropDownField.jsx
│   │       │   │   ├── FilterEnableCheckbox.jsx
│   │       │   │   ├── SliderField.jsx
│   │       │   │   ├── ToggleField.jsx
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

21 directories, 87 files
```


## Other branches

The **[docs](https://github.com/InferenceKTH/Course-Compass/tree/kth-api)** branch contains the team website.

The **[kth-api](https://github.com/InferenceKTH/Course-Compass/tree/kth-api)** contains most of the tools used for gathering and processing the course info.

![team Inference logo](/my-app/src/assets/project_icon.png)
