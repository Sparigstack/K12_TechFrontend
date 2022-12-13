import { useEffect } from "react";
import $ from 'jquery';
import { SearchBox } from "../Components/SearchBox";
export function CreateTicket() {
    useEffect(() => {
        return () => {
            const height = window.innerHeight;
            const navbarheight = $(".navbar").height();
            var finalHeight = height - navbarheight - 80;
            $(".GridBox").css('height', finalHeight);
        };
    }, []);
    const SuggestionBoxArray = [
        'Gulshan Martin',
        'Ivor Quentin',
        'Tilo Hedvig',
        'Áron Oline',
        'Petter Ibrahim',
        'Gilleasbuig Agnes',
        'Albert Shohreh',
        'Jelka Rochus',
        'Nanaia Klementina',
        'Ligita Bernie'
    ]
    return (
        <>
            <div className='row col-12'>
                <h1 className="PageHeading">Create Ticket</h1>
            </div>
            <div className="container-fluid px-0" id="GridDiv">
                <div className="GridBox p-3">
                    <div className="container ps-3">
                        <div className='row pt-4 d-flex align-items-center'>
                            <div className='col-md-6 mt-2'>
                                <SearchBox SuggestionData={SuggestionBoxArray}/>
                            </div>
                        </div>
                        <div className='mt-4'>
                            <div className='col-12 greyBox'>
                                <div className='Header'>
                                    <b className='font-16'>Device Issue</b><br />
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                </div>
                                <div className="row p-3">
                                    <div className="col-md-3">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="NoPower" />
                                            <label className="form-check-label ps-1" htmlFor="NoPower">
                                                No Power
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="WifiIssues" />
                                            <label className="form-check-label ps-1" htmlFor="WifiIssues">
                                                WIFI issues
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="ScreenIssue" />
                                            <label className="form-check-label ps-1" htmlFor="ScreenIssue">
                                                Screen Issue
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="ChargingIssues" />
                                            <label className="form-check-label ps-1" htmlFor="ChargingIssues">
                                                Charging Issues
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-3 pt-3">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="KeyboardIssues" />
                                            <label className="form-check-label ps-1" htmlFor="KeyboardIssues">
                                                Keyboard Issues
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-3 pt-3">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="LostorStolen" />
                                            <label className="form-check-label ps-1" htmlFor="LostorStolen">
                                                Lost or Stolen
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-3 pt-3">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="BrokenCasings" />
                                            <label className="form-check-label ps-1" htmlFor="BrokenCasings">
                                                Broken Casings
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-3 pt-3">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="Other" />
                                            <label className="form-check-label ps-1" htmlFor="Other">
                                                Other
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row p-4">
                                    <textarea placeholder="Notes*" rows="3" className="form-control"></textarea>
                                </div>
                                <div className="col-12 text-center p-5">
                                    <button className='SaveBtn'>Create Ticket</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}