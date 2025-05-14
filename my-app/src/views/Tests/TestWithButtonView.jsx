export function TestWithButtonView(props){
    return <div>
        <button className="btn btn-primary" onClick={props.onSubmit}>
		Submit
		</button>
    </div>;
}