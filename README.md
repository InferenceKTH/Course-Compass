Project Structure Draft:

```
.
├── firebase.js      // handles fetching and saving to the realtime database on firebase
├── firebase.json    // used for firebase deploy
├── index.html       // the main index page - contains header and loads the index.jsx
├── package.json     // used for nodejs (npm) packages
├── package-lock.json    // used for nodejs (npm) packages
├── README.md        // this file ^^
├── src              // contains all source filed
│   ├── assets       //  content, e.g. pictures, ressources etc.
│   │   └── react.svg
│   ├── index.jsx    // the react router - routes between pages, all pages are inserted here
│   ├── model.js     // the model - handles prog. logic, that is either global or account specific
│   ├── pages        // pages combine the presenters to a webpage. mby obsolete for 1 page project
│   │   └── App.jsx  // The future homepage?
│   ├── presenters   // Presenters link views and the model. 
│   |                   Hooks to modify the model & component  state is defined here
│   │   └── HandleSearchPresenter.jsx  // An example presenter
│   ├── styles.css   // a style document - mby one for each view?
│   └── views        // views define parts of pages cosmetically. 
│       └── DummyView.jsx
└── vite.config.js
```


