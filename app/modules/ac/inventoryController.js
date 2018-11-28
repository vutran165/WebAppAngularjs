acModule.factory('inventoryService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.apiServiceBaseUri;
        var serviceUrl = configService.rootUrlWebApi + '/Ac/Closeout';
        //var serviceUrl = rootUrl + '/_vti_bin/Apps/AC/CloseoutService.svc';
        var serviceUrlInventory = configService.rootUrlWebApi + '/Ac/XuatNhapTon';
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
            },
        }
        var result = {
            robot: calc,
            postInventoryReport: function (filter, callback) {
                $http.post(serviceUrl + '/ReportInventoryByPeriod', filter).success(callback);
            },
            postInventoryReportByDay: function (filter, callback) {
                $http.post(serviceUrl + '/ReportInventoryByDay', filter).success(callback);
            },
            postInventoryReportSendedByCompany: function (filter, callback) {

                $http.post(serviceUrl + '/InventoryReportSendedByCompany', filter).success(callback);
            },
            postInventoryReportSendedByCompany_Comparision: function (filter, callback) {

                $http.post(serviceUrl + '/InventoryReportSendedByCompany_Comparision', filter).success(callback);
            },
            postInventoryReportByPhieuNX: function (filter, callback) {
                $http.post(serviceUrl + '/ReportInventoryByPhieuNX', filter).success(callback);
            },

            postInventoryReportItem: function (filter, callback) {
                $http.post(serviceUrl + '/ReportInventoryItem', filter).success(callback);
            },
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
                $http.post(serviceUrl + '/ReportInventoryByCompany', filter).success(callback);
            },
            postInventoryReportByPhieuNXChiTiet: function (filter, callback) {
                $http.post(serviceUrl + '/ReportInventoryByPhieuNXChiTiet', filter).success(callback);
            },
            postExcelReportInventoryByPhieuNX: function (json, filename) {
                $http({
                    url: serviceUrl + '/PostExcelReportInventoryByPhieuNX',
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
            postExcelReportInventoryByPhieuNXChiTiet: function (json, filename) {
                $http({
                    url: serviceUrl + '/PostExcelReportInventoryByPhieuNXChiTiet',
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


acModule.controller('inventoryController', [
    '$scope', '$rootScope', '$window', '$stateParams', '$timeout', '$sce', '$state', '$uibModal', '$log',
    'mdService', 'inventoryService', 'clientService', 'configService', '$filter', 'serviceInventoryAndWareHouse', 'serviceInventoryAndMerchandiseType', 'serviceInventoryAndMerchandise', 'serviceInventoryAndMerchandiseGroup',
    function ($scope, $rootScope, $window, $stateParams, $timeout, $sce, $state, $uibModal, $log,
        mdService, inventoryService, clientService, configService, $filter, serviceInventoryAndWareHouse, serviceInventoryAndMerchandiseType, serviceInventoryAndMerchandise, serviceInventoryAndMerchandiseGroup) {
        $scope.tempData = mdService.tempData;
        $scope.config = configService;
        $scope.target = {};
        $scope.tagWareHouses = [];
        $scope.tagMerchandiseTypes = [];
        $scope.tagMerchandises = [];
        $scope.tagMerchandiseGroups = [];
        //Kho hàng
        $scope.selectWareHouse = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdWareHouse', 'selectData'),
                controller: 'wareHouseSelectDataController',
                resolve: {
                    serviceSelectData: function () {
                        return serviceInventoryAndWareHouse;
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
        $scope.removeWareHouse = function (index) {
            $scope.tagMerchandiseTypes.splice(index, 1);
        }
        $scope.getWareHouseImportByUnit = function (code) {
            if (code) {
                inventoryService.getPeriodByUnit(code, function (response) {
                    $scope.periods = response;
                });
                inventoryService.getWareHouseByUnit(code, function (response) {
                    $scope.wareHouses = response;
                });
            };
        }
        $scope.$watch('tagWareHouses', function (newValue, oldValue) {
            var values = $scope.tagWareHouses.map(function (element) {
                return element.value;
            });
            $scope.target.wareHouseCodes = values.join();
        }, true);

        //Loại hàng
        $scope.selectMerchandiseType = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('MdMerchandiseType', 'selectData'),
                controller: 'merchandiseTypeSelectDataController',
                resolve: {
                    serviceSelectData: function () {
                        return serviceInventoryAndMerchandiseType;
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
        $scope.removeMerchandiseType = function (index) {
            $scope.tagMerchandiseTypes.splice(index, 1);
        }
        $scope.$watch('tagMerchandiseTypes', function (newValue, oldValue) {
            var values = $scope.tagMerchandiseTypes.map(function (element) {
                return element.value;
            });
            $scope.target.merchandiseTypeCodes = values.join();
        }, true);
        //Hàng hóa

        $scope.selectMerchandise = function () {
            debugger;
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
                console.log(updatedData);
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
        $rootScope.$on('$locationChangeStart',
            function (event, next, current) {
                $scope.tagWareHouses.clear();
                $scope.tagMerchandiseTypes.clear();
                $scope.tagMerchandises.clear();
                $scope.tagMerchandiseGroups.clear();
            });

        function filterData() {
            $scope.tagWareHouses = serviceInventoryAndWareHouse.getSelectData();
            $scope.tagMerchandiseTypes = serviceInventoryAndMerchandiseType.getSelectData();
            $scope.tagMerchandises = serviceInventoryAndMerchandise.getSelectData();
            $scope.tagMerchandiseGroups = serviceInventoryAndMerchandiseGroup.getSelectData();


        }

        filterData();
        $scope.report = function () {
            if ($scope.target.objectGroup == 2) {
                $state.go('inventoryReporTotaltByCompany', { obj: $scope.target });
            }
            $state.go('inputReport', { obj: $scope.target });
        };

    }
]);

nvModule.controller('reportInventoryController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'inventoryService', 'mdService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, inventoryService, mdService, clientService) {
    var para = $state.params.obj;
    $scope.robot = angular.copy(inventoryService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.goIndex = function () {
        $state.go('inventory');
    }
    function filterData() {
        if (para) {
            inventoryService.postInventoryReport(para, function (response) {
                if (response.status) {
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
}]);

nvModule.controller('reportInventoryItemController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'inventoryService', 'mdService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, inventoryService, mdService, clientService) {
    var para = $state.params.obj;
    $scope.robot = angular.copy(inventoryService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.goIndex = function () {
        $state.go('inventory');
    }
    function filterData() {
        if (para) {
            inventoryService.postInventoryReportItem(para, function (response) {
                if (response.status) {
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
}]);


///THE INVENTORY REPORTS ARE SENDED BY COMPANY
acModule.controller('inventorySendedByCompanyController', [
    '$scope', '$rootScope', '$window', '$stateParams', '$timeout', '$sce', '$state', '$uibModal', '$log',
    'mdService', 'inventoryService', 'clientService', '$filter', 'serviceInventoryAndMerchandiseGroup',
    function ($scope, $rootScope, $window, $stateParams, $timeout, $sce, $state, $uibModal, $log,
        mdService, inventoryService, clientService, $filter, serviceInventoryAndMerchandiseGroup) {
        $scope.tempData = mdService.tempData;
        $scope.target = {};



        $scope.tagMerchandiseGroups = [];


        $scope.filterValue = [];
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
                $scope.filterlist = updatedData;
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
            $scope.filterValue = $scope.target.merchandiseGroupCodes;

        }, true);


        $rootScope.$on('$locationChangeStart',
            function (event, next, current) {


                $scope.tagMerchandiseGroups.clear();
            });

        function filterData() {

            $scope.tagMerchandiseGroups = serviceInventoryAndMerchandiseGroup.getSelectData();

            inventoryService.getNewParameter(function (response) {
                $scope.target = response;
                $scope.options.year = response.year;

            });
        }

        filterData();
        $scope.report = function () {
            if ($scope.target.checked) {
                $state.go('inventoryReportSendedByCompanyComparision', { obj: $scope.target });
            } else {
                $state.go('inventoryReportSendedByCompany', { obj: $scope.target });

            }

        }
    }
]);


nvModule.controller('reportInventoryReporSendedtByCompany', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'inventoryService', 'mdService', 'clientService', '$filter',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, inventoryService, mdService, clientService, $filter) {
    var para = $state.params.obj;
    console.log(para);
    $scope.year = para.year;

    $scope.robot = angular.copy(inventoryService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.goIndex = function () {
        $state.go('inventorySendedByCompany');
    }

    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
        if (data && data.length == 1) {
            return data[0].description;
        };
        return "";
    }


    $scope.title = "BÁO CÁO QUYẾT TOÁN KINH DOANH HÀNG MIỄN THUẾ";

    function filterData() {
        if (para) {
            inventoryService.postInventoryReportSendedByCompany(para, function (response) {
                if (response.status) {
                    $scope.data = response.data;
                    if (!$scope.data) {
                        $scope.warning = "Không có dữ liệu theo điều kiện báo cáo";
                    }
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
}]);


nvModule.controller('reportInventoryReporSendedtByCompanyComparision', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'inventoryService', 'mdService', 'clientService', '$filter',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, inventoryService, mdService, clientService, $filter) {
    var para = $state.params.obj;
    console.log(para);

    $scope.year = para.year;
    $scope.robot = angular.copy(inventoryService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.goIndex = function () {
        $state.go('inventorySendedByCompany');
    }



    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
        if (data && data.length == 1) {
            return data[0].description;
        };
        return "";
    }

    $scope.title = "BÁO CÁO SO SÁNH QUYẾT TOÁN XUẤT NHẬP TỒN (DOANH NGHIỆP GỬI)";

    function filterData() {
        if (para) {
            inventoryService.postInventoryReportSendedByCompany_Comparision(para, function (response) {
                if (response.status) {
                    $scope.data = response.data;

                    if (!$scope.data) {
                        $scope.warning = "Không có dữ liệu theo điều kiện báo cáo";
                    }
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
}]);

/// END 

nvModule.controller('reportKinhDoanhHangMienThueController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'inventoryService', 'mdService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, inventoryService, mdService, clientService) {
    var para = $state.params.obj;
    console.log(para);
    $scope.robot = angular.copy(inventoryService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.goIndex = function () {
        $state.go('inventory');
    }
    function filterData() {
        if (para) {
            inventoryService.postInventoryReportByDay(para, function (response) {
                if (response.status) {
                    console.log(response);
                    $scope.target = response.data;

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
}]);

nvModule.controller('reportInventoryByDayController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'inventoryService', 'mdService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, inventoryService, mdService, clientService) {
    var para = $state.params.obj;
    console.log(para);

    $scope.robot = angular.copy(inventoryService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.goIndex = function () {
        $state.go('inventoryController');
    }
    function filterData() {
        if (para) {
            inventoryService.postInventoryReportByDay(para, function (response) {
                if (response.status) {
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
}]);




nvModule.controller('reportInventoryTotalByCompanyController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'inventoryService', 'mdService', 'clientService', '$filter',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, inventoryService, mdService, clientService, $filter) {
    var para = $state.params.obj;
    console.log(para);

    $scope.robot = angular.copy(inventoryService.robot);
    $scope.tempData = mdService.tempData;

    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        };
        return "";
    }

    $scope.nameCompany = $state.params.obj.maDoanhNghiep;

    $scope.target = [];
    $scope.goIndex = function () {
        $state.go('inventoryByDay');
    }
    function filterData() {
        $scope.isLoading = true;
        if (para) {
            inventoryService.postItem(para, function (response) {
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
}]);


// Bao Cao QUyet TOan
acModule.controller('inventoryByPhieuNXController', ['$scope', '$rootScope', '$window', '$stateParams', '$timeout', '$sce', '$state', '$uibModal', '$log',
'mdService', 'inventoryService', 'clientService', '$filter', 'serviceInventoryAndWareHouse', 'serviceInventoryAndMerchandiseType', 'serviceInventoryAndMerchandise', 'serviceInventoryAndMerchandiseGroup','configService',
function ($scope, $rootScope, $window, $stateParams, $timeout, $sce, $state, $uibModal, $log,
mdService, inventoryService, clientService, $filter, serviceInventoryAndWareHouse, serviceInventoryAndMerchandiseType, serviceInventoryAndMerchandise, serviceInventoryAndMerchandiseGroup, configService) {
    $scope.tempData = mdService.tempData;
    $scope.config = configService;
    $scope.target = {};
    $scope.tagWareHouses = [];
    $scope.tagMerchandiseTypes = [];
    $scope.tagMerchandises = [];
    $scope.tagMerchandiseGroups = [];
    $scope.goIndex = function () {
        $state.go('inventory');
    }
    $scope.onChangeMaHaiQuan = function (mahq) {
        if (mahq) {
            mahq = mahq.toUpperCase();
            var data = $filter('filter')(mdService.tempData.companies, { value: mahq }, true);
            if (data && data.length > 0) {
                $scope.filtered.advanceData.maHaiQuan = data[0].value;
                $scope.filtered.advanceData.idHaiQuan = data[0].id;
                $scope.target.maDoanhNghiep = data[0].value;
                //$scope.lstDoanhnghiep = $scope.tempData.companiesByHQ.filter(function (dn) {
                //    return (dn.referenceDataId.indexOf($scope.filtered.advanceData.idHaiQuan) === 0);
                //});
            }
        }
    };
    //Kho hàng
    $scope.selectWareHouse = function () {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdWareHouse', 'selectData'),
            controller: 'wareHouseSelectDataController',
            resolve: {
                serviceSelectData: function () {
                    return serviceInventoryAndWareHouse;
                },
                filterObject: function () {
                    return {
                        advanceData: {
                            unitCode: $scope.target.unitCode
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
    $scope.removeWareHouse = function (index) {
        $scope.tagMerchandiseTypes.splice(index, 1);
    }
    $scope.getWareHouseImportByUnit = function (code) {
        if (code) {
            inventoryService.getPeriodByUnit(code, function (response) {
                $scope.periods = response;
            });
            inventoryService.getWareHouseByUnit(code, function (response) {
                $scope.wareHouses = response;
            });
        };
    }

    $scope.$watch('tagWareHouses', function (newValue, oldValue) {
        var values = $scope.tagWareHouses.map(function (element) {
            return element.value;
        })
        $scope.target.wareHouseCodes = values.join();
    }, true);

    //Loại hàng
    $scope.selectMerchandiseType = function () {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('MdMerchandiseType', 'selectData'),
            controller: 'merchandiseTypeSelectDataController',
            resolve: {
                serviceSelectData: function () {
                    return serviceInventoryAndMerchandiseType;
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
    $scope.removeMerchandiseType = function (index) {
        $scope.tagMerchandiseTypes.splice(index, 1);
    }
    $scope.$watch('tagMerchandiseTypes', function (newValue, oldValue) {
        var values = $scope.tagMerchandiseTypes.map(function (element) {
            return element.value;
        });
        $scope.target.merchandiseTypeCodes = values.join();
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
                        advanceData: {
                            maNhomVatTu: $scope.filterValue
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

    $scope.removeMerchandise = function (index) {
        $scope.tagMerchandises.splice(index, 1);
    }
    $scope.$watch('tagMerchandises', function (newValue, oldValue) {
        var values = $scope.tagMerchandises.map(function (element) {
            return element.value;
        });
        $scope.target.merchandiseCodes = values.join();
    }, true);

    $scope.filterValue = [];
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
            $scope.filterlist = updatedData;
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
        $scope.filterValue = $scope.target.merchandiseGroupCodes;

    }, true);


    $rootScope.$on('$locationChangeStart',
    function (event, next, current) {
        $scope.tagWareHouses.clear();
        $scope.tagMerchandiseTypes.clear();
        $scope.tagMerchandises.clear();
        $scope.tagMerchandiseGroups.clear();
    })
    $scope.options = {
        minDate: null,
        maxDate: null
    };
    function filterData() {
        $scope.tagWareHouses = serviceInventoryAndWareHouse.getSelectData();
        $scope.tagMerchandiseTypes = serviceInventoryAndMerchandiseType.getSelectData();
        $scope.tagMerchandises = serviceInventoryAndMerchandise.getSelectData();
        $scope.tagMerchandiseGroups = serviceInventoryAndMerchandiseGroup.getSelectData();

        inventoryService.getNewParameter(function (response) {
            $scope.target = response;
        });
    }
    filterData();

    $scope.report = function () {
        $state.go('inventoryReportByPhieuNX', { obj: $scope.target });
        //$scope.target.objectGroup == 1
        //if ($scope.target.objectGroup == 1) {
        //    $state.go('inventoryReportByPhieuNX', { obj: $scope.target });
        //}
        //else if ($scope.target.objectGroup == 2) {
        //    $state.go('inventoryReportByPhieuNXChiTiet', { obj: $scope.target });

        //}
    }
    $scope.exportToExcel = function () {
        if ($scope.target.objectGroup == 1) {
            inventoryService.postExcelReportInventoryByPhieuNX($scope.target, "BaoCaoXuatNhapTonTheoPhieuNhapXuat");
        }
        else if ($scope.target.objectGroup == 2) {
            inventoryService.postExcelReportInventoryByPhieuNXChiTiet($scope.target, "BaoCaoXuatNhapTonTheoPhieuNhapXuatChiTiet");

        }

    }

}])

nvModule.controller('reportInventoryByPhieuNXController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'inventoryService', 'mdService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, inventoryService, mdService, clientService) {
    var para = $state.params.obj;
    console.log(para);

    $scope.robot = angular.copy(inventoryService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.goIndex = function () {
        $state.go('inventoryByPhieuNX');
    }
    function filterData() {
        $scope.toDate = para.toDate;
        $scope.fromDate = para.fromDate;

        if (para) {
            inventoryService.postInventoryReportByPhieuNX(para, function (response) {
                if (response.status) {
                    console.log(response);
                    $scope.target = response.data;
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
}]);
nvModule.controller('reportInventoryByPhieuNXChiTietController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'inventoryService', 'mdService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, inventoryService, mdService, clientService) {
    var para = $state.params.obj;
    console.log(para);

    $scope.robot = angular.copy(inventoryService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.goIndex = function () {
        $state.go('inventoryByPhieuNX');
    }
    function filterData() {
        $scope.toDate = para.toDate;
        $scope.fromDate = para.fromDate;

        if (para) {
            inventoryService.postInventoryReportByPhieuNXChiTiet(para, function (response) {
                if (response.status) {
                    console.log(response);
                    $scope.target = response.data;
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
}]);
// END BAOCAO QUYET TOAN