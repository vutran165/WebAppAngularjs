acModule.factory('outputService', [
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
            getReport: function (data) {
                console.log(rootUrl);
                $http.post(serviceUrl + '/PostReportXuat', data, { responseType: 'arraybuffer' }).success(function (data) {

                    if (data.status == 404) {
                        alert("Không có dữ liệu");
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
            getNewParameter: function (callback) {
                $http.get(serviceUrl + '/GetNewParameter').success(callback);
            },

            postReportShipment: function (data, callback) {
                $http.post(serviceUrl + '/PostReportShipment', data).success(callback);
            },
            postQuery: function (data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            postExportExcelReport: function (json, filename) {
                $http({
                    url: configService.rootUrlWebApi + '/Ac/Input' + '/PostReportNhapMuaExcel',
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
            postReportNhapMuaVer2: function (data, callback) {
                $http.post(configService.rootUrlWebApi + '/Ac/Input' + '/PostReportNhapMuaHtmlVer2', data).success(callback);
            },
        }
        return result;
    }
]);


acModule.controller('outputController', [
    '$scope', '$rootScope', '$window', '$stateParams', '$timeout', '$sce', '$state', '$uibModal', '$log',
    'mdService', 'outputService', 'clientService', 'configService', '$filter', 'serviceInventoryAndWareHouse', 'serviceInventoryAndMerchandiseType', 'serviceInventoryAndMerchandise', 'serviceInventoryAndMerchandiseGroup', 'serviceInventoryAndCompany', 'serviceInventoryAndDonViHaiQuan', 'serviceInventoryAndUnitUser',
    function ($scope, $rootScope, $window, $stateParams, $timeout, $sce, $state, $uibModal, $log,
        mdService, outputService, clientService, configService, $filter, serviceInventoryAndWareHouse, serviceInventoryAndMerchandiseType, serviceInventoryAndMerchandise, serviceInventoryAndMerchandiseGroup, serviceInventoryAndCompany, serviceInventoryAndDonViHaiQuan, serviceInventoryAndUnitUser) {
        $scope.tempData = mdService.tempData;
        $scope.config = configService;
        $scope.target = {};
        $scope.tagWareHouses = [];
        $scope.tagMerchandiseTypes = [];
        $scope.tagMerchandises = [];
        $scope.tagMerchandiseGroups = [];
        $scope.tagUnitUsers = [];
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);

        $scope.loaiXuats = [
			{
			    value: 0,
			    text: 'Tất cả'
			},
            {
                value: 1,
                text: '5.1 Kê khai hàng hóa từ kho DN đi tiêu hủy'
            },
            {
                value: 2,
                text: '5.2 Kê khai hàng hóa từ kho DN sang loại hình tái xuất '
            },
            {
                value: 3,
                text: '5.3 Kê khai hàng hóa từ kho DN chuyển tiêu thụ nội địa'
            },
            {
                value: 4,
                text: '5.4 Kê khai hàng hóa từ kho DN sang loại hình tái nhập'
            },
            {
                value: 5,
                text: '5.5 Kê khai hàng hóa xuất bán cho khách hàng'
            },
            {
                value: 6,
                text: '5.6 Kê khai hàng hóa xuất từ kho DN sang cửa hàng'
            },
            {
                value: 7,
                text: '5.7 Kê khai hàng hóa xuất từ cửa hàng miễn thuế về kho'
            },
            {
                value: 8,
                text: '5.8 Kê khai hàng mẫu xuất từ kho vào cửa hàng'
            },
            {
                value: 9,
                text: '5.9 Kê khai hàng mẫu xuất từ cửa hàng về kho'
            },
            {
                value: 10,
                text: '5.10 Kê khai hàng mẫu xuất sử dụng'
            },
            {
                value: 11,
                text: '5.11 Kê khai hàng hóa xuất từ kho lên tàu bay'
            },
            {
                value: 12,
                text: '5.12 Kê khai hàng hóa xuất từ tàu bay về kho'
            }

        ];

        $scope.onChangeMaHaiQuan = function (mahq) {
            if (mahq) {
                mahq = mahq.toUpperCase();
                var data = $filter('filter')(mdService.tempData.donViHaiQuans, { value: mahq }, true);
                if (data && data.length > 0) {
                    $scope.filtered.advanceData.maHaiQuan = data[0].value;
                    $scope.filtered.advanceData.idHaiQuan = data[0].id;
                    $scope.target.donViHaiQuanCodes = data[0].id;
                    //$scope.lstDoanhnghiep = $scope.tempData.companiesByHQ.filter(function (dn) {
                    //    return (dn.referenceDataId.indexOf($scope.filtered.advanceData.idHaiQuan) === 0);
                    //});
                }
            }
        };        //Nhóm hàng
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
        //$scope.selectCompany = function () {
        //    var modalInstance = $uibModal.open({
        //        backdrop: 'static',
        //        templateUrl: mdService.buildUrl('mdCompany', 'selectData'),
        //        controller: 'companySelectDataController',
        //        resolve: {
        //            serviceSelectData: function () {
        //                return serviceInventoryAndCompany;
        //            },
        //            filterObject: function () {
        //                return {

        //                }
        //            }
        //        }
        //    });
        //    modalInstance.result.then(function (updatedData) {
        //        console.log(updatedData);
        //    }, function () {
        //        $log.info('Modal dismissed at: ' + new Date());
        //    });
        //}
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
        };

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
        //$scope.selectUnitUser = function () {
        //    var modalInstance = $uibModal.open({
        //        backdrop: 'static',
        //        templateUrl: mdService.buildUrl('mdUnitUser', 'selectData'),
        //        controller: 'UnitUserSelectDataController',
        //        resolve: {
        //            serviceSelectData: function () {
        //                return serviceInventoryAndUnitUser;
        //            },
        //            filterObject: function () {
        //                return {
        //                    advanceData: {
        //                        donViHaiQuanChuQuan: $scope.target.donViHaiQuanCodes,
        //                        maDoanhNghiep: $scope.target.companyCodes
        //                    },
        //                    isAdvance: true
        //                }
        //            }
        //        }
        //    });
        //    modalInstance.result.then(function (updatedData) {
        //    }, function () {
        //        $log.info('Modal dismissed at: ' + new Date());
        //    });
        //}
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
                console.log(updatedData);
                $scope.tagUnitUsers = updatedData;
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

            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            outputService.getNewParameter(function (response) {
                $scope.target = response;
            });
            outputService.postQuery(
                JSON.stringify(postdata),
                function (response) {
                    $scope.isLoading = false;
                    if (response) {

                        $scope.data = response;
                        angular.extend($scope.paged, response.data);
                        console.log($scope.paged);
                    }
                });
        }

        filterData();
        // $scope.report = function () {

        // $state.go('outputReport', { obj: $scope.target });
        // }

        $scope.report = function () {
            if ($scope.target.donViHaiQuanCodes == "") {
                $scope.target.donViHaiQuanCodes = $scope.data.id;
            }
            //outputService.getReport($scope.target);
            $scope.target.action = "xuat";
            $state.go('inputReport', { obj: $scope.target });
        }
        $scope.exportToExcel = function () {
            if ($scope.target.donViHaiQuanCodes == "") {
                $scope.target.donViHaiQuanCodes = $scope.data.id;
            }
            $scope.target.isExportExcel = true;
            outputService.postExportExcelReport($scope.target, "BaoCaoTinhHinhXuat");
        }
    }
]);
nvModule.controller('reportOutputController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'outputService', 'mdService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, outputService, mdService, clientService) {
    var para = $state.params.obj;
    $scope.robot = angular.copy(outputService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.goIndex = function () {
        $state.go('output');
    }
    function filterData() {
        if (para) {
            outputService.postReportShipment(para, function (response) {
                if (response.status) {
                    console.log(response);
                    $scope.target.data = response.data;
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


//nvModule.controller('reportOutputController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
//    'nvService', 'outputService', 'mdService', 'clientService',
//function ($scope, $window, $stateParams, $timeout, $state,
//nvService, outputService, mdService, clientService) {
//    var para = $state.params.obj;
//    $scope.robot = angular.copy(outputService.robot);
//    $scope.tempData = mdService.tempData;
//    $scope.target = [];
//    $scope.goIndex = function () {
//        $state.go('outputController');
//    }
//    $scope.target.data = [];
//    console.log(para);

//    function groupDefinition(code) {

//    }

//    function filterData() {
//        if (para) {
//            outputService.postReportNhapMua(para, function (response) {
//                console.log(response);
//                $scope.target.data = response.data;
//                console.log($scope.target.data);
//            });
//        }
//    };

//    $scope.print = function () {
//        var table = document.getElementById('main-report').innerHTML;
//        var myWindow = $window.open('', '', 'width=800, height=600');
//        myWindow.document.write(table);
//        myWindow.print();
//    }

//    filterData();
//}]);

nvModule.controller('reportOutputByCustomUnitController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'outputService', 'mdService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, outputService, mdService, clientService) {
    var para = $state.params.obj;
    $scope.robot = angular.copy(outputService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.goIndex = function () {
        $state.go('output');
    }
    $scope.target.data = [];
    console.log(para);
    function filterData() {
        if (para) {
            outputService.postReportNhapMua(para, function (response) {
                console.log(response);
                $scope.target.data = response.data;
                console.log($scope.target.data);

            });
        };
    };

    $scope.print = function () {
        var table = document.getElementById('main-report').innerHTML;
        var myWindow = $window.open('', '', 'width=800, height=600');
        myWindow.document.write(table);
        myWindow.print();
    };

    filterData();
}]);

nvModule.controller('reportOutputByCompanyController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'outputService', 'mdService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, outputService, mdService, clientService) {
    var para = $state.params.obj;
    $scope.robot = angular.copy(outputService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.goIndex = function () {
        $state.go('output');
    }
    $scope.target.data = [];
    console.log(para);
    function filterData() {
        if (para) {
            outputService.postReportNhapMua(para, function (response) {
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

    filterData();
}]);

nvModule.controller('reportOutputByCodeHsController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'outputService', 'mdService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, outputService, mdService, clientService) {
    var para = $state.params.obj;
    $scope.robot = angular.copy(outputService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.goIndex = function () {
        $state.go('output');
    }
    $scope.target.data = [];
    console.log(para);
    function filterData() {
        if (para) {
            outputService.postReportNhapMua(para, function (response) {
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

    filterData();
}]);