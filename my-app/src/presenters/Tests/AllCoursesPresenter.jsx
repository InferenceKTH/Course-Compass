import { observer } from "mobx-react-lite";
import {TestAllCoursesView} from "../../views/TestAllCoursesView"

export const AllCoursesPresenter = observer(function AllCoursesPresenter({ model }) {
    return <TestAllCoursesView courses={model.courses}/>
});