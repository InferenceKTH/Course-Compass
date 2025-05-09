# Course-Compass 
## by team [Inference](https://inferencekth.github.io/Course-Compass/)
Course-Compass is a webpage for interacting with the kth courses via the kth api. It allows for searching and filtering through all active courses.

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

1. Copy the environment template:
```bash
cp .env.example .env.local
```

2. Get the Firebase configuration values from your team lead or the Firebase Console
3. Update `.env.local` with your Firebase configuration:
```bash
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your_project.firebasedatabase.app
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Firebase Security Rules
<details>
<summary>Click to view Firebase Rules</summary>

```json
{
    "rules": {
      "courses": {
        ".read": true,
        ".write": "auth != null && (auth.uid === 'adminuid' || auth.uid === 'adminuid')"
      },
      "metadata": {
        ".read": true,
        ".write": "auth != null && (auth.uid === 'adminuid' || auth.uid === 'adminuid')"
      },
      "departments": {
        ".read": true,
        ".write": "auth != null && (auth.uid === 'adminuid' || auth.uid === 'adminuid')"
      },
      "locations": {
        ".read": true,
        ".write": "auth != null && (auth.uid === 'adminuid' || auth.uid === 'adminuid')"
      },
      "reviews": {
        ".read": true,
        "$courseCode": {
          "$userID": {
            ".write": "auth != null && (auth.uid === $userID || data.child('uid').val() === auth.uid || !data.exists())",
            ".validate": "newData.hasChildren(['text', 'timestamp']) && newData.child('text').isString() && newData.child('timestamp').isNumber()"
          }
        }
      },
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

## Other branches

The **[docs](https://github.com/InferenceKTH/Course-Compass/tree/docs)** branch contains the team website.

The **[kth-api](https://github.com/InferenceKTH/Course-Compass/tree/kth-api)** contains most of the tools used for gathering and processing the course info.

![team Inference logo](/my-app/src/assets/project_icon.png)
