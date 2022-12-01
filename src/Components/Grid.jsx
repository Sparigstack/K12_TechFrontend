import $ from 'jquery';
import { useEffect } from 'react';
export function Grid(props) {
    useEffect(() => {
        const height = window.innerHeight;
        const navbarheight = $(".navbar").height();
        var finalHeight = height - navbarheight - 90;
        $(".GridBox").css('height',finalHeight);
    }, []);
    return(
        <>
            <h1 className="PageHeading">{props.PageHeading}</h1>
            <div className="container-fluid px-0 pt-2">
                <div className="GridBox">{props.GridBoxContent}</div>
            </div>
        </>
    )
}