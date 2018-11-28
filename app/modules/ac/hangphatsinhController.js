acModule.factory('hangphatsinhService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.apiServiceBaseUri;
        var serviceUrl = configService.rootUrlWebApi + '/Nv/XuatBanLe';
        var serviceXuatBanKH = configService.rootUrlWebApi + '/Ac/XuatBanKH';
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
                $http.post(serviceUrl + '/PostReportHangPhatSinh', data, { responseType: 'arraybuffer' }).success(function (data) {

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
                $http.get(serviceXuatBanKH + '/GetNewParameter').success(callback);
            },

            postReportShipment: function (data, callback) {
                $http.post(serviceUrl + '/PostReportShipment', data).success(callback);
            },
            postDonViHaiQuan: function (data, callback) {
                $http.post(serviceUrl + '/PostDonViHaiQuan', data).success(callback);
            },
            postExportExcelReport: function (json, filename) {
                $http({
                    url: serviceXuatBanKH + '/PostExportExcelHangPhatSinh',
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
            postReportXuatBanKH: function (data, callback) {
                $http.post(serviceXuatBanKH + '/PostReportXuatBanKH', data).success(callback);
            },


        }
        return result;
    }
]);


acModule.controller('hangphatsinhController', [
    '$scope', '$rootScope', '$window', '$stateParams', '$timeout', '$sce', '$state', '$uibModal', '$log',
    'mdService', 'hangphatsinhService', 'clientService', 'configService', '$filter', 'serviceInventoryAndWareHouse', 'serviceInventoryAndMerchandiseType', 'serviceInventoryAndMerchandise', 'serviceInventoryAndMerchandiseGroup', 'serviceInventoryAndCompany', 'serviceInventoryAndDonViHaiQuan', 'serviceInventoryAndUnitUser', 'serviceInventoryAndDoiTuong',
    function ($scope, $rootScope, $window, $stateParams, $timeout, $sce, $state, $uibModal, $log,
        mdService, hangphatsinhService, clientService, configService, $filter, serviceInventoryAndWareHouse, serviceInventoryAndMerchandiseType, serviceInventoryAndMerchandise, serviceInventoryAndMerchandiseGroup, serviceInventoryAndCompany, serviceInventoryAndDonViHaiQuan, serviceInventoryAndUnitUser, serviceInventoryAndDoiTuong) {
        $scope.tempData = mdService.tempData;
        console.log($scope.tempData.customers);
        $scope.config = configService;
        $scope.target = {};
        $scope.tagWareHouses = [];
        $scope.tagMerchandiseTypes = [];
        $scope.tagMerchandises = [];
        $scope.tagMerchandiseGroups = [];
        $scope.tagUnitUsers = [];
        $scope.tagDoiTuongs = [];
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);

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
            return "";
        };
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
        };

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
        $scope.selectWareHouse = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('MdWareHouse', 'selectData'),
                controller: 'wareHouseSelectDataController',
                resolve: {
                    selectedWareHouse: function () {
                        return $scope.tagWareHouses;
                    },
                    selectedDoanhNghiep: function () {
                        return $scope.tagCompanies;
                    },
                    selectedHaiQuan: function () {
                        return $scope.filtered.advanceData;
                    }

                }
            });
            modalInstance.result.then(function (updatedData) {
                $scope.tagWareHouses = updatedData;
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
        $scope.selectDoiTuong = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdDoiTuong', 'selectData'),
                controller: 'doiTuongSelectSingleDataController',
                resolve: {
                    serviceSelectData: function () {
                        return serviceInventoryAndDoiTuong;
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
        $scope.removeWareHouse = function (index) {
            $scope.tagWareHouses.splice(index, 1);
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
        $scope.removeDoiTuong = function (index) {
            $scope.tagDoiTuongs.splice(index, 1);
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
        $scope.$watch('tagDoiTuongs', function (newValue, oldValue) {
            var values = $scope.tagDoiTuongs.map(function (element) {
                return element.value;
            });
            $scope.target.doiTuongCodes = values.join();

        }, true);
        $scope.$watch('tagWareHouses', function (newValue, oldValue) {
            var values = $scope.tagWareHouses.map(function (element) {
                return element.value;
            });
            $scope.target.wareHouseCodes = values.join();

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
                $scope.tagDoiTuongs.clear();
            });

        function filterData() {
            $scope.tagWareHouses = serviceInventoryAndWareHouse.getSelectData();
            $scope.tagMerchandiseTypes = serviceInventoryAndMerchandiseType.getSelectData();
            $scope.tagMerchandises = serviceInventoryAndMerchandise.getSelectData();
            $scope.tagMerchandiseGroups = serviceInventoryAndMerchandiseGroup.getSelectData();
            $scope.tagCompanies = serviceInventoryAndCompany.getSelectData();
            $scope.tagDonViHaiQuans = serviceInventoryAndDonViHaiQuan.getSelectData();
            $scope.tagUnitUsers = serviceInventoryAndUnitUser.getSelectData();
            $scope.tagDoiTuongs = serviceInventoryAndDoiTuong.getSelectData();

            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            hangphatsinhService.getNewParameter(function (response) {
                $scope.target = response;
            });

            hangphatsinhService.postDonViHaiQuan(JSON.stringify(postdata),
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
            $scope.target.doiTuongCodes = "";
            $state.go('reportHangPhatSinh', { obj: $scope.target });
            //hangphatsinhService.getReport($scope.target);
        }
        $scope.exportToExcel = function () {
            if ($scope.target.donViHaiQuanCodes == "") {
                $scope.target.donViHaiQuanCodes = $scope.data.id;
            }
            $scope.target.isExportExcel = true;
            hangphatsinhService.postExportExcelReport($scope.target, "BaoCaoHangPhatSinh");
        }
    }
]);

acModule.controller('reportHangPhatSinhController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'hangphatsinhService', 'mdService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, hangphatsinhService, mdService, clientService) {
    var para = $state.params.obj;
    $scope.robot = angular.copy(hangphatsinhService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.goIndex = function () {
        $state.go('hangphatsinh');
    }
    $scope.target.data = [];
    function filterData() {
        $scope.toDate = para.toDate;
        $scope.fromDate = para.fromDate;
        $scope.title = "Báo cáo bán hàng phát sinh";
        if (para) {
            hangphatsinhService.postReportXuatBanKH(para, function (response) {
                $scope.target.data = response;
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
