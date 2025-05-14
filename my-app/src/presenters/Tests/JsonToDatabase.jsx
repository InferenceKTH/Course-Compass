import { observer } from "mobx-react-lite";
import { TestWithButtonView } from "../../views/Tests/TestWithButtonView";
import data from "../../assets/example.json";

export const JsonToDatabase = observer(
    function JsonToDatabase(props){
        function parse(){
            props.model.populateDatabase(data);
        }

        return <TestWithButtonView onSubmit={parse}/>;
    }
);

