import { configure, makeAutoObservable } from "mobx";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { connectToFirebase } from "../firebase";
import { model } from "./model";
import App from "./pages/App.jsx";
import "./styles.css";

import SharedView from "./pages/SharedView.jsx";
import { JsonToDatabase } from "./presenters/Tests/JsonToDatabase";
import { AllCoursesPresenter } from "./presenters/Tests/AllCoursesPresenter.jsx";


/**
 * This file contains the bootstrapping, as well as the router used in our webapp.
 */

configure({ enforceActions: "observed", reactionScheduler: (f) => setTimeout(f, 0),});
const reactiveModel = makeAutoObservable(model);
connectToFirebase(reactiveModel);

export function makeRouter(reactiveModel) {
  return createHashRouter([
    {
      path: "/",
      element: <App model={reactiveModel} />,
    },
    {
      path: "/share",
      //element: <SharedView />,
      element: <SharedView model={reactiveModel} />,
    },
    // Testcases, which are disabled for deployment:
    // {
    //   path: "/button",
    //   element: <JsonToDatabase model={reactiveModel} />,
    // },
    // {
    //   path: "/all",
    //   element: <AllCoursesPresenter model={reactiveModel} />,
    // }, 
    
  ]);
}

createRoot(document.getElementById("root")).render(
  <RouterProvider router={makeRouter(reactiveModel)} />
);
// give user access for debugging purpose
// window.myModel = reactiveModel;
