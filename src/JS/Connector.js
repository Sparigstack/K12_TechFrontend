import $ from 'jquery';
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