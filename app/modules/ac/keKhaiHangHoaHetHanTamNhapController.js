acModule.factory('keKhaiHangHoaHetHanTamNhapService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.apiServiceBaseUri;
        var serviceUrl = configService.rootUrlWebApi + '/Ac/Input';
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
            },
        }
        var result = {
            robot: calc,
            getReport: function (data) {
                console.log(rootUrl);
                $http.post(serviceUrl + '/PostReportNhapMua', data, { responseType: 'arraybuffer' }).success(function (data) {

                    if (data.status == 404) {
                        clientService.noticeAlert("Không có dữ liệu 1", "danger")
                    }

                    try {
                        var file = new Blob([data], { type: 'application/pdf' });
                        var fileURL = URL.createObjectURL(file);
                        window.open(fileURL);
                    }
                    catch (err) {
                        clientService.noticeAlert("Không có dữ liệu", "danger");
                    }
                }).error(function (error) {
                    clientService.noticeAlert("Chưa có dữ liệu với điều kiện đã chọn", "danger")
                });
            },
            postCreateReportCashierByStaff: function (filter, callback) {
                $http.post(serviceUrl + '/CreateReportCashierByStaff', filter).success(callback);
            },
            getNewParameter: function (callback) {
                $http.get(serviceUrl + '/GetNewParameter').success(callback);

            },
            postReportHangHetHanTamNhap: function (data, callback) {
                $http.post(serviceUrl + '/PostReportHangTamNhap', data).success(callback);
            },
            postQuery: function (data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            postExportExcelReport: function (json, filename) {
                $http({
                    url: serviceUrl + '/PostExportExcelReport',
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

acModule.controller('keKhaiHangHoaHetHanTamNhapController', ['$scope', '$rootScope', '$window', '$stateParams', '$timeout', '$sce', '$state', '$uibModal', '$log',
'mdService', 'keKhaiHangHoaHetHanTamNhapService', 'clientService', 'configService', '$filter', 'serviceInventoryAndMerchandiseGroup', 'serviceInventoryAndWareHouse', 'serviceInventoryAndMerchandiseType', 'serviceInventoryAndMerchandise', 'inventoryService', 'serviceInventoryAndCompany', 'serviceInventoryAndDonViHaiQuan', 'serviceInventoryAndUnitUser',
function ($scope, $rootScope, $window, $stateParams, $timeout, $sce, $state, $uibModal, $log,
mdService, keKhaiHangHoaHetHanTamNhapService, clientService, configService, $filter, serviceInventoryAndMerchandiseGroup, serviceInventoryAndWareHouse, serviceInventoryAndMerchandiseType, serviceInventoryAndMerchandise, inventoryService, serviceInventoryAndCompany, serviceInventoryAndDonViHaiQuan, serviceInventoryAndUnitUser) {
    $scope.tempData = mdService.tempData;
    $scope.config = configService;
    $scope.target = {};
    $scope.dataDefault = {};
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
    $scope.selectUnitUser = function () {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdUnitUser', 'selectData'),
            controller: 'UnitUserSelectDataController',
            resolve: {
                selectedCuaHang: function () {
                    return $scope.tagUnitUsers;
                },
                selectedDoanhNghiep: function () {
                    return $scope.tagCompanies;
                }
            }
        });
        modalInstance.result.then(function (updatedData) {
            $scope.tagUnitUsers = updatedData;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.selectCompany = function () {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdCompany', 'selectData'),
            controller: 'companySelectDataController',
            resolve: {
                selectedDoanhNghiep: function () {
                    return $scope.tagCompanies;
                },
                selectedHaiQuan: function () {
                    return $scope.filtered.advanceData;
                }
            }
        });
        modalInstance.result.then(function (updatedData) {
            console.log(updatedData);
            $scope.tagCompanies = updatedData;
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

        var postdata = { paged: $scope.paged, filtered: $scope.filtered };

        keKhaiHangHoaHetHanTamNhapService.postQuery(
            JSON.stringify(postdata),
            function (response) {
                $scope.isLoading = false;
                if (response) {

                    $scope.data = response;
                    angular.extend($scope.paged, response.data);
                    console.log($scope.paged);
                }
            });
        $scope.target.fromDate = new Date();
        $scope.target.objectGroup = 1;
        //keKhaiHangHoaHetHanTamNhapService.getNewParameter(function (response) {
        //    if (response) {
        //    }
        //})
    }
    $scope.onChangeMaHaiQuan = function (mahq) {
        if (mahq) {
            mahq = mahq.toUpperCase();
            var data = $filter('filter')(mdService.tempData.donViHaiQuans, { value: mahq }, true);
            if (data && data.length > 0) {
                $scope.filtered.advanceData.maHaiQuan = data[0].value;
                $scope.filtered.advanceData.idHaiQuan = data[0].id;
                $scope.target.donViHaiQuanCodes = data[0].id;
            }
        }
    };
    filterData();
    $scope.report = function () {
        if ($scope.target.donViHaiQuanCodes == "") {
            $scope.target.donViHaiQuanCodes = $scope.data.id;
        }
        $state.go('reportKeKhaiHangHoaHetHanTamNhap', { obj: $scope.target });
    }
    $scope.printExcel = function () {
        keKhaiHangHoaHetHanTamNhapService.postExportExcelReport($scope.target, "KeKhaiHangHoaHetHanTamNhap");
    }
}])

nvModule.controller('reportKeKhaiHangHoaHetHanTamNhapController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'keKhaiHangHoaHetHanTamNhapService', 'mdService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, keKhaiHangHoaHetHanTamNhapService, mdService, clientService) {
    var para = $state.params.obj;
    $scope.robot = angular.copy(keKhaiHangHoaHetHanTamNhapService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.goIndex = function () {
        $state.go('keKhaiHangHoaHetHanTamNhap');
    }
    $scope.target.data = [];
    $scope.checkShow = function () {
        if (para.objectGroup == 1) {
            return true;
        }
        else {
            return false;
        }
    }
    console.log(para);
    $scope.title = function () { return "BÁO CÁO HÀNG HÓA HẾT HẠN TẠM NHẬP KHO"; };
    function filterData() {
        if (para) {
            $scope.target.fromDate = para.fromDate;
            keKhaiHangHoaHetHanTamNhapService.postReportHangHetHanTamNhap(para, function (response) {
                $scope.target.data = response.data;
            });
        }
    };

    $scope.print = function () {
        var table = document.getElementById('main-report').innerHTML;
        var myWindow = $window.open('', '', 'width=800, height=600');
        myWindow.document.write(table);
        myWindow.print();
    }
    $scope.printExcel = function () {
        keKhaiHangHoaHetHanTamNhapService.postExportExcelReport(para, "KeKhaiHangHoaHetHanTamNhap");
    }

    filterData();
}]);

nvModule.controller('reportKeKhaiHangHoaHetHanTamNhapByCustomUnitController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'keKhaiHangHoaHetHanTamNhapService', 'mdService', 'clientService', '$filter',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, keKhaiHangHoaHetHanTamNhapService, mdService, clientService, $filter) {
    var para = $state.params.obj;
    $scope.robot = angular.copy(keKhaiHangHoaHetHanTamNhapService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.nameCustomUnit = '';



    $scope.goIndex = function () {
        $state.go('keKhaiHangHoaHetHanTamNhap');
    }
    $scope.target.data = [];
    console.log(para);

    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (code) {
            if (data.length == 1) {
                $scope.nameCustomUnit = data[0].text;
                $scope.target.data.tenDoanhNghiep = $scope.nameCustomUnit.substring($scope.nameCustomUnit.indexOf('|'), $scope.nameCustomUnit.length)
                return $scope.target.data.tenDoanhNghiep;
            }
        }
        else {
            $scope.target.data.tenDoanhNghiep = null;
        }
        return "Empty!";
    };

    function filterData() {
        if (para) {
            keKhaiHangHoaHetHanTamNhapService.postReportHangHetHanTamNhap(para, function (response) {
                console.log(response);
                $scope.target.data = response.data;

            });
        }
    };

    $scope.print = function () {
        var table = document.getElementById('main-report').innerHTML;
        var myWindow = $window.open('', '', 'width=800, height=600');
        myWindow.document.write(table);
        myWindow.print();
    }
    $scope.printExcel = function () {
        keKhaiHangHoaHetHanTamNhapService.postExportExcelReport(para, "KeKhaiHangHoaHetHanTamNhap");
    }
    filterData();
}]);

nvModule.controller('reportKeKhaiHangHoaHetHanTamNhapByCompanyController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'keKhaiHangHoaHetHanTamNhapService', 'mdService', 'clientService', '$filter',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, keKhaiHangHoaHetHanTamNhapService, mdService, clientService, $filter) {
    var para = $state.params.obj;
    $scope.robot = angular.copy(keKhaiHangHoaHetHanTamNhapService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.nameCompany = '';
    $scope.goIndex = function () {
        $state.go('keKhaiHangHoaHetHanTamNhapController');
    }
    $scope.target.data = [];

    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
        if (code) {
            if (data.length == 1) {
                $scope.nameCompany = data[0].text;
                return $scope.nameCompany;
            }
        }
        else {
            $scope.target.data.tenDoanhNghiep = null;
        }
        return "Empty!";
    };


    function filterData() {
        if (para) {
            keKhaiHangHoaHetHanTamNhapService.postReportHangHetHanTamNhap(para, function (response) {
                $scope.target.data = response.data;
            });
        }
    };



    $scope.print = function () {
        var table = document.getElementById('main-report').innerHTML;
        var myWindow = $window.open('', '', 'width=800, height=600');
        myWindow.document.write(table);
        myWindow.print();
    }
    $scope.printExcel = function () {
        keKhaiHangHoaHetHanTamNhapService.postExportExcelReport(para, "KeKhaiHangHoaHetHanTamNhap");
    }

    filterData();
}]);

nvModule.controller('reportKeKhaiHangHoaHetHanTamNhapByCodeHsController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'keKhaiHangHoaHetHanTamNhapService', 'mdService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, keKhaiHangHoaHetHanTamNhapService, mdService, clientService) {
    var para = $state.params.obj;
    $scope.robot = angular.copy(keKhaiHangHoaHetHanTamNhapService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.goIndex = function () {
        $state.go('keKhaiHangHoaHetHanTamNhapController');
    }
    $scope.target.data = [];
    console.log(para);
    function filterData() {
        if (para) {
            keKhaiHangHoaHetHanTamNhapService.postReportHangHetHanTamNhap(para, function (response) {
                console.log(response);
                $scope.target.data = response.data;
                console.log($scope.target.data);
            });
        }
    };

    $scope.print = function () {
        var table = document.getElementById('main-report').innerHTML;
        var myWindow = $window.open('', '', 'width=800, height=600');
        myWindow.document.write(table);
        myWindow.print();
    }
    $scope.printExcel = function () {
        keKhaiHangHoaHetHanTamNhapService.postExportExcelReport(para, "KeKhaiHangHoaHetHanTamNhap");
    }

    filterData();
}]);