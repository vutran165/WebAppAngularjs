acModule.factory('bangKeTienMatKhoLenTauBayService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.apiServiceBaseUri;
        var serviceUrl = configService.rootUrlWebApi + '/Ac/BangKeTienMatCachLy';
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
            getNewParameter: function (callback) {
                $http.get(serviceUrl + '/GetNewParameter').success(callback);
            },

            postReport: function (data, callback) {
                $http.post(serviceUrl + '/PostReportKhoLenTauBay', data).success(callback);
            },
            postExportExcel: function (json, filename) {
                $http({
                    url: serviceUrl + '/PostExportExcelKhoLenTauBay',
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
            }

        }
        return result;
    }
]);


acModule.controller('bangKeTienMatKhoLenTauBayController', [
    '$scope', '$rootScope', '$window', '$stateParams', '$timeout', '$sce', '$state', '$uibModal', '$log',
    'mdService', 'bangKeTienMatKhoLenTauBayService', 'clientService', 'configService', '$filter', 'serviceInventoryAndWareHouse', 'serviceInventoryAndMerchandiseType', 'serviceInventoryAndMerchandise', 'serviceInventoryAndMerchandiseGroup', 'serviceInventoryAndCompany', 'serviceInventoryAndDonViHaiQuan', 'serviceInventoryAndUnitUser',
    function ($scope, $rootScope, $window, $stateParams, $timeout, $sce, $state, $uibModal, $log,
        mdService, bangKeTienMatKhoLenTauBayService, clientService, configService, $filter, serviceInventoryAndWareHouse, serviceInventoryAndMerchandiseType, serviceInventoryAndMerchandise, serviceInventoryAndMerchandiseGroup, serviceInventoryAndCompany, serviceInventoryAndDonViHaiQuan, serviceInventoryAndUnitUser) {
        $scope.tempData = mdService.tempData;
        $scope.robot = angular.copy(bangKeTienMatKhoLenTauBayService.robot);
        $scope.config = configService;
        $scope.target = {};
        $scope.tagWareHouses = [];
        $scope.tagMerchandiseTypes = [];
        $scope.tagMerchandises = [];
        $scope.tagMerchandiseGroups = [];
        $scope.tagUnitUsers = [];

        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);


        //Nhóm hàng
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
        $scope.selectMerchandise = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'selectDataSimple'),
                controller: 'merchandiseSimpleSelectDataController',
                resolve: {
                    serviceSelectData: function () {
                        return serviceInventoryAndMerchandise;
                    },
                    filterObject: function () {
                        return {
                            advanceData: {
                                maNhomVatTu: $scope.target.merchandiseGroupCodes
                            },
                            isAdvance: true
                        }
                    }
                }
            });
            modalInstance.result.then(function (updatedData) {
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
        $scope.selectCompany = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdCompany', 'selectSingleData'),
                controller: 'companySelectSingleDataController',
                resolve: {
                    serviceSelectData: function () {
                        return serviceInventoryAndCompany;
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
        $scope.selectDonViHaiQuan = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdDonViHaiQuan', 'selectData'),
                controller: 'donViHaiQuanSelectDataController',
                resolve: {
                    serviceSelectData: function () {
                        return serviceInventoryAndDonViHaiQuan;
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
        $scope.selectUnitUser = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdUnitUser', 'selectSingleData'),
                controller: 'UnitUserSelectSingleDataController',
                resolve: {
                    serviceSelectData: function () {
                        return serviceInventoryAndUnitUser;
                    },
                    filterObject: function () {
                        return {
                            advanceData: {
                                donViHaiQuanChuQuan: $scope.target.donViHaiQuanCodes,
                                maDoanhNghiep: $scope.target.companyCodes
                            },
                            isAdvance: true
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
        $scope.removeMerchandiseGroup = function (index) {
            $scope.tagMerchandiseGroups.splice(index, 1);
        }
        $scope.removeMerchandise = function (index) {
            $scope.tagMerchandises.splice(index, 1);
        }
        $scope.removeCompany = function (index) {
            $scope.tagCompanies.splice(index, 1);
        }
        $scope.removeDonViHaiQuan = function (index) {
            $scope.tagDonViHaiQuans.splice(index, 1);
        }
        $scope.removeUnitUser = function (index) {
            $scope.tagUnitUsers.splice(index, 1);
        }
        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
            if (code) {
                if (data.length == 1) {
                    $scope.target.tenDoanhNghiep = data[0].text;
                    return $scope.target.tenDoanhNghiep;
                }
            }
            else {
                $scope.target.tenDoanhNghiep = null;
            }
            return "Empty!";
        };

        $scope.$watch('tagMerchandiseGroups', function (newValue, oldValue) {
            var values = $scope.tagMerchandiseGroups.map(function (element) {
                return element.value;
            });
            $scope.target.merchandiseGroupCodes = values.join();
        }, true);
        $scope.$watch('tagMerchandises', function (newValue, oldValue) {
            var values = $scope.tagMerchandises.map(function (element) {
                return element.value;
            });
            $scope.target.merchandiseCodes = values.join();

        }, true);
        $scope.$watch('tagCompanies', function (newValue, oldValue) {
            var values = $scope.tagCompanies.map(function (element) {
                return element.id;
            });
            $scope.target.companyCodes = values.join();

        }, true);
        $scope.$watch('tagDonViHaiQuans', function (newValue, oldValue) {
            var values = $scope.tagDonViHaiQuans.map(function (element) {
                return element.id;
            });
            $scope.target.donViHaiQuanCodes = values.join();

        }, true);
        $scope.$watch('tagUnitUsers', function (newValue, oldValue) {
            var values = $scope.tagUnitUsers.map(function (element) {
                return element.value;
            });
            $scope.target.unitUserCodes = values.join();

        }, true);
        $rootScope.$on('$locationChangeStart',
            function (event, next, current) {
                $scope.tagWareHouses.clear();
                $scope.tagMerchandiseTypes.clear();
                $scope.tagMerchandises.clear();
                $scope.tagMerchandiseGroups.clear();
                $scope.tagCompanies.clear();
                $scope.tagDonViHaiQuans.clear();
                $scope.tagUnitUsers.clear();
            });

        function filterData() {
            $scope.tagWareHouses = serviceInventoryAndWareHouse.getSelectData();
            $scope.tagMerchandiseTypes = serviceInventoryAndMerchandiseType.getSelectData();
            $scope.tagMerchandises = serviceInventoryAndMerchandise.getSelectData();
            $scope.tagMerchandiseGroups = serviceInventoryAndMerchandiseGroup.getSelectData();
            $scope.tagCompanies = serviceInventoryAndCompany.getSelectData();
            $scope.tagDonViHaiQuans = serviceInventoryAndDonViHaiQuan.getSelectData();
            $scope.tagUnitUsers = serviceInventoryAndUnitUser.getSelectData();

            bangKeTienMatKhoLenTauBayService.getNewParameter(function (response) {
                $scope.target = response;
            });
        }

        filterData();
        $scope.report = function () {
            if ($scope.target.donViHaiQuanCodes == "") {
                $scope.target.donViHaiQuanCodes = $scope.data.id;
            }
            //bangKeTienMatKhoLenTauBayService.getReport($scope.target);
            $state.go('bangKeTienMatKhoLenTauBayReport', { obj: $scope.target });
        }
        $scope.printExcel = function () {
            bangKeTienMatKhoLenTauBayService.postExportExcel($scope.target, "BaoCaoBangKeTienMatKhoLenTauBay");
        }
    }
]);
nvModule.controller('reportBangKeTienMatKhoLenTauBayController', ['$scope', '$window', '$stateParams', '$timeout', '$state', '$filter',
    'nvService', 'bangKeTienMatKhoLenTauBayService', 'mdService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,$filter,
nvService, bangKeTienMatKhoLenTauBayService, mdService, clientService) {
    var para = $state.params.obj;
    $scope.robot = angular.copy(bangKeTienMatKhoLenTauBayService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.goIndex = function () {
        $state.go('bangKeTienMatKhoLenTauBay');
    }
    function filterData() {
        if (para) {
            bangKeTienMatKhoLenTauBayService.postReport(para, function (response) {
                console.log(response);
                $scope.target = response;
            });
        }
    };

    $scope.displayHelper = function (code, module) {
        if (!code) {
            return "";
        }
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].description;
        };
    }
    $scope.print = function () {
        var table = document.getElementById('main-report').innerHTML;
        var myWindow = $window.open('', '', 'width=800, height=600');
        myWindow.document.write(table);
        myWindow.print();
    }

    filterData();
}]);





