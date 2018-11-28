var phieuDieuChuyenNoiBoService = nvModule.factory('phieuDieuChuyenNoiBoService',
    ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.apiServiceBaseUri;
        var serviceUrl = rootUrl + '/api/Nv/DieuChuyenNoiBo';
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
            changeSoLuongBao: function (item) {
                if (!item.soLuongLe) {
                    item.soLuongLe = 0;
                }
                if (!item.maBaoBi) {
                    item.luongBao = 1;
                }
                item.soLuong = item.soLuongBao * item.luongBao + item.soLuongLe;
                item.thanhTien = item.soLuong * item.donGia;
            },
            changeDonGia: function (item) {
                if (!item.maBaoBi) {
                    item.luongBao = 1;
                }
                if (!item.soLuongBao) {
                    item.soLuongBao = 0;
                }
                if (!item.soLuongLe) {
                    item.soLuongLe = 0;
                }
                item.soLuong = item.soLuongBao * item.luongBao + item.soLuongLe;
                item.thanhTien = item.soLuong * item.donGia;
            },
            changeSoLuongLe: function (item) {
                if (!item.soLuong) {
                    item.soLuong = 0;
                }
                if (!item.donGia) {
                    item.donGia = 0;
                }
                if (!item.maBaoBi) {
                    item.luongBao = 1;
                }
                if (!item.soLuongBao) {
                    item.soLuongBao = 0;
                }
                item.soLuong = item.soLuongBao * item.luongBao + item.soLuongLe;
                item.thanhTien = item.soLuong * item.donGia;
            },
        }
        this.parameterPrint = {};
        function getParameterPrint() {
            return this.parameterPrint;
        }
        var result = {
            robot: calc,
            setParameterPrint: function (data) {
                parameterPrint = data;
            },
            getParameterPrint: function () {
                return parameterPrint;
            },
            post: function (data, callback) {
                $http.post(serviceUrl + '/Post', data).success(callback);
            },
            postQuery: function (data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            postRecieveQuery: function (data, callback) {
                $http.post(serviceUrl + '/PostRecieveQuery', data).success(callback);
            },
            postQueryApproval: function (data, callback) {
                $http.post(serviceUrl + '/PostQueryApproval', data).success(callback);
            },
            postPrint: function (callback) {
                $http.post(serviceUrl + '/PostPrint', getParameterPrint()).success(callback);
            },
            postPrintDetail: function (callback) {
                $http.post(serviceUrl + '/PostPrintDetail', getParameterPrint()).success(callback);
            },
            postPostRecieve: function (data, callback) {
                return $http.post(serviceUrl + '/PostRecieve', data).success(callback);
            },
            postApproval: function (data, callback) {
                $http.post(serviceUrl + '/PostApproval', data).success(callback);
            },
            getReport: function (id, callback) {
                $http.get(serviceUrl + '/GetReport/' + id).success(callback);
            },
            getNewInstance: function (callback) {
                $http.get(serviceUrl + '/GetNewInstance').success(callback);
            },
            getNewInstanceFrom: function (maChungTu, callback) {
                $http.get(serviceUrl + '/GetNewInstanceFrom/' + maChungTu).success(callback);
            },
            getDetails: function (id, callback) {
                $http.get(serviceUrl + '/GetDetails/' + id).success(callback);
            },
            getCurrentUser: function (callback) {
                $http.get(rootUrl + '/api/Authorize/User/GetCurrentUser').success(callback);
            },
            getWareHouseByUnit: function (maDonVi, callback) {
                $http.get(rootUrl + '/api/Md/WareHouse/GetByUnit/' + maDonVi).success(callback);
            },
            getWareHouseByCode: function (code, callback) {
                $http.get(rootUrl + '/api/Md/WareHouse/GetByCode/' + code).success(callback);
            },
            getModuleById: function (id, module, callback) {
                $http.get(rootUrl + '/api/Md/' + module + '/' + id).success(callback);
            },
            update: function (params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            getMerchandiseForNvByCode: function (code) {
                return $http.get(rootUrl + '/api/Md/Merchandise/GetForNvByCode/' + code);
            },
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            },
        };
        return result;

    }
    ])

var phieuDieuChuyenNoiBoController = nvModule.controller('phieuDieuChuyenNoiBoController', [
'$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
 'configService', 'clientService', 'nvService', 'mdService', 'blockUI', 'phieuDieuChuyenNoiBoService', 'serviceDieuChuyenAndMerchandise', '$mdDialog', 'localStorageService', 'authorizeService',
function (
    $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
    configService, clientService, nvService, mdService, blockUI, phieuDieuChuyenNoiBoService, serviceDieuChuyenAndMerchandise, $mdDialog, localStorageService, authorizeService
    ) {
    $scope.robot = angular.copy(phieuDieuChuyenNoiBoService.robot);
    $scope.config = nvService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.permission = authorizeService.permissionModel.permission;

    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };

    $scope.sortType = 'ngayCT'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.doSearch = function () {
        $scope.paged.currentPage = 1;
        filterData();
    };
    $scope.pageChanged = function () {
        filterData();
    };
    $scope.goHome = function () {
        $state.go('home');
    };
    $scope.refresh = function () {
        $scope.setPage($scope.paged.currentPage);
    };
    $scope.title = function () {
        return 'Phiếu điều chuyển nội bộ';
    };
        $scope.deleteItem = function(ev, item) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Cảnh báo')
                .textContent('Dữ liệu có thể liên kết với các dữ liệu khác, bạn có chắc muốn xóa?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Ok')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                phieuDieuChuyenNoiBoService.deleteItem(item).then(function(data) {
                    console.log(data);
                }).then(function(data) {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Thông báo')
                            .textContent('Xóa thành công')
                            .ariaLabel('Alert')
                            .ok('Ok')
                            .targetEvent(ev))
                        .finally(function() {
                            filterData();
                        });
                });

            }, function() {
                console.log('Không xóa');
            });
        };

        $scope.create = function() {
            var modalInstance = $uibModal.open({
                templateUrl: nvService.buildUrl('nvPhieuDieuChuyenNoiBo', 'add'),
                controller: 'phieuDieuChuyenNoiBoCreateController',
                windowClass: 'app-modal-window',
                resolve: {
                    objectFilter: function() {
                        return {};
                    }
                }
            });

            modalInstance.result.then(function(updatedData) {
                serviceDieuChuyenAndMerchandise.getSelectData().clear();
                $scope.refresh();
            }, function() {
                serviceDieuChuyenAndMerchandise.getSelectData().clear();
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.print = function() {
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            phieuDieuChuyenNoiBoService.setParameterPrint(
                postdata);
            $state.go("nvPrintPhieuDieuChuyenNoiBo");
        }
        $scope.printDetail = function() {

            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            phieuDieuChuyenNoiBoService.setParameterPrint(
                postdata);
            $state.go("nvPrintDetailPhieuDieuChuyenNoiBo");
        }

        $scope.details = function(target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvPhieuDieuChuyenNoiBo', 'details'),
                controller: 'phieuDieuChuyenNoiBoDetailsController',
                windowClass: 'app-modal-window',
                resolve: {
                    targetData: function() {
                        return target;
                    }
                }
            });
            modalInstance.result.then(function(updatedData) {
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.update = function(target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvPhieuDieuChuyenNoiBo', 'update'),
                controller: 'phieuDieuChuyenNoiBoEditController',
                windowClass: 'app-modal-window',
                resolve: {
                    targetData: function() {
                        return target;
                    }
                }
            });

            modalInstance.result.then(function(updatedData) {
                serviceDieuChuyenAndMerchandise.getSelectData().clear();
                $scope.refresh();
            }, function() {
                serviceDieuChuyenAndMerchandise.getSelectData().clear();
                $log.info('Modal dismissed at:' + new Date());
            });
        }
   
    filterData();
    function filterData() {
        $scope.isLoading = true;
        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        phieuDieuChuyenNoiBoService.postQuery(
            JSON.stringify(postdata),
            function (response) {
                $scope.isLoading = false;
                if (response.status) {
                    $scope.data = response.data.data;
                    angular.extend($scope.paged, response.data);
                }
            });
    };
}])
nvModule.controller('phieuDieuChuyenNoiBoNhanController', [
'$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
'configService', 'clientService', 'nvService', 'mdService', 'blockUI', 'phieuDieuChuyenNoiBoService', 'serviceDieuChuyenAndMerchandise',
function (
   $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
   configService, clientService, nvService, mdService, blockUI, phieuDieuChuyenNoiBoService, serviceDieuChuyenAndMerchandise
   ) {
    $scope.robot = angular.copy(phieuDieuChuyenNoiBoService.robot);
    $scope.config = nvService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };

    $scope.sortType = 'ngayCT'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.doSearch = function () {
        $scope.paged.currentPage = 1;
        filterData();
    };
    $scope.pageChanged = function () {
        filterData();
    };
    $scope.goHome = function () {
        $state.go('home');
    };
    $scope.refresh = function () {
        $scope.setPage($scope.paged.currentPage);
    };
    $scope.title = function () {
        return 'Phiếu điều chuyển nội bộ';
    };
    $scope.viewRecieve = function () {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('nvPhieuDieuChuyenNoiBo', 'recieve'),
            controller: 'phieuDieuChuyenNoiBoRecieveController',
            windowClass: 'app-modal-window',
            resolve: {

            }
        });
    }
    $scope.print = function () {
        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        phieuDieuChuyenNoiBoService.setParameterPrint(
            postdata);
        $state.go("nvPrintPhieuDieuChuyenNoiBo");
    }
    $scope.printDetail = function () {

        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        phieuDieuChuyenNoiBoService.setParameterPrint(
            postdata);
        $state.go("nvPrintDetailPhieuDieuChuyenNoiBo");
    }

    $scope.details = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('nvPhieuDieuChuyenNoiBo', 'details'),
            controller: 'phieuDieuChuyenNoiBoDetailsController',
            windowClass: 'app-modal-window',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
        modalInstance.result.then(function (updatedData) {
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.createRecieve = function () {
        var modalInstance = $uibModal.open({
            templateUrl: nvService.buildUrl('nvPhieuDieuChuyenNoiBo', 'addRecieve'),
            controller: 'phieuDieuChuyenNoiBoNhanCreateController',
            windowClass: 'app-modal-window',
            resolve: {
                objectFilter: function () {
                    return {};
                }
            }
        });

        modalInstance.result.then(function (updatedData) {
            serviceDieuChuyenAndMerchandise.getSelectData().clear();
            $scope.refresh();
        }, function () {
            serviceDieuChuyenAndMerchandise.getSelectData().clear();
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    filterData();
    function filterData() {
        $scope.isLoading = true;
        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        phieuDieuChuyenNoiBoService.postRecieveQuery(
            JSON.stringify(postdata),
            function (response) {
                $scope.isLoading = false;
                if (response.status) {
                    $scope.data = response.data.data;
                    angular.extend($scope.paged, response.data);
                }
            });
    };
}])
nvModule.controller('phieuDieuChuyenNoiBoNhanCreateController', [
    '$scope', '$uibModalInstance', '$filter', '$uibModal', '$log',
    'nvService', 'phieuDieuChuyenNoiBoService', 'mdService', 'clientService', 'configService', 'serviceDieuChuyenAndMerchandise', '$state', 'objectFilter', 'focus',
    function ($scope, $uibModalInstance, $filter, $uibModal, $log,
        nvService, phieuDieuChuyenNoiBoService, mdService, clientService, configService, serviceDieuChuyenAndMerchandise, $state, objectFilter, focus) {
        $scope.robot = angular.copy(phieuDieuChuyenNoiBoService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.data = [];
        $scope.target = { dataDetails: [] };
        $scope.khoXuats = mdService.tempData.wareHouses;
        $scope.formatLabelForWareHouseOtherUnit = function (model) {
            console.log(model);
            if (!model) return "";
            var data = $filter('filter')($scope.khoNhaps, { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        }
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };

        $scope.khoNhaps = [];
        $scope.addRow = function () {
            if (!$scope.newItem.soLuong || $scope.newItem.soLuong < 1) {
                focus('soluong');
                return;
            }
            if ($scope.newItem.validateCode == $scope.newItem.maHang) {
                $scope.target.dataDetails.push($scope.newItem);
            }
            $scope.pageChanged();
            $scope.newItem = {};
            focus('mahang');
        };
        $scope.addNewItem = function (strKey) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'selectData'),
                controller: 'merchandiseSelectDataController',
                windowClass: 'app-modal-window',
                resolve: {
                    serviceSelectData: function () {
                        return serviceDieuChuyenAndMerchandise;
                    },
                    filterObject: function () {
                        return {
                            summary: strKey
                        };
                    }
                }
            });
            modalInstance.result.then(function (updatedData) {
                if (!updatedData.selected) {
                    $scope.newItem = updatedData;
                    if ($scope.isSameUnitUser) {
                        $scope.newItem.donGia = updatedData.giaBanLeVat;
                    } else {
                        $scope.newItem.donGia = updatedData.giaBanBuonVat;
                    }
                    $scope.newItem.validateCode = updatedData.maHang;
                }
                $scope.pageChanged();
            }, function () {

            });
        }
        $scope.removeItem = function (index) {
            var currentPage = $scope.paged.currentPage;
            var itemsPerPage = $scope.paged.itemsPerPage;
            currentPageIndex = (currentPage - 1) * itemsPerPage + index;
            $scope.target.dataDetails.splice(currentPageIndex, 1);
            $scope.pageChanged();
        }
        $scope.cancel = function () {
            $scope.target.dataDetails.clear();
            $uibModalInstance.dismiss('cancel');
        };
        $scope.title = function () {
            if ($scope.isSameUnitUser) {
                return 'Phiếu xuất chuyển kho';
            }
            else {
                return 'Phiếu xuất siêu thị thành viên';
            }
        };
        $scope.$watch("target.dataDetails", function (newValue, oldValue) {
            $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
        }, true);

        $scope.selectedMaHang = function (code) {
            if (code) {
                phieuDieuChuyenNoiBoService.getMerchandiseForNvByCode(code).then(function (response) {
                    console.log(response);
                    $scope.newItem = response.data;
                    if ($scope.isSameUnitUser) {
                        $scope.newItem.donGia = response.data.giaMuaVat;
                    } else {
                        $scope.newItem.donGia = response.data.giaBanBuonVat;
                    }
                }, function () {
                    $scope.addNewItem(code);
                }
                )
            }
        }
        $scope.saveAndKeep = function () {
            var tempData = angular.copy($scope.target);
            var extendData = { dataDetails: $scope.data };
            angular.extend($scope.target, extendData);
            phieuDieuChuyenNoiBoService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        phieuDieuChuyenNoiBoService.getNewInstance(function (response2) {
                            var expectData = response2;
                            tempData.maChungTu = expectData.maChungTu;
                            tempData.ngayCT = expectData.ngayCT;
                            tempData.ngayDieuDong = expectData.ngayDieuDong;
                            $scope.target = tempData;
                        });
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                }
                );
        };
        $scope.saveAndPrint = function () {
            var extendData = { dataDetails: $scope.data };
            angular.extend($scope.target, extendData);
            phieuDieuChuyenNoiBoService.post($scope.target, function (response) {
                if (response.status) {
                    clientService.noticeAlert("Thành công", "success");
                    $scope.target.dataDetails.clear();
                    $uibModalInstance.close($scope.target);
                } else {
                    clientService.noticeAlert(response.message, "danger");
                }
            }
                );
        };
        $scope.sum = function () {
            var total = 0;
            angular.forEach($scope.data, function (value, key) {
                total = total + value.thanhTien;
            });
            $scope.total = total;
        }
        $scope.save = function () {
            phieuDieuChuyenNoiBoService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        $scope.target.dataDetails.clear();
                        $uibModalInstance.close($scope.target);
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                }
                );
        };
        $scope.selectedMaBaoBi = function (model, item) {
            if (!model.soLuongBao) {
                model.soLuongBao = 0;
            }
            if (!model.donGia) {
                model.donGia = 0;
            }
            if (!model.soLuongLe) {
                model.soLuongLe = 0;
            }
            model.luongBao = parseFloat(item.extendValue);
            model.soLuong = model.soLuongBao * model.luongBao + model.soLuongLe;
            model.thanhTien = model.soLuong * model.donGia;
        }
        $scope.getWareHouseImportByUnit = function () {
            if ($scope.target.maDonViNhan) {
                phieuDieuChuyenNoiBoService.getWareHouseByUnit($scope.target.maDonViNhan, function (response) {
                    $scope.khoNhaps = response;
                });
            };
        }
        function filterData() {
            var maChungTu = ""
            //   $scope.maKhoXuat = objectFilter.maKhoXuat;
            if (objectFilter && objectFilter.maChungTu) {
                maChungTu = objectFilter.maChungTu;
                getNew(maChungTu);
            } else {
                phieuDieuChuyenNoiBoService.getNewInstance(function (response) {
                    console.log(response);
                    $scope.target = response;
                    //$scope.target.dataDetails = serviceDieuChuyenAndMerchandise.getSelectData();//HUY-dong nay bi sai nhe em
                    serviceDieuChuyenAndMerchandise.setSelectData($scope.target.dataDetails);//Du lieu tra ve can phan trang phai co nhung dong tuong tu nhu the nay
                    $scope.pageChanged();
                })
            }

            console.log($scope.target);
        };
        $scope.isSameUnitUser = true;
        $scope.$watch("target.maDonViNhan", function (newValue, oldValue) {
            var maDonViNhan = $scope.target.maDonViNhan;
            phieuDieuChuyenNoiBoService.getCurrentUser(function (response) {
                var maDonViXuat = response.unitUser.maDonVi;
                if (maDonViNhan == maDonViXuat) {
                    $scope.isSameUnitUser = true;
                }
                else {
                    $scope.isSameUnitUser = false;
                }
            });
        }, true);
        //$scope.checkStorage = function () {
        //    var maDonViNhan = $scope.target.maDonViNhan;
        //    phieuDieuChuyenNoiBoService.getCurrentUser(function (response) {
        //        var maDonViXuat = response.unitUser.maDonVi;
        //        if (maDonViNhan == maDonViXuat) {
        //            $scope.isSameUnitUser = true;
        //        }
        //        else {
        //            $scope.isSameUnitUser = false;
        //        }
        //        console.log("Ma Don Vi Nhan", $scope.target.maDonViNhan);
        //        console.log("Ma DV Xuat", maDonViXuat);
        //    });
        //}
        function getNew(maChungTu) {
            phieuDieuChuyenNoiBoService.getNewInstanceFrom(maChungTu, function (response) {
                console.log(response);
                $scope.target = response;
                $scope.pageChanged();
                var data = $filter('filter')($scope.khoXuats, { value: objectFilter.maKhoXuat }, true);
                if (data && data.length == 1) {
                    $scope.target.maKhoXuat = data[0];
                }
                $scope.target.lenhDieuDong = objectFilter.maChungTu;
            });
        }
        $scope.createWareHouse = function (target, name) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdWareHouse', 'add'),
                controller: 'wareHouseCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('wareHouses', function () {
                    if (target && name) {
                        target[name] = updatedData.maKho;
                    }
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.createMerchandise = function (target, name) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'add'),
                controller: 'merchandiseCreateController',
                windowClass: 'app-modal-window',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('merchandises', function () {
                    if (target && name) {
                        target[name] = updatedData.maVatTu;
                    }
                });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.createPackage = function (target, name) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdPackaging', 'add'),
                controller: 'packagingCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('packagings', function () {
                    if (target && name) {
                        target[name] = updatedData.maBaoBi;
                        target.luongBao = updatedData.soLuong;
                    }
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.createCustomer = function (target, name) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdCustomer', 'add'),
                controller: 'customerCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('customers', function () {
                    if (target && name) {
                        target[name] = updatedData.maKH;
                    }
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.pageChanged = function () {
            var currentPage = $scope.paged.currentPage;
            var itemsPerPage = $scope.paged.itemsPerPage;
            $scope.paged.totalItems = $scope.target.dataDetails.length;
            $scope.data = [];
            if ($scope.target.dataDetails) {
                for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < $scope.target.dataDetails.length; i++) {
                    $scope.data.push($scope.target.dataDetails[i])
                }
            }
        }
        filterData();
    }
]);
nvModule.controller('phieuDieuChuyenNoiBoDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'phieuDieuChuyenNoiBoService', 'targetData', 'clientService', '$filter', 'configService',
function ($scope, $uibModalInstance,
    mdService, phieuDieuChuyenNoiBoService, targetData, clientService, $filter, configService) {
    $scope.robot = angular.copy(phieuDieuChuyenNoiBoService.robot);
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.khoNhaps = [];
    $scope.khoXuats = [];
    $scope.sum = function () {
        var total = 0;
        if ($scope.target.dataDetails) {
            angular.forEach($scope.target.dataDetails, function (v, k) {
                total = total + v.thanhTien;
            })
        }
        return total;
    };
    $scope.title = function () {
        if ($scope.isSameUnitUser) {
            return 'Phiếu xuất chuyển kho';
        }
        else {
            return 'Phiếu xuất siêu thị thành viên';
        }
    };
    $scope.isSameUnitUser = true;

    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };


    $scope.getWareHouseImportByUnit = function () {
        if ($scope.target.maDonViNhan) {
            phieuDieuChuyenNoiBoService.getWareHouseByUnit($scope.target.maDonViNhan, function (response) {
                $scope.khoNhaps = response;
                var data = $filter('filter')($scope.khoNhaps, { value: $scope.target.maKhoNhap }, true);
                if (data && data.length == 1) {
                    $scope.target.maKhoNhapTemp = data[0];
                }
            });
        };
        if ($scope.target.maDonViXuat) {
            phieuDieuChuyenNoiBoService.getWareHouseByUnit($scope.target.maDonViXuat, function (response) {
                $scope.khoXuats = response;
                var data = $filter('filter')($scope.khoXuats, { value: $scope.target.maKhoXuat }, true);
                if (data && data.length == 1) {
                    $scope.target.maKhoXuatTemp = data[0];
                }
            });
        };
    }

    $scope.formatLabelForWareHouseOtherUnit = function (model) {
        console.log(model);
        if (!model) return "";
        var data = $filter('filter')($scope.khoNhaps, { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    }
    $scope.approval = function () {
        phieuDieuChuyenNoiBoService.postApproval(JSON.stringify($scope.target), function (response) {
            if (response) {

                alert("Duyệt thành công!");
                fillterData();
            }
            else { alert("Thất bại! - Xảy ra lỗi hoặc phiếu này đã duyệt"); }

        });
    };
    fillterData();
    function fillterData() {
        $scope.isLoading = true;
        phieuDieuChuyenNoiBoService.getDetails($scope.target.id, function (response) {
            if (response.status) {
                $scope.target = response.data;
                $scope.getWareHouseImportByUnit();
                $scope.isLoading = false;
                $scope.pageChanged();
            }
        });
        var maDonViNhan = $scope.target.maDonViNhan;
        phieuDieuChuyenNoiBoService.getCurrentUser(function (response) {
            var maDonViXuat = response.unitUser.maDonVi;
            if (maDonViNhan == maDonViXuat) {
                $scope.isSameUnitUser = true;
            }
            else {
                $scope.isSameUnitUser = false;
            }
        });
    }
    $scope.pageChanged = function () {
        var currentPage = $scope.paged.currentPage;
        var itemsPerPage = $scope.paged.itemsPerPage;
        $scope.paged.totalItems = $scope.target.dataDetails.length;
        $scope.data = [];
        if ($scope.target.dataDetails) {
            for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < $scope.target.dataDetails.length; i++) {
                $scope.data.push($scope.target.dataDetails[i])
            }
        }
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}
]);
nvModule.controller('phieuDieuChuyenNoiBoCreateController', [
    '$scope', '$uibModalInstance', '$filter', '$uibModal', '$log',
    'nvService', 'phieuDieuChuyenNoiBoService', 'mdService', 'clientService', 'configService', 'serviceDieuChuyenAndMerchandise', '$state', 'objectFilter', 'focus',
    function ($scope, $uibModalInstance, $filter, $uibModal, $log,
        nvService, phieuDieuChuyenNoiBoService, mdService, clientService, configService, serviceDieuChuyenAndMerchandise, $state, objectFilter, focus) {
        $scope.robot = angular.copy(phieuDieuChuyenNoiBoService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.data = [];
        $scope.target = { dataDetails: [] };
        $scope.khoXuats = mdService.tempData.wareHouses;
        $scope.formatLabelForWareHouseOtherUnit = function (model) {
            console.log(model);
            if (!model) return "";
            var data = $filter('filter')($scope.khoNhaps, { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        }
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };

        $scope.khoNhaps = [];
        $scope.addRow = function () {
            if (!$scope.newItem.soLuong || $scope.newItem.soLuong < 1) {
                focus('soluong');
                return;
            }
            if ($scope.newItem.validateCode == $scope.newItem.maHang) {
                $scope.target.dataDetails.push($scope.newItem);
            }
            $scope.pageChanged();
            $scope.newItem = {};
            focus('mahang');
        };
        $scope.addNewItem = function (strKey) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'selectData'),
                controller: 'merchandiseSelectDataController',
                windowClass: 'app-modal-window',
                resolve: {
                    serviceSelectData: function () {
                        return serviceDieuChuyenAndMerchandise;
                    },
                    filterObject: function () {
                        return {
                            summary: strKey
                        };
                    }
                }
            });
            modalInstance.result.then(function (updatedData) {
                if (!updatedData.selected) {
                    $scope.newItem = updatedData;
                    if ($scope.isSameUnitUser) {
                        $scope.newItem.donGia = updatedData.giaBanLeVat;
                    } else {
                        $scope.newItem.donGia = updatedData.giaBanBuonVat;
                    }
                    $scope.newItem.validateCode = updatedData.maHang;
                }
                $scope.pageChanged();
            }, function () {

            });
        }
        $scope.removeItem = function (index) {
            var currentPage = $scope.paged.currentPage;
            var itemsPerPage = $scope.paged.itemsPerPage;
            currentPageIndex = (currentPage - 1) * itemsPerPage + index;
            $scope.target.dataDetails.splice(currentPageIndex, 1);
            $scope.pageChanged();
        }
        $scope.cancel = function () {
            $scope.target.dataDetails.clear();
            $uibModalInstance.dismiss('cancel');
        };
        $scope.title = function () {
            if ($scope.isSameUnitUser) {
                return 'Phiếu xuất chuyển kho';
            }
            else {
                return 'Phiếu xuất siêu thị thành viên';
            }
        };
        $scope.$watch("target.dataDetails", function (newValue, oldValue) {
            $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
        }, true);

        $scope.selectedMaHang = function (code) {
            if (code) {
                phieuDieuChuyenNoiBoService.getMerchandiseForNvByCode(code).then(function (response) {
                    console.log(response);
                    $scope.newItem = response.data;
                    if ($scope.isSameUnitUser) {
                        $scope.newItem.donGia = response.data.giaMuaVat;
                    } else {
                        $scope.newItem.donGia = response.data.giaBanBuonVat;
                    }
                }, function () {
                    $scope.addNewItem(code);
                }
                )
            }
        }
        $scope.saveAndKeep = function () {
            var tempData = angular.copy($scope.target);
            var extendData = { dataDetails: $scope.data };
            angular.extend($scope.target, extendData);
            phieuDieuChuyenNoiBoService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        phieuDieuChuyenNoiBoService.getNewInstance(function (response2) {
                            var expectData = response2;
                            tempData.maChungTu = expectData.maChungTu;
                            tempData.ngayCT = expectData.ngayCT;
                            tempData.ngayDieuDong = expectData.ngayDieuDong;
                            $scope.target = tempData;
                        });
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                }
                );
        };
        $scope.saveAndPrint = function () {
            var extendData = { dataDetails: $scope.data };
            angular.extend($scope.target, extendData);
            phieuDieuChuyenNoiBoService.post($scope.target, function (response) {
                if (response.status) {
                    clientService.noticeAlert("Thành công", "success");
                    $scope.target.dataDetails.clear();
                    $uibModalInstance.close($scope.target);
                } else {
                    clientService.noticeAlert(response.message, "danger");
                }
            }
                );
        };
        $scope.sum = function () {
            var total = 0;
            angular.forEach($scope.data, function (value, key) {
                total = total + value.thanhTien;
            });
            $scope.total = total;
        }
        $scope.save = function () {
            phieuDieuChuyenNoiBoService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        $scope.target.dataDetails.clear();
                        $uibModalInstance.close($scope.target);
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                }
                );
        };
        $scope.selectedMaBaoBi = function (model, item) {
            if (!model.soLuongBao) {
                model.soLuongBao = 0;
            }
            if (!model.donGia) {
                model.donGia = 0;
            }
            if (!model.soLuongLe) {
                model.soLuongLe = 0;
            }
            model.luongBao = parseFloat(item.extendValue);
            model.soLuong = model.soLuongBao * model.luongBao + model.soLuongLe;
            model.thanhTien = model.soLuong * model.donGia;
        }
        $scope.getWareHouseImportByUnit = function () {
            if ($scope.target.maDonViNhan) {
                phieuDieuChuyenNoiBoService.getWareHouseByUnit($scope.target.maDonViNhan, function (response) {
                    $scope.khoNhaps = response;
                });
            };
        }
        function filterData() {
            var maChungTu = ""
            //   $scope.maKhoXuat = objectFilter.maKhoXuat;
            if (objectFilter && objectFilter.maChungTu) {
                maChungTu = objectFilter.maChungTu;
                getNew(maChungTu);
            } else {
                phieuDieuChuyenNoiBoService.getNewInstance(function (response) {
                    console.log(response);
                    $scope.target = response;
                    //$scope.target.dataDetails = serviceDieuChuyenAndMerchandise.getSelectData();//HUY-dong nay bi sai nhe em
                    serviceDieuChuyenAndMerchandise.setSelectData($scope.target.dataDetails);//Du lieu tra ve can phan trang phai co nhung dong tuong tu nhu the nay
                    $scope.pageChanged();
                })
            }

            console.log($scope.target);
        };
        $scope.isSameUnitUser = true;
        $scope.$watch("target.maDonViNhan", function (newValue, oldValue) {
            var maDonViNhan = $scope.target.maDonViNhan;
            phieuDieuChuyenNoiBoService.getCurrentUser(function (response) {
                var maDonViXuat = response.unitUser.maDonVi;
                if (maDonViNhan == maDonViXuat) {
                    $scope.isSameUnitUser = true;
                }
                else {
                    $scope.isSameUnitUser = false;
                }
            });
        }, true);
        //$scope.checkStorage = function () {
        //    var maDonViNhan = $scope.target.maDonViNhan;
        //    phieuDieuChuyenNoiBoService.getCurrentUser(function (response) {
        //        var maDonViXuat = response.unitUser.maDonVi;
        //        if (maDonViNhan == maDonViXuat) {
        //            $scope.isSameUnitUser = true;
        //        }
        //        else {
        //            $scope.isSameUnitUser = false;
        //        }
        //        console.log("Ma Don Vi Nhan", $scope.target.maDonViNhan);
        //        console.log("Ma DV Xuat", maDonViXuat);
        //    });
        //}
        function getNew(maChungTu) {
            phieuDieuChuyenNoiBoService.getNewInstanceFrom(maChungTu, function (response) {
                console.log(response);
                $scope.target = response;
                $scope.pageChanged();
                var data = $filter('filter')($scope.khoXuats, { value: objectFilter.maKhoXuat }, true);
                if (data && data.length == 1) {
                    $scope.target.maKhoXuat = data[0];
                }
                $scope.target.lenhDieuDong = objectFilter.maChungTu;
            });
        }
        $scope.createWareHouse = function (target, name) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdWareHouse', 'add'),
                controller: 'wareHouseCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('wareHouses', function () {
                    if (target && name) {
                        target[name] = updatedData.maKho;
                    }
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.createMerchandise = function (target, name) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'add'),
                controller: 'merchandiseCreateController',
                windowClass: 'app-modal-window',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('merchandises', function () {
                    if (target && name) {
                        target[name] = updatedData.maVatTu;
                    }
                });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.createPackage = function (target, name) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdPackaging', 'add'),
                controller: 'packagingCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('packagings', function () {
                    if (target && name) {
                        target[name] = updatedData.maBaoBi;
                        target.luongBao = updatedData.soLuong;
                    }
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.createCustomer = function (target, name) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdCustomer', 'add'),
                controller: 'customerCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('customers', function () {
                    if (target && name) {
                        target[name] = updatedData.maKH;
                    }
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.pageChanged = function () {
            var currentPage = $scope.paged.currentPage;
            var itemsPerPage = $scope.paged.itemsPerPage;
            $scope.paged.totalItems = $scope.target.dataDetails.length;
            $scope.data = [];
            if ($scope.target.dataDetails) {
                for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < $scope.target.dataDetails.length; i++) {
                    $scope.data.push($scope.target.dataDetails[i])
                }
            }
        }
        filterData();
    }
]);
nvModule.controller('phieuDieuChuyenNoiBoEditController',
    ['$scope', '$uibModalInstance', '$filter', '$uibModal', '$log',
    'nvService', 'phieuDieuChuyenNoiBoService', 'mdService', 'clientService', 'configService', 'targetData', 'serviceDieuChuyenAndMerchandise', '$state', 'focus',
function ($scope, $uibModalInstance, $filter, $uibModal, $log,
        nvService, phieuDieuChuyenNoiBoService, mdService, clientService, configService, targetData, serviceDieuChuyenAndMerchandise, $state, focus) {
    $scope.robot = angular.copy(phieuDieuChuyenNoiBoService.robot);
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = nvService.config;
    $scope.tempData = mdService.tempData;
    $scope.data = [];
    $scope.target = targetData;
    $scope.khoXuats = mdService.tempData.wareHouses;
    $scope.khoNhaps = [];

    $scope.addRow = function () {
        if (!$scope.newItem.soLuong || $scope.newItem.soLuong < 1) {
            focus('soluong');
            return;
        }
        if ($scope.newItem.validateCode == $scope.newItem.maHang) {
            $scope.target.dataDetails.push($scope.newItem);
        }
        $scope.pageChanged();
        $scope.newItem = {};
        focus('mahang');
    };
    $scope.addNewItem = function (str) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdMerchandise', 'selectData'),
            controller: 'merchandiseSelectDataController',
            windowClass: 'app-modal-window',
            resolve: {
                serviceSelectData: function () {
                    return serviceDieuChuyenAndMerchandise;
                },
                filterObject: function () {
                    return {
                        summary: strKey
                    };
                }
            }
        });
        modalInstance.result.then(function (updatedData) {
            if (!updatedData.selected) {
                $scope.newItem = updatedData;
                if ($scope.isSameUnitUser) {
                    $scope.newItem.donGia = updatedData.giaBanLeVat;
                } else {
                    $scope.newItem.donGia = updatedData.giaBanBuonVat;
                }
                $scope.newItem.validateCode = updatedData.maHang;
            }
            $scope.pageChanged();
        }, function () {

        });
    }
    $scope.removeItem = function (index) {
        var currentPage = $scope.paged.currentPage;
        var itemsPerPage = $scope.paged.itemsPerPage;
        currentPageIndex = (currentPage - 1) * itemsPerPage + index;
        $scope.target.dataDetails.splice(currentPageIndex, 1);
        $scope.pageChanged();
    }
    $scope.cancel = function () {
        $scope.target.dataDetails.clear();
        $uibModalInstance.dismiss('cancel');
    };
    $scope.title = function () {
        if ($scope.isSameUnitUser) {
            return 'Phiếu xuất chuyển kho';
        }
        else {
            return 'Phiếu xuất siêu thị thành viên';
        }
    };
    $scope.selectedMaHang = function (code) {
        if (code) {
            phieuDieuChuyenNoiBoService.getMerchandiseForNvByCode(code).then(function (response) {

                $scope.newItem = response.data;
                if ($scope.isSameUnitUser) {
                    $scope.newItem.donGia = response.data.giaMuaVat;
                } else {
                    $scope.newItem.donGia = response.data.giaBanBuonVat;
                }

            }, function () {
                $scope.addNewItem(code);
            }
            )
        }
    }
    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    }

    $scope.formatLabelForWareHouseOtherUnit = function (model) {
        if (!model) return "";
        var data = $filter('filter')($scope.khoNhaps, { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    }
    $scope.saveAndPrint = function () {
        phieuDieuChuyenNoiBoService.update($scope.target).then(function (response) {
            if (response.status && response.status == 200) {
                console.log(response);
                clientService.noticeAlert("Thành công", "success");
                var url = $state.href('reportPhieuDieuChuyenNoiBo', { id: response.data.data.id });
                window.open(url, 'Report Viewer');
                $scope.target.dataDetails.clear();
                $uibModalInstance.close($scope.target);
            }
        });
    };
    $scope.sum = function () {
        var total = 0;
        angular.forEach($scope.data, function (value, key) {
            total = total + value.thanhTien;
        });
        $scope.total = total;
    }
    $scope.selectedMaBaoBi = function (model, item) {
        if (!model.soLuongBao) {
            model.soLuongBao = 0;
        }
        if (!model.donGia) {
            model.donGia = 0;
        }
        if (!model.soLuongLe) {
            model.soLuongLe = 0;
        }
        model.luongBao = parseFloat(item.extendValue);
        model.soLuong = model.soLuongBao * model.luongBao + model.soLuongLe;
        model.thanhTien = model.soLuong * model.donGia;
    }
    $scope.save = function () {
        phieuDieuChuyenNoiBoService.update($scope.target).then(
                function (response) {
                    if (response.status && response.status == 200) {
                        if (response.data.status) {
                            console.log('Create  Successfully!');
                            clientService.noticeAlert("Thành công", "success");
                            $scope.target.dataDetails.clear();
                            $uibModalInstance.close($scope.target);
                        } else {
                            clientService.noticeAlert(response.data.message, "danger");
                        }
                    } else {
                        console.log('ERROR: Update failed! ' + response.errorMessage);
                        clientService.noticeAlert(response.errorMessage, "danger");
                    }
                },
                function (response) {
                    console.log('ERROR: Update failed! ' + response);
                });
    };
    $scope.getWareHouseImportByUnit = function () {
        if ($scope.target.maDonViNhan) {
            phieuDieuChuyenNoiBoService.getWareHouseByUnit($scope.target.maDonViNhan, function (response) {
                $scope.khoNhaps = response;
                var data = $filter('filter')($scope.khoNhaps, { value: $scope.target.maKhoNhap }, true);
                if (data && data.length == 1) {
                    $scope.target.maKhoNhapTemp = data[0];
                }
            });
        };
    }
    $scope.isSameUnitUser = true;
    $scope.$watch("target.maDonViNhan", function (newValue, oldValue) {
        var maDonViNhan = $scope.target.maDonViNhan;
        phieuDieuChuyenNoiBoService.getCurrentUser(function (response) {
            var maDonViXuat = response.unitUser.maDonVi;
            if (maDonViNhan == maDonViXuat) {
                $scope.isSameUnitUser = true;
            }
            else {
                $scope.isSameUnitUser = false;
            }
        });
    }, true);

    filterData();
    $scope.createWareHouse = function (target, name) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdWareHouse', 'add'),
            controller: 'wareHouseCreateController',
            resolve: {}
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('wareHouses', function () {
                if (target && name) {
                    target[name] = updatedData.maKho;
                }
            });
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.createMerchandise = function (target, name) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdMerchandise', 'add'),
            controller: 'merchandiseCreateController',
            windowClass: 'app-modal-window',
            resolve: {}
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('merchandises', function () {
                if (target && name) {
                    target[name] = updatedData.maVatTu;
                }
            });

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.createPackage = function (target, name) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdPackaging', 'add'),
            controller: 'packagingCreateController',
            resolve: {}
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('packagings', function () {
                if (target && name) {
                    target[name] = updatedData.maBaoBi;
                    target.luongBao = updatedData.soLuong;
                }
            });
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.createCustomer = function (target, name) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdCustomer', 'add'),
            controller: 'customerCreateController',
            resolve: {}
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('customers', function () {
                if (target && name) {
                    target[name] = updatedData.maKH;
                }
            });
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    function filterData() {
        phieuDieuChuyenNoiBoService.getDetails($scope.target.id, function (response) {
            if (response.status) {
                $scope.target = response.data;
                serviceDieuChuyenAndMerchandise.setSelectData($scope.target.dataDetails);
                $scope.getWareHouseImportByUnit();
                $scope.$watch("target.dataDetails", function (newValue, oldValue) {
                    $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                }, true);
                $scope.pageChanged();
            }
        });
    }
    $scope.pageChanged = function () {
        var currentPage = $scope.paged.currentPage;
        var itemsPerPage = $scope.paged.itemsPerPage;
        $scope.paged.totalItems = $scope.target.dataDetails.length;
        $scope.data = [];
        if ($scope.target.dataDetails) {
            for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < $scope.target.dataDetails.length; i++) {
                $scope.data.push($scope.target.dataDetails[i])
            }
        }
    }

}])
nvModule.controller('reportPhieuDieuChuyenNoiBoController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'phieuDieuChuyenNoiBoService', 'mdService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, phieuDieuChuyenNoiBoService, mdService, clientService) {
    $scope.robot = angular.copy(phieuDieuChuyenNoiBoService.robot);
    var id = $stateParams.id;
    $scope.target = {};
    function filterData() {
        if (id) {
            phieuDieuChuyenNoiBoService.getReport(id, function (response) {
                if (response.status) {
                    console.log(response.data);
                    $scope.target = response.data;
                    $scope.target.tongtien = phieuDieuChuyenNoiBoService.robot.sum($scope.target.dataReportDetails, "thanhTien");
                    $scope.target.tongsoluong = phieuDieuChuyenNoiBoService.robot.sum($scope.target.dataReportDetails, "soLuong");
                    if ($scope.target.maDonViNhan == $scope.target.maDonViXuat) {
                        $scope.isSameUnitUser = true;
                    }
                    else {
                        $scope.isSameUnitUser = false;
                    }
                }
            });
        }
        phieuDieuChuyenNoiBoService.getCurrentUser(function (response) {
            //console.log(response);
            $scope.currentUser = response.username;
            //	console.log($scope.target);

        });
        $scope.checkDuyet = function () {
            console.log($scope.target.trangThai);
            if ($scope.target.trangThai == 10) {
                return false;
            }
            else {
                return true;
            }
        }

    };
    $scope.isSameUnitUser = true;
    $scope.title = function () {
        if ($scope.isSameUnitUser) {
            return 'Phiếu xuất chuyển kho';
        }
        else {
            return 'Phiếu xuất siêu thị thành viên';
        }
    };


    $scope.goIndex = function () {
        $state.go('nvPhieuDieuChuyenNoiBo');
    }

    $scope.print = function () {
        var table = document.getElementById('main-report').innerHTML;
        var myWindow = $window.open('', '', 'width=800, height=600');
        myWindow.document.write(table);
        myWindow.print();
    }

    filterData();
}]);
nvModule.controller('notifiPhieuDieuChuyenNoiBoRecieveController', [
    '$scope', '$uibModal',
    'nvService', 'phieuDieuChuyenNoiBoService', 'mdService', 'clientService', 'configService', 'blockUI',
    function ($scope, $uibModal,
        nvService, phieuDieuChuyenNoiBoService, mdService, clientService, configService, blockUI) {
        $scope.config = nvService.config;
        $scope.count = 0;
        $scope.viewRecieve = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvPhieuDieuChuyenNoiBo', 'recieve'),
                controller: 'phieuDieuChuyenNoiBoRecieveController',
                windowClass: 'app-modal-window',
                resolve: {

                }
            });
        }
    }
]);
nvModule.controller('phieuDieuChuyenNoiBoRecieveController', [
    '$scope', '$uibModal', '$uibModalInstance',
    'nvService', 'phieuDieuChuyenNoiBoService', 'mdService', 'clientService', 'configService', 'blockUI', '$mdDialog',
    function ($scope, $uibModal, $uibModalInstance,
        nvService, phieuDieuChuyenNoiBoService, mdService, clientService, configService, blockUI, $mdDialog) {
        $scope.config = nvService.config;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.isEditable = true;
        $scope.setPage = function (pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };

        $scope.deleteItem = function (ev, item) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Cảnh báo')
                  .textContent('Dữ liệu có thể liên kết với các dữ liệu khác, bạn có chắc muốn xóa?')
                  .ariaLabel('Lucky day')
                  .targetEvent(ev)
                  .ok('Ok')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                phieuDieuChuyenNoiBoService.deleteItem(item).then(function (data) {
                    console.log(data);
                }).then(function (data) {
                    $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Thông báo')
                    .textContent('Xóa thành công')
                    .ariaLabel('Alert')
                    .ok('Ok')
                    .targetEvent(ev))
                        .finally(function () {
                            filterData();
                        });
                });

            }, function () {
                console.log('Không xóa');
            });
        };

        $scope.details = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvPhieuDieuChuyenNoiBo', 'recieveDetails'),
                controller: 'phieuDieuChuyenNoiBoRecieveDetailsController',
                windowClass: 'app-modal-window',
                resolve: {
                    targetData: function () {
                        return target;
                    }
                }
            });
        };

        $scope.sortType = 'ngayCT'; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.doSearch = function () {
            $scope.paged.currentPage = 1;
            filterData();
        };
        $scope.pageChanged = function () {
            filterData();
        };

        $scope.goHome = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.refresh = function () {
            $scope.setPage($scope.paged.currentPage);
        };
        $scope.title = function () {
            return 'Phiếu điều chuyển nội bộ';
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        filterData();
        function filterData() {
            blockUI.start({
                myProperty: '.panel-body'
            });
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            phieuDieuChuyenNoiBoService.postQueryApproval(
                JSON.stringify(postdata),
                function (response) {
                    blockUI.stop();
                    if (response.status) {
                        $scope.data = response.data.data;
                        angular.extend($scope.paged, response.data);
                        console.log($scope.paged);
                    }
                });
        };
    }]);
nvModule.controller('phieuDieuChuyenNoiBoRecieveDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'phieuDieuChuyenNoiBoService', 'targetData', 'clientService', '$filter', 'serviceDieuChuyenAndMerchandise',
function ($scope, $uibModalInstance,
    mdService, phieuDieuChuyenNoiBoService, targetData, clientService, $filter, serviceDieuChuyenAndMerchandise) {
    $scope.robot = angular.copy(phieuDieuChuyenNoiBoService.robot);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Phiếu nhận điều chuyển nội bộ';
    };
    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };
    $scope.khoXuats = [];
    $scope.getWareHouseImportByUnit = function () {
        if ($scope.target.maDonViXuat) {
            phieuDieuChuyenNoiBoService.getWareHouseByUnit($scope.target.maDonViXuat, function (response) {
                $scope.khoXuats = response;
                var data = $filter('filter')($scope.khoXuats, { value: $scope.target.maKhoNhap }, true);
                if (data && data.length == 1) {
                    $scope.target.maKhoXuatTemp = data[0];
                }
            });
        };
    }

    $scope.sum = function () {
        var total = 0;
        angular.forEach($scope.target.dataDetails, function (value, key) {
            total = total + value.thanhTien;
        });
        $scope.total = total;
    }

    $scope.save = function () {
        $scope.isImportDisable = true;
        phieuDieuChuyenNoiBoService.postPostRecieve(
            JSON.stringify($scope.target), function (response) {
                $scope.isImportDisable
                if (response.status) {
                    clientService.noticeAlert("Thành công", "success");
                    $uibModalInstance.close($scope.target);
                } else {
                    clientService.noticeAlert(response.message, "danger");
                }
            }
            ).error(function (response) {
                $scope.isImportDisable
            });
    };
    $scope.formatLabelForWareHouseOtherUnit = function (model) {
        if (!model) return "";
        phieuDieuChuyenNoiBoService.getWareHouseByUnit($scope.target.maDonViXuat, function (response) {
            $scope.khoXuats = response;
        });
        return "Empty!";
    }
    fillterData();
    function fillterData() {

        phieuDieuChuyenNoiBoService.getDetails($scope.target.id, function (response) {

            if (response.status) {

                $scope.target = response.data;
                $scope.getWareHouseImportByUnit();
                serviceDieuChuyenAndMerchandise.setSelectData($scope.target.dataDetails);
                $scope.pageChanged();
            }
        });
    }
    $scope.pageChanged = function () {
        var currentPage = $scope.paged.currentPage;
        var itemsPerPage = $scope.paged.itemsPerPage;
        $scope.paged.totalItems = $scope.target.dataDetails.length;
        $scope.data = [];
        if ($scope.target.dataDetails) {
            for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < $scope.target.dataDetails.length; i++) {
                $scope.data.push($scope.target.dataDetails[i]);
            }
        }
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

nvModule.controller('printPhieuDieuChuyenNoiBoController', ['$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
'mdService', 'phieuDieuChuyenNoiBoService', 'clientService',
function ($scope, $state, $window, $stateParams, $timeout, $filter,
mdService, phieuDieuChuyenNoiBoService, clientService) {
    $scope.robot = phieuDieuChuyenNoiBoService.robot;
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        };
        return "Empty!";
    }
    function filterData() {
        phieuDieuChuyenNoiBoService.postPrint(
            function (response) {
                $scope.printData = response;
            });
    };
    $scope.info = phieuDieuChuyenNoiBoService.getParameterPrint().filtered.advanceData;
    $scope.goIndex = function () {
        $state.go("nvPhieuDieuChuyenNoiBo");
    }
    $scope.printExcel = function () {
        var data = [document.getElementById('dataTable').innerHTML];
        clientService.saveExcel(data, "Danh_sach");
    }
    $scope.sum = function () {
        var total = 0;
        if ($scope.printData) {
            angular.forEach($scope.printData, function (v, k) {
                total = total + v.thanhTienSauVat;
            })
        }
        return total;
    }
    $scope.print = function () {
        var table = document.getElementById('dataTable').innerHTML;
        var myWindow = $window.open('', '', 'width=800, height=600');
        myWindow.document.write(table);
        myWindow.print();
    }
    filterData();
}])
nvModule.controller('printDetailPhieuDieuChuyenNoiBoController', ['$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
'mdService', 'phieuDieuChuyenNoiBoService', 'clientService',
function ($scope, $state, $window, $stateParams, $timeout, $filter,
mdService, phieuDieuChuyenNoiBoService, clientService) {
    $scope.robot = phieuDieuChuyenNoiBoService.robot;
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        };
        return "Empty!";
    }
    $scope.info = phieuDieuChuyenNoiBoService.getParameterPrint().filtered.advanceData;
    $scope.goIndex = function () {
        $state.go("nvPhieuDieuChuyenNoiBo");
    }
    function filterData() {
        phieuDieuChuyenNoiBoService.postPrintDetail(
            function (response) {
                $scope.printData = response;
            });
    }
    $scope.sum = function () {
        var total = 0;
        if ($scope.printData) {
            angular.forEach($scope.printData, function (v, k) {
                total = total + v.thanhTienSauVat;
            })
        }
        return total;
    }
    $scope.printExcel = function () {
        var data = [document.getElementById('dataTable').innerHTML];
        clientService.saveExcel(data, "Danh_sach_chi_tiet");
    }
    $scope.print = function () {
        var table = document.getElementById('dataTable').innerHTML;
        var myWindow = $window.open('', '', 'width=800, height=600');
        myWindow.document.write(table);
        myWindow.print();
    }
    filterData();
}])