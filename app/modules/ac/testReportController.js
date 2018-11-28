acModule.factory('testReportService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.apiServiceBaseUri;
        var serviceUrl = configService.rootUrlWebApi + '/Ac/Output';
        var calc = {
            sum: function (obj, name) {
                var total = 0;
                if (obj && obj.length > 0) {
                    angular.forEach(obj, function (v, k) {
                        var increase = v[name];
                        if (!increase) {
                            increase = 0;
                        }
                        total += increase;
                    });
                }
                return total;
            }
        }
        var result = {
            robot: calc,
            getReport: function () {
                $http.get(rootUrl + '/api/Ac/Ac/SendReport', { responseType: 'arraybuffer' }).success(function (data) {

                    var file = new Blob([data], { type: 'application/pdf' });
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                });
            },
        }
        return result;
    }
]);


acModule.controller('testReportController', [
    '$scope', '$rootScope', '$window', '$stateParams', '$timeout', '$sce', '$state', '$uibModal', '$log',
    'mdService', 'testReportService', 'clientService', 'configService', '$filter',
    function ($scope, $rootScope, $window, $stateParams, $timeout, $sce, $state, $uibModal, $log,
        mdService, testReportService, clientService, configService, $filter) {
        $scope.tempData = mdService.tempData;
        $scope.config = configService;
        $scope.serviceUrl = configService.apiServiceBaseUri;

        $scope.report = function () {
            testReportService.getReport();
        }
        var myElement = angular.element(document.querySelector('#reportViewer1'));
        myElement.telerik_ReportViewer({
            serviceUrl: $scope.serviceUrl + "/api/reports",
            templateUrl: "../../../_layouts/15/BTS.SP.ERP/AC/TestReport/telerikReportViewerTemplate.html",
            reportSource: {
                report: "UserTemplateReport.trdp",
                parameters: {
                    PUSERNAME: "admin",
                    PROFILE: "1"
                }
            },
            viewMode: telerikReportViewer.ViewModes.INTERACTIVE,
            scaleMode: telerikReportViewer.ScaleModes.SPECIFIC,
            scale: 1.0,

            ready: function () {

            },
        });
    }
]);


