var ModalManager = (function () {
    function ModalManager() {
        this.modal = $(".js-modal");
    }
    ModalManager.prototype.show = function (title, body) {
        this.modal.find(".js-modal-title").html(title);
        this.modal.find(".js-modal-body").html(body);
        this.modal.modal("show");
    };
    ModalManager.prototype.save = function () {
        if (this.modal.find(".js-contact").length > 0) {
            contactManager.save();
        }
        else {
            groupManager.save();
        }
    };
    return ModalManager;
}());
var modalManager;
$(function () {
    if ($(".js-modal").length > 0) {
        modalManager = new ModalManager();
    }
});
