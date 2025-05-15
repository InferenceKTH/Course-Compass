# Course-Compass 
## by team [Inference](https://inferencekth.github.io/Course-Compass/)
Course-Compass is an interactive web application for exploring KTH courses. It allows users to search, filter, and review courses while providing prerequisite visualization and personalized recommendations. The application uses Firebase for data storage and real-time updates.


## Features
- Course search with advanced filtering
- Course reviews and ratings
- Interactive prerequisite visualization
- Transcript upload for eligibility checking
- Personal course favorites
- Dark/Light mode support

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

## Environment Setup

### Firebase Configuration
This project uses Firebase for backend services. To set up your development environment:

Update the api keys in firebase.js to your keys.

```js
const firebaseConfig = {
	apiKey: "",
	authDomain: "",
	databaseURL:"",
	projectId: "",
	storageBucket: "",
	messagingSenderId: "",
	appId: "",
};
```

### Database Population
To populate the Firebase database with course data:

1. Use the JSON file in `/src/assets/example.json` or prepare a file according to the following outline:
```json
{
  "courseCode": {
    "code": "string",
    "name": "string",
    "location": "string",
    "department": "string",
    "language": "string",
    "description": "string",
    "academic_level": "string",
    "periods": "array",
    "credits": "number",
    "prerequisites": "object",
    "prerequisites_text": "string",
    "learning_outcomes": "string"
  }
}
```

2. Use the `model.populateDatabase(data)` function to upload courses:
```javascript
import data from "./assets/example.json";
model.populateDatabase(data);
```

### Firebase Security Rules
<details>
<summary>Click to view Firebase Rules</summary>

```json
{
  "rules": {
    // Courses and Metadata
    "courses": {
      ".read": true,
      ".write": "auth != null && (auth.uid === '6qKa992eL4fRkGKzp3OG5Sjjk983' || auth.uid === 'wa9HoCfWe2Vpw6J7oiq5oCxNYz52')"
    },
    "metadata": {
      ".read": true,
      ".write": "auth != null && (auth.uid === '6qKa992eL4fRkGKzp3OG5Sjjk983' || auth.uid === 'wa9HoCfWe2Vpw6J7oiq5oCxNYz52')"
    },
    "departments": {
      ".read": true,
      ".write": "auth != null && (auth.uid === '6qKa992eL4fRkGKzp3OG5Sjjk983' || auth.uid === 'wa9HoCfWe2Vpw6J7oiq5oCxNYz52')"
    },
    "locations": {
      ".read": true,
      ".write": "auth != null && (auth.uid === '6qKa992eL4fRkGKzp3OG5Sjjk983' || auth.uid === 'wa9HoCfWe2Vpw6J7oiq5oCxNYz52')"
    },

    // Reviews and Comments
    "reviews": {
      ".read": true,
      "$courseCode": {
        "$reviewUserID": {
          // Only the original author can write the main review
          ".write": "auth != null && (auth.uid === $reviewUserID || data.child('uid').val() === auth.uid || !data.exists())",
          ".validate": "newData.hasChildren(['text', 'timestamp']) &&
                        newData.child('text').isString() &&
                        newData.child('text').val().length <= 2501 &&
                        newData.child('timestamp').isNumber()",

          // Allow any signed-in user to write comments under the review
          "comments": {
            ".write": "auth != null",
            "$commentId": {
              ".validate": "newData.hasChildren(['text', 'userName', 'timestamp']) &&
                            newData.child('text').isString() &&
                            newData.child('userName').isString() &&
                            newData.child('timestamp').isNumber()"
            }
          }
        }
      }
    },

    // User-specific Data
    "users": {
      "$userID": {
        ".read": "auth != null && auth.uid === $userID",
        ".write": "auth != null && auth.uid === $userID"
      }
    }
  }
}

```
</details>

To deploy these rules:
```bash
firebase deploy --only database
```

### ⚠️ Security Notes
- Never commit `.env.local` to version control
- Keep your Firebase credentials secure
- Contact the team lead if you need access to the Firebase configuration

## Project structure
The project uses the **[Model–view–presenter (MVP)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter)** paradigm. The view displays the data. The presenter contains the logic. The model contains the data. 

### Key Components
- **/src/model.js**: Core data model and business logic
- **/src/views/**: UI components and layouts
- **/src/presenters/**: Interface between Model and View
- **/src/scripts/**: Utility scripts including transcript parsing
- **/src/assets/**: Static resources and images

### Development Components
- **/src/dev/**: Development utilities and component previews
- **/src/presenters/Tests/**: Test implementations
- **/scripts/transcript-scraper/**: Transcript parsing tools


### Project Tree

<details>
<summary>Click to view Project Tree</summary>

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

</details>

## Other branches

The **[docs](https://github.com/InferenceKTH/Course-Compass/tree/docs)** branch contains the team website.

The **[kth-api](https://github.com/InferenceKTH/Course-Compass/tree/kth-api)** contains most of the tools used for gathering and processing the course info.

![team Inference logo](/my-app/src/assets/project_icon.png)
