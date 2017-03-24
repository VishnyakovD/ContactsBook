

class GroupManager {
    groups: Group[];
    tableBody: JQuery;
    infoBloks: JQuery;

    constructor() {
        this.tableBody = $(".js-group-body");
        this.initGroups();
    }

    initGroups(): void {
        $.post('/Home/GetGroupsFull/', {})
            .done((data) => {
                this.groups = JSON.parse(data);
                this.buildGroups();
            });
    }

    buildGroups(): void {
        var bodyContent: string = "";
        this.groups.forEach(cont => {
            bodyContent += this.buildGroup(cont, true);
        });
        this.tableBody.html(bodyContent);
    }

    buildGroup(cont: Group, isNewRow: boolean): string {
        if (isNewRow) {
         var body= `
        <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
            <div class="panel panel-default">
                <div class="panel-heading js-group-head" role="tab" id="rrrrr" data-id="${cont.id}">
                    <h4 class="panel-title">
                        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#gr${cont.id}" aria-expanded="true" aria-controls="gr${cont.id}">
                           ${cont.name} <span class="badge">${cont.contacts.length}</span>
                        </a>
                    </h4>
                </div>
                <div id="gr${cont.id}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="gr${cont.id}">
                    <div class="panel-body">`;
            if (cont.contacts.length>0) {
               body += `
        <div class="table-responsive">
            <table class="table table-condensed table-hover table-bordered">
                <thead>
                    <tr class="active">
                        <th>Name</th>
                        <th>Surname</th>
                    </tr>
                </thead>
            <tbody class="">
                        `;
                cont.contacts.forEach(item => {
                body += `
                    <tr class="active">
                        <td>${item.name}</td>
                        <td>${item.surname}</td>
                    </tr>        
                        `; 
                });


                
                body += `
            </tbody>
          </table>
                        `; 
            }

                      
              body+= `  </div>
                </div>
            </div>
        </div>
            <br>        `;

            return body;
        }

        this.tableBody.find(`div[data-id="${cont.id}"]`).html(`
                     <h4 class="panel-title">
                        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#gr${cont.id}" aria-expanded="true" aria-controls="gr${cont.id}">
                           ${cont.name} <span class="badge">${cont.contacts.length}</span>
                        </a>
                    </h4>
                        `);
        return "";
    }

    selectGruop(e: JQueryEventObject): void {
        var edit = $(".js-edit");
        if ($(e.currentTarget).hasClass("success")) {
            $(e.currentTarget).removeClass("success");
        } else {
            $(e.currentTarget).addClass("success");
        }
        var trs = this.tableBody.find("div.success").length;

        if (trs !== 1) {
            edit.attr("disabled", "disabled");
        } else {
            edit.removeAttr("disabled");
        }
    }

    removeGroup(id: number): void {
        this.tableBody.find(`div[data-id="${id}"]`).closest(".panel-group").remove();
    }


    removeGroups(): void {
        var ids = [];
        this.tableBody.find(`div.success`).each((i, elem) => {
            ids.push($(elem).data("id"));
            this.removeGroup($(elem).data("id"));
            this.groups = this.groups.filter(el => el.id !== $(elem).data("id"));
        });
        if (ids.length < 1) {
            return;
        }
        $.post('/Home/RemoveGroups/', { ids: ids });

    }

    createGroup(): void {
        var bodyWnd = `
        <div class="js-group">
              <input type="hidden" id="id" value="-1"/>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <label>Name</label>
                        <input type="text" class="form-control" id="name">
                    </div>
                </div>                
            </div>
                        `;

        modalManager.show("Create group", bodyWnd);
    }

    editGroup(): void {
        var id = parseInt(this.tableBody.find("div.success").data("id"));
        var grpup = this.groups.filter(elem => elem.id === id)[0];
        var bodyWnd = `
        <div class="js-group">
              <input type="hidden" id="id" value="${grpup.id}"/>
                <div class="row">
                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <label>Name</label>
                        <input type="text" class="form-control" id="name" value="${grpup.name}">
                    </div>
                </div>             
            </div>
                        `;

        modalManager.show("Edit group", bodyWnd);
    }

    save(): void {
        var id = parseInt(modalManager.modal.find("#id").val());
        var group = new Group(
            id,
            modalManager.modal.find("#name").val()
        );

        if (group.id === -1) {
            $.post('/Home/SaveGroup/', { group: JSON.stringify(group) }).done(data => {
                group.id = parseInt(data);
                this.groups.push(group);
                this.tableBody.append(this.buildGroup(group, true));
            });
        } else {
            var tmpCont = this.groups.filter(item => item.id === group.id)[0];
            tmpCont.name = group.name;
            this.buildGroup(group, false);
            $.post('/Home/SaveGroup/', { group: JSON.stringify(group) });
        }

    }
}

var groupManager: GroupManager;
$(() => {
    groupManager = new GroupManager();

    $(groupManager.tableBody).on("click", "div.js-group-head", (e) => {
        groupManager.selectGruop(e);
    });
});