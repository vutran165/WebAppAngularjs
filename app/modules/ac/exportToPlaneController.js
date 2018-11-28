acModule.factory('exportToPlaneService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.apiServiceBaseUri;
        var serviceUrl = configService.rootUrlWebApi + '/Ac/Output';
        //var serviceUrl = rootUrl + '/_vti_bin/Apps/AC/CloseoutService.svc';
        var calc = {
            sum: function (obj, name) {
                var total = 0
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
            getWareHouseByUnit: function (maDonVi, callback) {
                $http.get(rootUrl + '/api/Md/WareHouse/GetByUnit/' + maDonVi).success(callback);
            },
            getPeriodByUnit: function (maDonVi, callback) {
                $http.get(rootUrl + '/api/Md/Period/GetByUnit/' + maDonVi).success(callback);
            },
            getNewParameter: function (callback) {
                $http.get(serviceUrl + '/GetNewParameter').success(callback);
            },
            postItem: function (filter, callback) {
                $http.post(serviceUrl + '/ReportExportToPlane', filter).success(callback);
            },
            getCurrentUser: function (callback) {
                $http.get(rootUrl + '/api/Authorize/User/GetCurrentUser').success(callback);
            },
            postExportExcel: function (json, filename) {
            $http({
                url: configService.rootUrlWebApi + '/Ac/OutPut' + '/PostExportExcelToPlane',
                method: "POST",
                data: json, //this is your json data string
                headers: {
                    'Content-type': 'application/json'
                },
                responseType: 'arraybuffer'
            }).success(function (data, status, headers, config) {
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                var objectUrl = URL.createObjectURL(blob);
                a.href = objectUrl;
                a.download = filename + ".xlsx";
                a.click();
                // window.URL.revokeObjectURL(objectUrl);
            }).error(function (data, status, headers, config) {
                //upload failed
            });

                //$http.post(serviceUrl + '/WriteDataToExcel', data).success(callback);
        },
        }
        return result;
    }
]);


acModule.controller('exportToPlaneController', [
    '$scope', '$rootScope', '$window', '$stateParams', '$timeout', '$sce', '$state', '$uibModal', '$log',
    'mdService', 'exportToPlaneService', 'clientService', 'configService', '$filter', 'serviceInventoryAndWareHouse', 'serviceInventoryAndCompany', 'serviceInventoryAndMerchandiseType', 'serviceInventoryAndMerchandise', 'serviceInventoryAndMerchandiseGroup',
    function ($scope, $rootScope, $window, $stateParams, $timeout, $sce, $state, $uibModal, $log,
        mdService, exportToPlaneService, clientService, configService, $filter, serviceInventoryAndWareHouse, serviceSelectCompany, serviceInventoryAndMerchandiseType, serviceInventoryAndMerchandise, serviceInventoryAndMerchandiseGroup) {
        $scope.tempData = mdService.tempData;
        $scope.config = configService;
        $scope.target = {
            objectUser: {}
        };

        $scope.userInformation = {};

        $scope.tagCompanies = [];
        $scope.tagMerchandises = [];




        // Company
        $scope.selectCompany = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdCompany', 'selectData'),
                controller: 'companyAllDataController',
                resolve: {
                    serviceSelectData: function () {
                        return serviceSelectCompany;
                    },
                    filterObject: function () {
                        return {

                        }
                    }
                }
            });
            modalInstance.result.then(function (updatedData) {
                console.log(updatedData);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        $scope.removeCompany = function (index) {
            $scope.tagCompanies.splice(index, 1);
        }

        $scope.$watch('tagCompanies', function (newValue, oldValue) {
            var values = $scope.tagCompanies.map(function (element) {
                return element.id;
            });
            $scope.target.companyCodes = values.join();
            console.log($scope.tagCompanies);
        }, true);

        //Merchandise
        console.log(serviceInventoryAndMerchandise);
        $scope.selectMerchandise = function () {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('MdMerchandise', 'selectDataSimple'),
                controller: 'merchandiseSimpleSelectDataController',
                resolve: {
                    serviceSelectData: function () {
                        return serviceInventoryAndMerchandise;
                    },
                    filterObject: function () {
                        return {

                        }
                    }
                }
            });
            modalInstance.result.then(function (updatedData) {
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        }
        $scope.removeMerchandise = function (index) {
            $scope.tagMerchandises.splice(index, 1);
        }
        $scope.$watch('tagMerchandises', function (newValue, oldValue) {
            var values = $scope.tagMerchandises.map(function (element) {
                return element.value;
            });
            $scope.target.merchandiseCodes = values.join();
        }, true);



        $rootScope.$on('$locationChangeStart',
            function (event, next, current) {
                $scope.tagCompanies.clear();

                $scope.tagMerchandises.clear();

            });

        function filterData() {
            exportToPlaneService.getNewParameter(function(response) {
                $scope.target = response;


                exportToPlaneService.getCurrentUser(function (response) {
                    $scope.target.objectUser = response;
                });
            });

            $scope.tagCompanies = serviceSelectCompany.getSelectData();

        }

        filterData();
        $scope.report = function () {
            $state.go('reportOutputToPlane', { obj: $scope.target });

        };
        $scope.printExcel = function () {
            if ($scope.target.donViHaiQuanCodes == "") {
                $scope.target.donViHaiQuanCodes = $scope.data.id;
            }
            exportToPlaneService.postExportExcel($scope.target, "BaoCaoXuatHangLenTauBay");
        }

    }
]);

nvModule.controller('reportExportToPlaneController', [
    '$scope', '$window', '$stateParams', '$timeout', '$state', 'serviceInventoryAndCompany', '$rootScope',
    'nvService', 'exportToPlaneService', 'mdService', 'clientService', '$filter', function ($scope, $window, $stateParams, $timeout, $state, serviceInventoryAndCompany, $rootScope,
nvService, exportToPlaneService, mdService, clientService, $filter) {
        var para = $state.params.obj;
        console.log(para);
        

        $scope.goIndex = function () {
            $state.go('outputToPlane');
        }

        $scope.robot = angular.copy(exportToPlaneService.robot);
        $scope.tempData = mdService.tempData;

        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { Id: code }, true);
            if (data && data.length == 1) {
                return data[0].text;
            };
            return "";
        }


        $scope.nameOfObject = function(model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
        }

      

        $scope.target = [];

        function filterData() {
            $scope.isLoading = true;
            if (para) {
                exportToPlaneService.postItem(para, function (response) {
                    if (response.status) {
                        $scope.isLoading = false;
                        $scope.data = response.data;

                    }
                });
            }
        };

        $scope.print = function () {
            var table = document.getElementById('main-report').innerHTML;
            var myWindow = $window.open('', '', 'width=800, height=600');
            myWindow.document.write(table);
            myWindow.print();
        }

        filterData();

    }
]);
