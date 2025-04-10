import { configure, makeAutoObservable } from "mobx";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { connectToFirebase } from "../firebase";
import { model } from "./model"
import App  from "./pages/App.jsx";
import "./styles.css";
import { JsonToDatabase } from "./presenters/Tests/JsonToDatabase"
import { AllCoursesPresenter } from "./presenters/Tests/AllCoursesPresenter.jsx";
import { ReviewPresenter } from "./presenters/ReviewPresenter";

configure({ enforceActions: "never" });
const reactiveModel = makeAutoObservable(model);
connectToFirebase(reactiveModel);

export function makeRouter(reactiveModel) {
    return createHashRouter([
        {
            path: "/",
            element: <App model={reactiveModel} />,
        },
        {
            path: "/button",
            element: <JsonToDatabase model={reactiveModel} />,
        },
        {
            path: "/all",
            element: <ReviewPresenter model={reactiveModel}/>,
        },

        
    ]);
}

createRoot(document.getElementById("root")).render(
    <RouterProvider router={makeRouter(reactiveModel)} />
);

window.myModel = reactiveModel;