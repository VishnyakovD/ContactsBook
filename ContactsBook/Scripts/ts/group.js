var GroupManager = (function () {
    function GroupManager() {
        this.tableBody = $(".js-group-body");
        this.initGroups();
    }
    GroupManager.prototype.initGroups = function () {
        var _this = this;
        $.post('/Home/GetGroupsFull/', {})
            .done(function (data) {
            _this.groups = JSON.parse(data);
            _this.buildGroups();
        });
    };
    GroupManager.prototype.buildGroups = function () {
        var _this = this;
        var bodyContent = "";
        this.groups.forEach(function (cont) {
            bodyContent += _this.buildGroup(cont, true);
        });
        this.tableBody.html(bodyContent);
    };
    GroupManager.prototype.buildGroup = function (cont, isNewRow) {
        if (isNewRow) {
            var body = "\n        <div class=\"panel-group\" id=\"accordion\" role=\"tablist\" aria-multiselectable=\"true\">\n            <div class=\"panel panel-default\">\n                <div class=\"panel-heading js-group-head\" role=\"tab\" id=\"rrrrr\" data-id=\"" + cont.id + "\">\n                    <h4 class=\"panel-title\">\n                        <a role=\"button\" data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#gr" + cont.id + "\" aria-expanded=\"true\" aria-controls=\"gr" + cont.id + "\">\n                           " + cont.name + " <span class=\"badge\">" + cont.contacts.length + "</span>\n                        </a>\n                    </h4>\n                </div>\n                <div id=\"gr" + cont.id + "\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"gr" + cont.id + "\">\n                    <div class=\"panel-body\">";
            if (cont.contacts.length > 0) {
                body += "\n        <div class=\"table-responsive\">\n            <table class=\"table table-condensed table-hover table-bordered\">\n                <thead>\n                    <tr class=\"active\">\n                        <th>Name</th>\n                        <th>Surname</th>\n                    </tr>\n                </thead>\n            <tbody class=\"\">\n                        ";
                cont.contacts.forEach(function (item) {
                    body += "\n                    <tr class=\"active\">\n                        <td>" + item.name + "</td>\n                        <td>" + item.surname + "</td>\n                    </tr>        \n                        ";
                });
                body += "\n            </tbody>\n          </table>\n                        ";
            }
            body += "  </div>\n                </div>\n            </div>\n        </div>\n            <br>        ";
            return body;
        }
        this.tableBody.find("div[data-id=\"" + cont.id + "\"]").html("\n                     <h4 class=\"panel-title\">\n                        <a role=\"button\" data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#gr" + cont.id + "\" aria-expanded=\"true\" aria-controls=\"gr" + cont.id + "\">\n                           " + cont.name + " <span class=\"badge\">" + cont.contacts.length + "</span>\n                        </a>\n                    </h4>\n                        ");
        return "";
    };
    GroupManager.prototype.selectGruop = function (e) {
        var edit = $(".js-edit");
        if ($(e.currentTarget).hasClass("success")) {
            $(e.currentTarget).removeClass("success");
        }
        else {
            $(e.currentTarget).addClass("success");
        }
        var trs = this.tableBody.find("div.success").length;
        if (trs !== 1) {
            edit.attr("disabled", "disabled");
        }
        else {
            edit.removeAttr("disabled");
        }
    };
    GroupManager.prototype.removeGroup = function (id) {
        this.tableBody.find("div[data-id=\"" + id + "\"]").closest(".panel-group").remove();
    };
    GroupManager.prototype.removeGroups = function () {
        var _this = this;
        var ids = [];
        this.tableBody.find("div.success").each(function (i, elem) {
            ids.push($(elem).data("id"));
            _this.removeGroup($(elem).data("id"));
            _this.groups = _this.groups.filter(function (el) { return el.id !== $(elem).data("id"); });
        });
        if (ids.length < 1) {
            return;
        }
        $.post('/Home/RemoveGroups/', { ids: ids });
    };
    GroupManager.prototype.createGroup = function () {
        var bodyWnd = "\n        <div class=\"js-group\">\n              <input type=\"hidden\" id=\"id\" value=\"-1\"/>\n                <div class=\"row\">\n                    <div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\n                        <label>Name</label>\n                        <input type=\"text\" class=\"form-control\" id=\"name\">\n                    </div>\n                </div>                \n            </div>\n                        ";
        modalManager.show("Create group", bodyWnd);
    };
    GroupManager.prototype.editGroup = function () {
        var id = parseInt(this.tableBody.find("div.success").data("id"));
        var grpup = this.groups.filter(function (elem) { return elem.id === id; })[0];
        var bodyWnd = "\n        <div class=\"js-group\">\n              <input type=\"hidden\" id=\"id\" value=\"" + grpup.id + "\"/>\n                <div class=\"row\">\n                   <div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\n                        <label>Name</label>\n                        <input type=\"text\" class=\"form-control\" id=\"name\" value=\"" + grpup.name + "\">\n                    </div>\n                </div>             \n            </div>\n                        ";
        modalManager.show("Edit group", bodyWnd);
    };
    GroupManager.prototype.save = function () {
        var _this = this;
        var id = parseInt(modalManager.modal.find("#id").val());
        var group = new Group(id, modalManager.modal.find("#name").val());
        if (group.id === -1) {
            $.post('/Home/SaveGroup/', { group: JSON.stringify(group) }).done(function (data) {
                group.id = parseInt(data);
                _this.groups.push(group);
                _this.tableBody.append(_this.buildGroup(group, true));
            });
        }
        else {
            var tmpCont = this.groups.filter(function (item) { return item.id === group.id; })[0];
            tmpCont.name = group.name;
            this.buildGroup(group, false);
            $.post('/Home/SaveGroup/', { group: JSON.stringify(group) });
        }
    };
    return GroupManager;
}());
var groupManager;
$(function () {
    groupManager = new GroupManager();
    $(groupManager.tableBody).on("click", "div.js-group-head", function (e) {
        groupManager.selectGruop(e);
    });
});
//# sourceMappingURL=group.js.map