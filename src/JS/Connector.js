import $ from 'jquery';
const BaseUrl = process.env.REACT_APP_Base_URL;
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Access-Control-Allow-Origin", "*");
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
export function ApiGetCall(endpoint) {
    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };
    return fetch(`${BaseUrl}${endpoint}`, requestOptions)
        .then((response) => response.text())
        .then((result) => { return result })
        .catch((error) => { return error });
}
export function ApiPutCall(endpoint, payload) {
    var urlencoded = payload;
    var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
    };
    return fetch(`${BaseUrl}${endpoint}`, requestOptions)
        .then((response) => response.text())
        .then((result) => { return result })
        .catch((error) => { return error });
}
export function ApiDeleteCall(endpoint, payload) {
    var urlencoded = payload;
    var requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
    };
    return fetch(`${BaseUrl}${endpoint}`, requestOptions)
        .then((response) => response.text())
        .then((result) => { return result })
        .catch((error) => { return error });
}
export function ApiPostCall(endpoint, payload) {
    var urlencoded = payload;
    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
    };
    return fetch(`${BaseUrl}${endpoint}`, requestOptions)
        .then((response) => response.text())
        .then((result) => { return result })
        .catch((error) => { return error });
}
