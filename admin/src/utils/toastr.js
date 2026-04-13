import toastr from "toastr";

toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: true,
    positionClass: "toast-top-center",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
};

export const successToastr = (message, title = "") => {
    toastr.success(message, title);
};

export const errorToastr = (message, title = "") => {
    toastr.error(message, title);
};

export const warningToastr = (message, title = "") => {
    toastr.warning(message, title);
};

export const infoToastr = (message, title = "") => {
    toastr.info(message, title);
};

export default toastr;
