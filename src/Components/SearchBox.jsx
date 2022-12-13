import { ShowSuggestionBox } from "../JS/Common"
export function SearchBox(props) {
    return (
        <>
            <form className="gridsearchbar">
                <div className="position-absolute top-50 translate-middle-y search-icon ms-3 searchIcon"><i className="bi bi-search"></i></div>
                <input className="form-control" type="text" placeholder="Search Device (Student Name, Serial Number, Asset Tag*)" id="CreateTicketSearchId" onKeyUp={(e) => ShowSuggestionBox("CreateTicketSearchId")} />
                <div className="SuggestionBox">
                    {props.SuggestionData.map((item, i) => {
                        var returData;
                        returData = <div className="col-12" key={i}>{item}</div>
                        return returData;
                    })}
                </div>
            </form>
        </>
    )
}