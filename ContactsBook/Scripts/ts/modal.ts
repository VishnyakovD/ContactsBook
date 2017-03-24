class ModalManager {
    modal: JQuery;

    constructor() {
        this.modal = $(".js-modal");
    }

    show(title: string, body: string): void {
        this.modal.find(".js-modal-title").html(title);
        this.modal.find(".js-modal-body").html(body);
        (<any>this.modal).modal("show");
    }

    save(): void {
        if (this.modal.find(".js-contact").length > 0) {
            contactManager.save();
        } else {
            groupManager.save();
        }
    }
}

var modalManager: ModalManager;
$(() => {
    if ($(".js-modal").length>0) {
        modalManager = new ModalManager();
    }

});