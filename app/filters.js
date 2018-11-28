var ngFilters = angular.module('ngFilters', ['ngResource']);

ngFilters.filter('attachFile', function () {
    return function (x) {
        var tmp = "";
        if (x) {
            var lstlink = new Array();
            lstlink = x.split(';');
            tmp += "<ul>";
            for (var i = 0; i < lstlink.length; i++) {
                if (lstlink[i]) {
                    var filename = lstlink[i].substr(lstlink[i].lastIndexOf('/') + 1, lstlink[i].length);
                    tmp += "<li>";
                    tmp += "<a href='/UploadFile/" + lstlink[i] + "' download>" + filename + "</a>";
                    tmp += "</li>";
                }
            }
            tmp += "</ul>"
        }
        return tmp;
    }
});

ngFilters.filter('displayBool', function () {
    return function (input) {
        if (input != 0) {
            return "<i class='glyphicon glyphicon-ok'></i>";
        } else {
            return "<i class='glyphicon glyphicon-remove'></i>";
        }
    }
});

ngFilters.filter('attachFileEx', function () {
    return function (x) {
        var tmp = "";
        if (x) {
            var lstlink = new Array();
            lstlink = x.split(';');
            tmp += "<ul>";
            for (var i = 0; i < lstlink.length; i++) {
                if (lstlink[i]) {
                    var filename = lstlink[i].substr(lstlink[i].lastIndexOf('/') + 1, lstlink[i].length);
                    tmp += "<li>";
                    tmp += "<a download href='/UploadFile/" + lstlink[i] + "'>" + filename + "</a> &nbsp;&nbsp;&nbsp; <i ng-click='deletefile(" + lstlink[i] + ")' class='fa fa-remove'></i>";
                    tmp += "</li>";
                }
            }
            tmp += "</ul>"
        }
        return tmp;
    }
});