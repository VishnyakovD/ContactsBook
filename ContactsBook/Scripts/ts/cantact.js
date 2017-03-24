var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IdName = (function () {
    function IdName(id, name) {
        this.id = id;
        this.name = name;
    }
    return IdName;
}());
var Group = (function (_super) {
    __extends(Group, _super);
    function Group(id, name) {
        _super.call(this, id, name);
        this.contacts = [];
    }
    return Group;
}(IdName));
var Contact = (function (_super) {
    __extends(Contact, _super);
    function Contact(id, name, surname, age, group, description, note) {
        _super.call(this, id, name);
        this.surname = surname;
        this.age = age;
        this.group = group;
        this.description = description;
        this.note = note;
    }
    return Contact;
}(IdName));
var ContactManager = (function () {
    function ContactManager() {
        this.tableBody = $(".js-table-body");
        this.infoBloks = $(".js-info-bloks");
        try {
            this.initContacts();
            this.initGroups();
        }
        catch (e) {
        }
    }
    ContactManager.prototype.initContacts = function () {
        var _this = this;
        $.post('/Home/GetContacts/', {})
            .done(function (data) {
            _this.contacts = JSON.parse(data);
            if (_this.contacts) {
                _this.buildTable();
            }
        });
    };
    ContactManager.prototype.initGroups = function () {
        var _this = this;
        $.post('/Home/GetGroups/', {})
            .done(function (data) {
            _this.groups = JSON.parse(data);
        });
    };
    ContactManager.prototype.buildTable = function () {
        var _this = this;
        var bodyContent = "";
        this.contacts.forEach(function (cont) {
            bodyContent += _this.buildRow(cont, true);
        });
        this.tableBody.html(bodyContent);
    };
    ContactManager.prototype.buildRow = function (cont, isNewRow) {
        if (isNewRow) {
            return "\n                    <tr data-id=\"" + cont.id + "\">\n                        <td>" + cont.name + "</td>\n                        <td>" + cont.surname + "</td>\n                    </tr>\n                    ";
        }
        this.tableBody.find("tr[data-id=\"" + cont.id + "\"]").html("\n                        <td>" + cont.name + "</td>\n                        <td>" + cont.surname + "</td>\n                        ");
        return "";
    };
    ContactManager.prototype.selectRow = function (e) {
        var edit = $(".js-edit");
        var id = $(e.currentTarget).data("id");
        if ($(e.currentTarget).hasClass("success")) {
            $(e.currentTarget).removeClass("success");
            this.removeInfoBlock(id);
        }
        else {
            $(e.currentTarget).addClass("success");
            this.addInfoBlock(this.contacts.filter(function (item) { return item.id === id; })[0]);
        }
        var trs = this.tableBody.find("tr.success").length;
        if (trs !== 1) {
            edit.attr("disabled", "disabled");
        }
        else {
            edit.removeAttr("disabled");
        }
    };
    ContactManager.prototype.removeRow = function (id) {
        this.tableBody.find("tr[data-id=\"" + id + "\"]").remove();
    };
    ContactManager.prototype.addInfoBlock = function (cont) {
        this.infoBloks.append("\n            <div class=\"alert alert-info\" data-id=\"" + cont.id + "\">\n                <h4>" + cont.name + " " + cont.surname + "</h4>\n                <div>\n                    <span>Age</span>\n                    <label>" + cont.age + "</label>\n                </div>\n                <div>\n                    <span>Group</span>\n                    <label>" + cont.group.name + "</label>\n                </div>\n                <div>\n                    <span>Description</span>\n                    <label>" + cont.description + "</label>\n                </div>\n                <div>\n                    <span>Note</span>\n                    <label>" + cont.note + "</label>\n                </div>\n            </div> \n                ");
    };
    ContactManager.prototype.removeInfoBlock = function (id) {
        this.infoBloks.find("div[data-id=\"" + id + "\"]").remove();
    };
    ContactManager.prototype.removeContacts = function () {
        var _this = this;
        var ids = [];
        this.tableBody.find("tr.success").each(function (i, elem) {
            ids.push($(elem).data("id"));
            _this.removeInfoBlock($(elem).data("id"));
            _this.removeRow($(elem).data("id"));
            _this.contacts = _this.contacts.filter(function (el) { return el.id !== $(elem).data("id"); });
        });
        if (ids.length < 1) {
            return;
        }
        $.post('/Home/RemoveContacts/', { ids: ids });
    };
    ContactManager.prototype.createContact = function () {
        var bodyWnd = "\n        <div class=\"js-contact\">\n              <input type=\"hidden\" id=\"id\" value=\"-1\"/>\n                <div class=\"row\">\n                    <div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n                        <label>Name</label>\n                        <input type=\"text\" class=\"form-control\" id=\"name\">\n                    </div>\n                    <div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n                        <label>Surname</label>\n                        <input type=\"text\" class=\"form-control\" id=\"surname\">\n                    </div>\n                </div>\n                \n                <div class=\"row\">\n                    <div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n                        <label>Age</label>\n                        <input type=\"number\" class=\"form-control\" id=\"age\">\n                    </div>\n                    <div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n                        <label>Group</label>\n                        <select class=\"form-control\" id=\"group\">\n                ";
        this.groups.forEach(function (gr) {
            bodyWnd += "<option value=\"" + gr.id + "\">" + gr.name + "</option>";
        });
        bodyWnd += "</select>\n                    </div>\n                </div>\n\n                <div>\n                    <label>Descroption</label>\n                    <textarea class=\"form-control\" id=\"description\"></textarea>\n                </div>\n\n                <div>\n                    <label>Note</label>\n                    <textarea class=\"form-control\" id=\"note\"></textarea>\n                </div>\n            </div>\n                        ";
        modalManager.show("Create contact", bodyWnd);
    };
    ContactManager.prototype.editContact = function () {
        var id = parseInt(this.tableBody.find("tr.success").data("id"));
        var contact = this.contacts.filter(function (elem) { return elem.id === id; })[0];
        var bodyWnd = "\n        <div class=\"js-contact\">\n              <input type=\"hidden\" id=\"id\" value=\"" + contact.id + "\"/>\n                <div class=\"row\">\n                    <div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n                        <label>Name</label>\n                        <input type=\"text\" class=\"form-control\" id=\"name\" value=\"" + contact.name + "\">\n                    </div>\n                    <div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n                        <label>Surname</label>\n                        <input type=\"text\" class=\"form-control\" id=\"surname\" value=\"" + contact.surname + "\">\n                    </div>\n                </div>\n                \n                <div class=\"row\">\n                    <div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n                        <label>Age</label>\n                        <input type=\"number\" class=\"form-control\" id=\"age\" value=\"" + contact.age + "\">\n                    </div>\n                    <div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n                        <label>Group</label>\n                        <select class=\"form-control\" id=\"group\">\n                ";
        this.groups.forEach(function (gr) {
            var sel = "";
            if (contact.group.id === gr.id) {
                sel = "selected";
            }
            bodyWnd += "<option " + sel + " value=\"" + gr.id + "\">" + gr.name + "</option>";
        });
        bodyWnd += "</select>\n                    </div>\n                </div>\n\n                <div>\n                    <label>Descroption</label>\n                    <textarea class=\"form-control\" id=\"description\">" + contact.description + "</textarea>\n                </div>\n\n                <div>\n                    <label>Note</label>\n                    <textarea class=\"form-control\" id=\"note\">" + contact.note + "</textarea>\n                </div>\n            </div>\n                        ";
        modalManager.show("Edit contact", bodyWnd);
    };
    ContactManager.prototype.save = function () {
        var _this = this;
        var id = parseInt(modalManager.modal.find("#id").val());
        var age = parseInt(modalManager.modal.find("#age").val());
        var groupId = parseInt(modalManager.modal.find("#group option:selected").val());
        var contact = new Contact(id, modalManager.modal.find("#name").val(), modalManager.modal.find("#surname").val(), age, this.groups.filter(function (g) { return g.id === groupId; })[0], modalManager.modal.find("#description").val(), modalManager.modal.find("#note").val());
        if (contact.id === -1) {
            $.post('/Home/SaveContact/', { contact: JSON.stringify(contact) }).done(function (data) {
                contact.id = parseInt(data);
                _this.contacts.push(contact);
                _this.tableBody.append(_this.buildRow(contact, true));
            });
        }
        else {
            var tmpCont = this.contacts.filter(function (item) { return item.id === contact.id; })[0];
            tmpCont.name = contact.name;
            tmpCont.age = contact.age;
            tmpCont.description = contact.description;
            tmpCont.note = contact.note;
            tmpCont.group = contact.group;
            tmpCont.surname = contact.surname;
            this.buildRow(contact, false);
            $.post('/Home/SaveContact/', { contact: JSON.stringify(contact) });
        }
    };
    return ContactManager;
}());
var contactManager;
$(function () {
    contactManager = new ContactManager();
    $(contactManager.tableBody).on("click", "tr", function (e) {
        contactManager.selectRow(e);
    });
    if ($(".js-modal").length > 0) {
    }
});
//# sourceMappingURL=cantact.js.map