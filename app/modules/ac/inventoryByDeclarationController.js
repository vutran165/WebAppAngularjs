acModule.factory('inventoryByDeclarationService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.apiServiceBaseUri;
        var serviceUrl = configService.rootUrlWebApi + '/Ac/Closeout';
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
                $http.post(serviceUrl + '/ReportInventoryByDeclaration', filter).success(callback);
            },
            getCurrentUser: function (callback) {
                $http.get(rootUrl + '/api/Authorize/User/GetCurrentUser').success(callback);
            },
            postExportExcel: function (json, filename) {
                $http({
                    url: serviceUrl + '/PostExportExcelByDeclaration',
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
            },
            postExportExcelDetail: function (json, filename) {
                $http({
                    url: serviceUrl + '/PostExportExcelByDeclarationDetail',
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
            },
        }
        return result;
    }
]);


acModule.controller('inventoryByDeclarationController', [
    '$scope', '$rootScope', '$window', '$stateParams', '$timeout', '$sce', '$state', '$uibModal', '$log',
    'mdService', 'inventoryByDeclarationService', 'clientService', 'configService', '$filter', 'serviceInventoryAndWareHouse', 'serviceInventoryAndMerchandiseType', 'serviceInventoryAndMerchandise', 'serviceInventoryAndMerchandiseGroup',
    function ($scope, $rootScope, $window, $stateParams, $timeout, $sce, $state, $uibModal, $log,
        mdService, inventoryByDeclarationService, clientService, configService, $filter, serviceInventoryAndWareHouse, serviceInventoryAndMerchandiseType, serviceInventoryAndMerchandise, serviceInventoryAndMerchandiseGroup) {
        $scope.tempData = mdService.tempData;
        $scope.config = configService;
        $scope.target = {
            objectUser: {}
        };

        $scope.userInformation = {};
        $scope.tagWareHouses = [];
        $scope.tagMerchandiseTypes = [];
        $scope.tagMerchandises = [];
        $scope.tagMerchandiseGroups = [];

        $scope.selectMerchandiseGroup = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('MdNhomVatTu', 'selectData'),
                controller: 'nhomVatTuSelectDataController',
                resolve: {
                    serviceSelectData: function () {
                        return serviceInventoryAndMerchandiseGroup;
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
        $scope.removeMerchandiseGroup = function (index) {
            $scope.tagMerchandiseGroups.splice(index, 1);
        }
        $scope.$watch('tagMerchandiseGroups', function (newValue, oldValue) {
            var values = $scope.tagMerchandiseGroups.map(function (element) {
                return element.value;
            });
            $scope.target.merchandiseGroupCodes = values.join();
        }, true);
        //Hàng hóa

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
                $scope.tagMerchandises.clear();
                $scope.tagMerchandiseGroups.clear();
            });

        function filterData() {

            inventoryByDeclarationService.getNewParameter(function (response) {

                $scope.target = response;

                inventoryByDeclarationService.getCurrentUser(function (response) {
                    $scope.target.objectUser = response;


                });
            });
            $scope.tagMerchandises = serviceInventoryAndMerchandise.getSelectData();
            $scope.tagMerchandiseGroups = serviceInventoryAndMerchandiseGroup.getSelectData();

        }

        filterData();
        $scope.report = function () {
			
            if ($scope.target.objectGroup === 1) {
                $state.go('inventoryReportDeclaration', { obj: $scope.target });
            } else {
                $state.go('inventoryReportDeclarationDetails', { obj: $scope.target });
            }

        };
        $scope.printExcel = function () {
            if ($scope.target.objectGroup === 1) {
                inventoryByDeclarationService.postExportExcel($scope.target, "BaoCaoTonTheoToKhaiTongHop");
            } else {
                inventoryByDeclarationService.postExportExcelDetail($scope.target, "BaoCaoTonTheoToKhaiChiTiet");
            }

        }
    }
]);

nvModule.controller('reportInventoryByDeclarationController', [
    '$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'inventoryByDeclarationService', 'mdService', 'clientService', '$filter', function ($scope, $window, $stateParams, $timeout, $state,
nvService, inventoryByDeclarationService, mdService, clientService, $filter) {
        var para = $state.params.obj;
        console.log(para);

        $scope.robot = angular.copy(inventoryByDeclarationService.robot);
        $scope.tempData = mdService.tempData;
		
		console.log($scope.tempData.nhomVatTus);

        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
            if (data && data.length == 1) {
                return data[0].text;
            };
            return "";
        };

        $scope.nameOfObject = function (code, module) {
            if (!code) return "";
            var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
            if (data && data.length == 1) {
                return data[0].text;
            };
            return "";
        };



        $scope.target = [];
        $scope.goIndex = function () {
            $state.go('inventoryByDeclaration');
        }
        function filterData() {
            $scope.isLoading = true;
            if (para) {
                inventoryByDeclarationService.postItem(para, function (response) {
                    if (response.status) {
                        $scope.isLoading = false;
                        $scope.data = response.data;
						console.log($scope.data);
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

nvModule.controller('reportInventoryByDeclarationDetailsController', [
    '$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'inventoryByDeclarationService', 'mdService', 'clientService', '$filter', function ($scope, $window, $stateParams, $timeout, $state,
nvService, inventoryByDeclarationService, mdService, clientService, $filter) {
        var para = $state.params.obj;
        console.log(para);
        $scope.titleData = para;

        $scope.robot = angular.copy(inventoryByDeclarationService.robot);
        $scope.tempData = mdService.tempData;

        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
            if (data && data.length == 1) {
                return data[0].text;
            };
            return "";
        }

        $scope.nameOfObject = function (code, module) {
            if (!code) return "";
            var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
            if (data && data.length == 1) {
                return data[0].text;
            };
            return "";
        };

        $scope.target = [];
        $scope.goIndex = function () {
            $state.go('inventoryByDeclaration');
        }


        $scope.listCompany = [];


        function filterData() {
            $scope.isLoading = true;
            if (para) {
                inventoryByDeclarationService.postItem(para, function (response) {
                    if (response.status) {
                        $scope.isLoading = false;
                        $scope.dataGenaral = response.data;
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