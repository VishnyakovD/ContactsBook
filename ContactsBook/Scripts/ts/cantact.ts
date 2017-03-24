class IdName {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

class Group extends IdName {
    contacts:Contact[]=[];
    constructor(id: number, name: string) {
        super(id, name);
    }
}

class Contact extends IdName {
    surname: string;
    age: number;
    group: Group;
    description: string;
    note: string;

    constructor(id: number, name: string, surname: string, age: number, group: Group, description: string, note: string) {
        super(id, name);
        this.surname = surname;
        this.age = age;
        this.group = group;
        this.description = description;
        this.note = note;
    }
}

class ContactManager {
    contacts: Contact[];
    groups: Group[];
    tableBody: JQuery;
    infoBloks: JQuery;

    constructor() {
        this.tableBody = $(".js-table-body");
        this.infoBloks = $(".js-info-bloks");
        try {
            this.initContacts();
            this.initGroups();
        } catch (e) {
           // this.initContacts();
           // this.initGroups();
        } 

    }

    initContacts(): void {
        $.post('/Home/GetContacts/', {})
            .done((data) => {
                this.contacts = JSON.parse(data);
                if (this.contacts) {
                     this.buildTable();
                }
            });
    }

    initGroups(): void {
        $.post('/Home/GetGroups/', {})
            .done((data) => {
                this.groups = JSON.parse(data);
            });
    }

    buildTable(): void {
        var bodyContent: string = "";
        this.contacts.forEach(cont => {
            bodyContent += this.buildRow(cont, true);
        });
        this.tableBody.html(bodyContent);
    }

    buildRow(cont: Contact, isNewRow: boolean): string {
        if (isNewRow) {
            return `
                    <tr data-id="${cont.id}">
                        <td>${cont.name}</td>
                        <td>${cont.surname}</td>
                    </tr>
                    `;
        }

        this.tableBody.find(`tr[data-id="${cont.id}"]`).html(`
                        <td>${cont.name}</td>
                        <td>${cont.surname}</td>
                        `);
        return "";
    }

    selectRow(e: JQueryEventObject): void {
        var edit = $(".js-edit");
        var id = $(e.currentTarget).data("id");
        if ($(e.currentTarget).hasClass("success")) {
            $(e.currentTarget).removeClass("success");
            this.removeInfoBlock(id);
        } else {
            $(e.currentTarget).addClass("success");
            this.addInfoBlock(this.contacts.filter(item => item.id === id)[0]);
        }
        var trs = this.tableBody.find("tr.success").length;

        if (trs !== 1) {
            edit.attr("disabled", "disabled");
        } else {
            edit.removeAttr("disabled");
        }
    }

    removeRow(id: number): void {
        this.tableBody.find(`tr[data-id="${id}"]`).remove();
    }

    addInfoBlock(cont: Contact): void {
        this.infoBloks.append(`
            <div class="alert alert-info" data-id="${cont.id}">
                <h4>${cont.name} ${cont.surname}</h4>
                <div>
                    <span>Age</span>
                    <label>${cont.age}</label>
                </div>
                <div>
                    <span>Group</span>
                    <label>${cont.group.name}</label>
                </div>
                <div>
                    <span>Description</span>
                    <label>${cont.description}</label>
                </div>
                <div>
                    <span>Note</span>
                    <label>${cont.note}</label>
                </div>
            </div> 
                `);
    }

    removeInfoBlock(id: number) {
        this.infoBloks.find(`div[data-id="${id}"]`).remove();
    }

    removeContacts(): void {
        var ids = [];
        this.tableBody.find(`tr.success`).each((i, elem) => {
            ids.push($(elem).data("id"));
            this.removeInfoBlock($(elem).data("id"));
            this.removeRow($(elem).data("id"));
            this.contacts = this.contacts.filter(el => el.id !== $(elem).data("id"));
        });
        if (ids.length < 1) {
            return;
        }
        $.post('/Home/RemoveContacts/', { ids: ids });

    }

    createContact(): void {
        var bodyWnd = `
        <div class="js-contact">
              <input type="hidden" id="id" value="-1"/>
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <label>Name</label>
                        <input type="text" class="form-control" id="name">
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <label>Surname</label>
                        <input type="text" class="form-control" id="surname">
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <label>Age</label>
                        <input type="number" class="form-control" id="age">
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <label>Group</label>
                        <select class="form-control" id="group">
                `;
        this.groups.forEach(gr => {
            bodyWnd += `<option value="${gr.id}">${gr.name}</option>`;
        });

        bodyWnd += `</select>
                    </div>
                </div>

                <div>
                    <label>Descroption</label>
                    <textarea class="form-control" id="description"></textarea>
                </div>

                <div>
                    <label>Note</label>
                    <textarea class="form-control" id="note"></textarea>
                </div>
            </div>
                        `;

        modalManager.show("Create contact", bodyWnd);
    }

    editContact(): void {
        var id = parseInt(this.tableBody.find("tr.success").data("id"));
        var contact = this.contacts.filter(elem => elem.id === id)[0];
        var bodyWnd = `
        <div class="js-contact">
              <input type="hidden" id="id" value="${contact.id}"/>
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <label>Name</label>
                        <input type="text" class="form-control" id="name" value="${contact.name}">
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <label>Surname</label>
                        <input type="text" class="form-control" id="surname" value="${contact.surname}">
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <label>Age</label>
                        <input type="number" class="form-control" id="age" value="${contact.age}">
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <label>Group</label>
                        <select class="form-control" id="group">
                `;
        this.groups.forEach(gr => {
            var sel = "";
            if (contact.group.id===gr.id) {
                sel = "selected";
            }
            bodyWnd += `<option ${sel} value="${gr.id}">${gr.name}</option>`;
        });

        bodyWnd += `</select>
                    </div>
                </div>

                <div>
                    <label>Descroption</label>
                    <textarea class="form-control" id="description">${contact.description}</textarea>
                </div>

                <div>
                    <label>Note</label>
                    <textarea class="form-control" id="note">${contact.note}</textarea>
                </div>
            </div>
                        `;

        modalManager.show("Edit contact", bodyWnd);
    }

    save(): void {
        var id = parseInt(modalManager.modal.find("#id").val());
        var age = parseInt(modalManager.modal.find("#age").val());
        var groupId = parseInt(modalManager.modal.find("#group option:selected").val());

        var contact = new Contact(
            id,
            modalManager.modal.find("#name").val(),
            modalManager.modal.find("#surname").val(),
            age,
            this.groups.filter(g => g.id === groupId)[0],
            modalManager.modal.find("#description").val(),
            modalManager.modal.find("#note").val()
        );

        if (contact.id === -1) {
            $.post('/Home/SaveContact/', { contact: JSON.stringify(contact) }).done(data => {
                contact.id = parseInt(data);
                this.contacts.push(contact);
                this.tableBody.append(this.buildRow(contact, true));
            });
        } else {
            var tmpCont = this.contacts.filter(item => item.id === contact.id)[0];
            tmpCont.name = contact.name;
            tmpCont.age = contact.age;
            tmpCont.description = contact.description;
            tmpCont.note = contact.note;
            tmpCont.group = contact.group;
            tmpCont.surname = contact.surname;

            this.buildRow(contact, false);
            $.post('/Home/SaveContact/', { contact: JSON.stringify(contact) });
        }

    }
}

var contactManager: ContactManager;
$(() => {
    contactManager = new ContactManager();

    $(contactManager.tableBody).on("click", "tr", (e) => {
        contactManager.selectRow(e);
    });

    if ($(".js-modal").length > 0) {

    }



});