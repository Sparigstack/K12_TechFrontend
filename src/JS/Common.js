import $ from 'jquery';
export function MMDDYYYY(today) {
    var date = new Date(today);
    var yr = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, "0");
    var day = date.getDate().toString().padStart(2, "0");
    var newDate = month + '-' + day + '-' + yr;
    return newDate;
}
export function DDMMYYYY(today) {
    var date = new Date(today);
    var yr = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, "0");
    var day = date.getDate().toString().padStart(2, "0");
    var newDate = day + '-' + month + '-' + yr;
    return newDate;
}
export function YYYYMMDD(date) {
    var d = new Date(date);
    var curr_year = d.getFullYear();
    var curr_month = (d.getMonth() + 1).toString().padStart(2, "0");
    var curr_date = d.getDate().toString().padStart(2, "0");
    var newDate = curr_year + "-" + curr_month + "-" + curr_date;
    return newDate;
}
export function CheckValidation(formID) {
    var isValid = true;
    $('#' + formID).find('select, textarea, input').each(function () {
        if (!$(this).prop('required')) {
        } else {
            var inputParent = findParent(this);
            if (!$(inputParent).hasClass('d-none')) {

                if (!isValidValue($(this).val())) {

                    $(this).parent().find(".invalid-feedback").css('display', 'block');
                    isValid = false;
                } else {
                    $(this).parent().find(".invalid-feedback").css('display', '');
                }
            }
        }
    });
    return isValid;
}
export function checkValidationByElement(element) {
    var isValid = true;
    $(element).find('select, textarea, input').each(function () {
        if (!$(this).prop('required')) {

        } else {
            var inputParent = findParent(this);
            if (!$(inputParent).hasClass('d-none')) {

                if (!isValidValue($(this).val())) {

                    $(this).parent().find(".invalid-feedback").css('display', 'block');
                    isValid = false;
                } else {
                    $(this).parent().find(".invalid-feedback").css('display', '');
                }
            }
        }
    });
    return isValid;
}
function isValidValue(value) {
    if (value == undefined || value == null || value == 0 || value == '' || value == "" || value == NaN) {
        return false;
    }
    return true;
}
function findParent(element) {
    var parentElement = $(element).parent();
    for (var i = 0; i < 12; i++) {
        if ($(parentElement).hasClass('parent')) {
            return parentElement;
        }
        else {
            parentElement = $(parentElement).parent();
        }
    }
}
export function ShowSuggestionBox(BoxId) {
    if ($("#" + BoxId).val() != "") {
        $(".SuggestionBox").css('visibility', 'visible');
        $(".SuggestionBox").css('opacity', '1');
    } else {
        $(".SuggestionBox").css('visibility', 'hidden');
        $(".SuggestionBox").css('opacity', '0');
    }
}
export var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};
export function ShowLoder() {
    $("#Overlay").show();
    $("#LoderId").show();
}
export function HideLoder() {
    $("#Overlay").hide();
    $("#LoderId").hide();
}
