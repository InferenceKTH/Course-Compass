import { configure, makeAutoObservable } from "mobx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { connectToFirebase } from "../firebase";
import { model } from "./model";
import App from "./pages/App.jsx";
import "./styles.css";

import SharedView from "./pages/SharedView.jsx";
import { JsonToDatabase } from "./presenters/Tests/JsonToDatabase";
import { AllCoursesPresenter } from "./presenters/Tests/AllCoursesPresenter.jsx";


configure({ enforceActions: "never" });

const reactiveModel = makeAutoObservable(model);
connectToFirebase(reactiveModel);

export function makeRouter(reactiveModel) {
  return createBrowserRouter([
    {
      path: "/",
      element: <App model={reactiveModel} />,
    },
    {
      path: "/share",
      //element: <SharedView />,
      element: <SharedView model={reactiveModel} />,
    },
    {
      path: "/button",
      element: <JsonToDatabase model={reactiveModel} />,
    },
    {
      path: "/all",
      element: <AllCoursesPresenter model={reactiveModel} />,
    }, 
    
  ]);
}

createRoot(document.getElementById("root")).render(
  <RouterProvider router={makeRouter(reactiveModel)} />
);

window.myModel = reactiveModel;
