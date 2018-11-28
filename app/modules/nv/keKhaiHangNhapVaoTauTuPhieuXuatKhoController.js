﻿var keKhaiHangNhapVaoTauTuPhieuXuatKhoService = nvModule.factory('keKhaiHangNhapVaoTauTuPhieuXuatKhoService',
[
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.apiServiceBaseUri;
        var serviceUrl = rootUrl + '/api/Nv/KeKhaiHangNhapKhoDn/KeKhaiHangNhapVaoTauTuPhieuXuatKho';

        this.parameterPrint = {};

        function getParameterPrint() {
            return this.parameterPrint;
        }

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
            },
            CalculatorThanhTien: function (item) {
                if (!item.soLuong) {
                    item.soLuong = 0;
                }
                if (!item.donGia) {
                    item.donGia = 0;
                }
                item.thanhTien = item.soLuong * item.donGia;
            }
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
            postPrint: function (callback) {
                $http.post(serviceUrl + '/PostPrint', getParameterPrint()).success(callback);
            },
            postPrintDetail: function (callback) {
                $http.post(serviceUrl + '/PostPrintDetail', getParameterPrint()).success(callback);
            },
            getNewInstance: function (callback) {
                $http.get(serviceUrl + '/GetNewInstance').success(callback);
            },
            getReport: function (id, callback) {
                $http.get(serviceUrl + '/GetReport/' + id).success(callback);
            },
            getDetails: function (id, callback) {
                $http.get(serviceUrl + '/GetDetails/' + id).success(callback);
            },
            getWareHouse: function (id, callback) {
                $http.get(rootUrl + '/api/Md/WareHouse/' + id).success(callback);
            },
            getCustomer: function (id, callback) {
                $http.get(rootUrl + '/api/Md/Customer/' + id).success(callback);
            },
            getWareHouseByCode: function (code, callback) {
                $http.get(rootUrl + '/api/Md/WareHouse/GetByCode/' + code).success(callback);
            },
            getSelectDataByDN: function (code, callback) {
                $http.get(rootUrl + '/api/Md/WareHouse/GetSelectDataByDN/' + code).success(callback);
            },

            getOrderById: function (id, callback) {
                $http.get(rootUrl + '/api/Nv/DatHang/GetDetailComplete/' + id).success(callback);
            },
            getOrderByCustomer: function (code, callback) {
                $http.get(rootUrl + '/api/Nv/DatHang/GetSelectDataIsCompleteByCustomerCode/' + code).success(callback);
            },
            getOrder: function (callback) {
                $http.get(rootUrl + '/api/Nv/DatHang/GetSelectDataIsComplete').success(callback);
            },
            postApproval: function (data, callback) {
                $http.post(serviceUrl + '/PostApproval', data).success(callback);
            },
            updateCT: function (params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            getMerchandiseForNvByCode: function (code) {
                return $http.get(rootUrl + '/api/Md/Merchandise/GetForNvByCode/' + code);
            },
            getMerchandise: function (maChungTuPk) {
                return $http.get(rootUrl + '/api/Nv/NhapHangMua/GetMerchandise/' + maChungTuPk);
            },
            getUnitName: function (maDonVi) {
                return $http.get(rootUrl + '/api/Md/UnitUser/GetUnitName/' + maDonVi);
            },
            getCustomerName: function (maHang) {
                return $http.get(rootUrl + '/api/Md/Merchandise/GetByCode/' + maHang);
            },
            getCurrentUser: function (callback) {
                $http.get(rootUrl + '/api/Authorize/User/GetCurrentUser').success(callback);
            },
            writeDataToExcel: function (data, callback) {
                $http.post(serviceUrl + '/WriteDataToExcel', data).success(callback);
            },
            exportReportToExcel: function (data, callback) {
                $http.post(serviceUrl + '/ExportReportToExcel', data).success(callback);
            },
            getDetailByCode: function (code) {
                return $http.get(rootUrl + '/api/Md/Merchandise/GetDetailByCode/' + code);
            },
            getByCode: function (code) {
                return $http.get(rootUrl + '/api/Md/Merchandise/GetByCode/' + code);
            },
            getDetailInTem: function (code) {
                return $http.get(rootUrl + '/api/Md/Merchandise/GetDetailInTem/' + code);
            },
            getInfoItemDetails: function (id, callback) {
                $http.get(serviceUrl + '/GetInfoItemDetails/' + id).success(callback);
            },
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            },
            getHistories: function (data, callback) {
                $http.post(serviceUrl + '/GetHistories', data).success(callback);
            },
            getSelectCompanyByCode: function (id) {
                return $http.get(rootUrl + '/api/Md/Company/GetSelectCompanyByCode/' + id);
            }
        };
        return result;

    }
]);

var keKhaiHangNhapVaoTauTuPhieuXuatKhoController = nvModule.controller('keKhaiHangNhapVaoTauTuPhieuXuatKhoController', [
    '$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
    'keKhaiHangNhapVaoTauTuPhieuXuatKhoService', 'configService', 'clientService', 'nvService', 'mdService', 'blockUI', 'serviceNhapHangAndMerchandise', '$mdDialog', 'localStorageService', 'authorizeService', 'serviceCompanySelected',
    function (
        $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
        keKhaiHangNhapVaoTauTuPhieuXuatKhoService, configService, clientService, nvService, mdService, blockUI, serviceNhapHangAndMerchandise, $mdDialog, localStorageService, authorizeService, serviceCompanySelected
    ) {
        $scope.config = nvService.config;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.permission = authorizeService.permissionModel.permission;

        $scope.isEditable = true;


        $scope.onChangeMaHaiQuan = function (mahq) {
            if (mahq) {
                mahq = mahq.toUpperCase();
                var data = $filter('filter')(mdService.tempData.donViHaiQuans, { value: mahq }, true);
                if (data && data.length > 0) {
                    $scope.filtered.advanceData.maHaiQuan = data[0].value;
                    $scope.filtered.advanceData.idHaiQuan = data[0].id;

                    $scope.lstDoanhnghiep = $scope.tempData.companiesByHQ.filter(function (dn) {
                        return (dn.referenceDataId.indexOf($scope.filtered.advanceData.idHaiQuan) === 0);
                    });
                }
            }

        }
        $scope.tempData = mdService.tempData;
        $scope.filtered.advanceData.denNgay = new Date();
        $scope.selectedCompany = function (code) {
            if (code) {
                keKhaiHangNhapVaoTauTuPhieuXuatKhoService.getSelectCompanyByCode(code).then(function (response) {
                    console.log(response);
                    $scope.data = response.data;
                    $scope.filtered.advanceData.maSoThue = $scope.data.maSoThue;
                    $scope.filtered.advanceData.tenDoanhNghiep = $scope.data.tenDoanhNghiep;
                }, function (error) {
                    $scope.addCompany(code);
                });
            }
        }

        $scope.addCompany = function (str) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('MdCompany', 'selectForMainController'),
                controller: 'companySelectForMainController',
                size: 'lg',
                resolve: {
                    serviceSelectData: function () {
                        return serviceCompanySelected;
                    },
                    filterObject: function () {
                        return {
                            summary: str
                        };
                    }
                }
            });
            modalInstance.result.then(function (updatedData) {

                if (!updatedData.selected) {
                    console.log(updatedData);
                    $scope.filtered.advanceData.maSoThue = updatedData.value;
                    $scope.filtered.advanceData.tenDoanhNghiep = updatedData.description;
                }
            }, function () {

            });
        }


        //load dữ liệu hải quan lên combo tìm kiếm
        function loadDefault() {
            var strKey = '';
            $scope.filtered.advanceData.maHaiQuan = $rootScope.currentUser.maHaiQuan;
            strKey = $scope.filtered.advanceData.maHaiQuan.substring(0, 2);
            if ($rootScope.currentUser.idHaiQuan == 01) {
                $scope.listUnitCustom = mdService.tempData.donViHaiQuans;
            }
            else {
                $scope.listUnitCustom = $filter('filter')(mdService.tempData.donViHaiQuans, { value: strKey });
            }

        }

        loadDefault();

        function filterData() {
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            keKhaiHangNhapVaoTauTuPhieuXuatKhoService.postQuery(
                JSON.stringify(postdata),
                function (response) {

                    $scope.isLoading = false;
                    if (response.status) {
                        $scope.data = response.data.data;
                        angular.extend($scope.paged, response.data);
                    }
                });
        };


        $scope.setPage = function (pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };

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
            $scope.filtered = angular.copy(configService.filterDefault);
            $scope.setPage($scope.paged.currentPage);
        };

        $scope.title = function () {
            return 'Kê khai hàng hóa nhập vào tàu bay từ phiếu xuất kho';
        };

        $scope.displayHelper = function (code, module) {
            if (!code) return "";
            var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
            if (data && data.length == 1) {
                return data[0].description;
            };
            return "Empty!";
        };

        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].description;
            }
            return "Empty!";
        };

        $scope.create = function () {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrlTax('KeKhaiHangNhapKhoDn', 'NvKeKhaiHangNhapVaoTauTuPhieuXuatKho', 'add'),
                controller: 'keKhaiHangNhapVaoTauTuPhieuXuatKhoCreateController',
                windowClass: 'app-modal-window',
                //size: 'lg',
                resolve: {}

            });

            modalInstance.result.then(function (updatedData) {
                serviceNhapHangAndMerchandise.getSelectData().clear();
                $scope.refresh();
            }, function () {
                serviceNhapHangAndMerchandise.getSelectData().clear();
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.details = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrlTax('KeKhaiHangNhapKhoDn', 'NvKeKhaiHangNhapVaoTauTuPhieuXuatKho', 'details'),
                controller: 'keKhaiHangNhapVaoTauTuPhieuXuatKhoDetailsController',
                windowClass: 'app-modal-window',
                //size: 'lg',
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

        $scope.histories = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrlTax('KeKhaiHangNhapKhoDn', 'NvKeKhaiHangNhapVaoTauTuPhieuXuatKho', 'histories'),
                controller: 'keKhaiHangNhapVaoTauTuPhieuXuatKhoHistoryController',
                windowClass: 'app-modal-window',
                //size: 'lg',
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

        $scope.printITem = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrlTax('KeKhaiHangXuatKhoDn', 'NvKeKhaiHangNhapVaoTauTuPhieuXuatKho', 'printItem'),
                controller: 'keKhaiHangNhapVaoTauTuPhieuXuatKhoExportItemController',
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

        $scope.printPopup = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrlTax('KeKhaiHangNhapKhoDn', 'NvKeKhaiHangNhapVaoTauTuPhieuXuatKho', 'report'),
                controller: 'reportkeKhaiHangNhapVaoTauTuPhieuXuatKhoController',
                size: 'lg',
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

        $scope.sum = function () {
            var total = 0;
            if ($scope.data) {
                angular.forEach($scope.data, function (v, k) {
                    total = total + v.thanhTienSauVat;
                });
            }
            return total;
        }
        $scope.update = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrlTax('KeKhaiHangNhapKhoDn', 'NvKeKhaiHangNhapVaoTauTuPhieuXuatKho', 'update'),
                controller: 'keKhaiHangNhapVaoTauTuPhieuXuatKhoEditController',
                windowClass: 'app-modal-window',
                //size:'lg',
                resolve: {
                    targetData: function () {
                        return target;
                    }
                }
            });
            modalInstance.result.then(function (updatedData) {
                serviceNhapHangAndMerchandise.getSelectData().clear();
                $scope.refresh();
            }, function () {
                serviceNhapHangAndMerchandise.getSelectData().clear();
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.print = function () {
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            console.log('Print', postdata);
            keKhaiHangNhapVaoTauTuPhieuXuatKhoService.setParameterPrint(
                postdata);
            $state.go("nvPrintkeKhaiHangNhapVaoTauTuPhieuXuatKho");
        }

        $scope.printDetail = function () {

            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            keKhaiHangNhapVaoTauTuPhieuXuatKhoService.setParameterPrint(
                postdata);
            $state.go("nvPrintDetailkeKhaiHangNhapVaoTauTuPhieuXuatKho");
        }

        //delete
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
                keKhaiHangNhapVaoTauTuPhieuXuatKhoService.deleteItem(item).then(function (data) {
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
                            //  $scope.tempData.update('khoanMucs');
                            filterData();
                        });
                });

            }, function () {
                console.log('Không xóa');
            });
        };

        $scope.import = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrlTax('KeKhaiHangXuatKhoDn', 'NvKeKhaiHangNhapVaoTauTuPhieuXuatKho', 'import'),
                controller: 'keKhaiHangNhapVaoTauTuPhieuXuatKhoImportController',
                size: 'md'
            });
            modalInstance.result.then(function (updatedData) {
                serviceNhapHangAndMerchandise.getSelectData().clear();
                $scope.refresh();
            }, function () {
                serviceNhapHangAndMerchandise.getSelectData().clear();
                $scope.refresh();
                $log.info('Modal dismissed at: ' + new Date());
            });
        }


    }
]);


nvModule.controller('keKhaiHangNhapVaoTauTuPhieuXuatKhoDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'keKhaiHangNhapVaoTauTuPhieuXuatKhoService', 'targetData', 'clientService', 'configService', '$filter',
function ($scope, $uibModalInstance,
    mdService, keKhaiHangNhapVaoTauTuPhieuXuatKhoService, targetData, clientService, configService, $filter) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Phiếu kê khai hàng hóa nhập vào tàu bay từ phiếu xuất kho';
    };


    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
        if (data && data.length == 1) {
            return data[0].value;
        }
        return "Empty!";
    };

    $scope.displayHelper = function (model, module) {

        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].value;
        }
        return "Empty!";
    };
    $scope.nameCurrency = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
    };
    $scope.approval = function () {
        keKhaiHangNhapVaoTauTuPhieuXuatKhoService.postApproval($scope.target, function (response) {
            if (response) {
                alert("Duyệt thành công!");
                $uibModalInstance.close($scope.target);
                $scope.goIndex = function () {
                    $state.go('nvKeKhaiHangNhapVaoBayTuPhieuXuatKho');
                };

            }
            else { alert("Thất bại! - Xảy ra lỗi hoặc phiếu này đã duyệt"); }
        });
    };

    function fillterData() {
        $scope.isLoading = true;
        keKhaiHangNhapVaoTauTuPhieuXuatKhoService.getDetails($scope.target.id, function (response) {
            console.log(response);
            if (response.status) {
                $scope.target = response.data;
            }
            $scope.isLoading = false;
            $scope.pageChanged();

            var data = $filter('filter')($scope.tempData.companies, { id: $scope.target.maDoanhNghiep }, true);
            var dataCustom = $filter('filter')($scope.tempData.donViHaiQuans, { value: $scope.target.maHaiQuan }, true);
            var dataWarehouse = $filter('filter')($scope.tempData.wareHouses, { value: $scope.target.maKhoNhap }, true);
            if (data && dataCustom && dataWarehouse) {
                $scope.target.tenDoanhNghiep = data[0].description;
                $scope.target.tenHaiQuan = dataCustom[0].description;
                $scope.target.tenKhoNhap = dataWarehouse[0].description;
            }
        });
    }
    fillterData();

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.pageChanged = function () {
        var currentPage = $scope.paged.currentPage;
        var itemsPerPage = $scope.paged.itemsPerPage;
        $scope.paged.totalItems = $scope.target.dataDetails.length;
        $scope.data = [];
        if ($scope.target.dataDetails) {
            for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < $scope.target.dataDetails.length; i++) {
                $scope.target.dataDetails[i].thanhTienVAT = $scope.target.dataDetails[i].thanhTien * (1 + $scope.target.dataDetails[i].tyLeVatVao / 100);
                $scope.target.dataDetails[i].giaMuaCoVat = $scope.target.dataDetails[i].giaMua * (1 + $scope.target.dataDetails[i].tyLeVatVao / 100);
                $scope.data.push($scope.target.dataDetails[i]);
            }
        }
    }

}
]);

nvModule.controller('keKhaiHangNhapVaoTauTuPhieuXuatKhoHistoryController', [
'$scope', '$uibModalInstance',
'mdService', 'keKhaiHangNhapVaoTauTuPhieuXuatKhoService', 'targetData', 'clientService', 'configService', '$filter',
function ($scope, $uibModalInstance,
    mdService, keKhaiHangNhapVaoTauTuPhieuXuatKhoService, targetData, clientService, configService, $filter) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Phiếu kê khai hàng hóa nhập vào tàu bay từ phiếu xuất kho';
    };


    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
        if (data && data.length == 1) {
            return data[0].value;
        }
        return "Empty!";
    };

    $scope.displayHelper = function (model, module) {

        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].value;
        }
        return "Empty!";
    };
    $scope.nameCurrency = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
    };

    var choiceObj = angular.copy(configService.choiceObj);

    function fillterData() {
        $scope.isLoading = true;
        choiceObj.id = $scope.target.maHoaDon;
        choiceObj.value = $scope.target.loaiPhieu;
        choiceObj.extendValue = $scope.target.maSoThue;
        keKhaiHangNhapVaoTauTuPhieuXuatKhoService.getHistories(choiceObj, function (response) {
            if (response.status) {
                $scope.dataHistory = response.extData;
                if ($scope.dataHistory.length > 0) {
                    angular.forEach($scope.dataHistory, function (v, k) {
                        v.timeUpdate = "Sửa lần " + ($scope.dataHistory.length - k) + "";
                    });
                } else {
                    $scope.warning = "Không có dữ liệu lịch sử nào";
                }
            }
            $scope.isLoading = false;
            $scope.pageChanged();
        });
    }


    fillterData();


    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
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
}
]);

nvModule.controller('keKhaiHangNhapVaoTauTuPhieuXuatKhoCreateController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log', '$rootScope',
    'nvService', 'keKhaiHangNhapVaoTauTuPhieuXuatKhoService', 'mdService', 'configService', 'serviceNhapHangAndMerchandise', 'focus', '$resource',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log, $rootScope,
        nvService, keKhaiHangNhapVaoTauTuPhieuXuatKhoService, mdService, configService, serviceNhapHangAndMerchandise, focus, $resource) {
        var rootUrl = configService.apiServiceBaseUri;

        $scope.robot = angular.copy(keKhaiHangNhapVaoTauTuPhieuXuatKhoService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.newItem = {};
        $scope.donHangs = [];
        $scope.target = { dataDetails: [], dataClauseDetails: [] };


        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
            if (data && data.length == 1) {
                return data[0].value;
            }
            return "Empty!";
        };
        $scope.nameCurrency = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
        };
        $scope.displayHelper = function (model, module) {

            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].value;
            }
            return "Empty!";
        };

        $scope.tyGia = 0;
        $scope.isListItemNull = true;
        $scope.addRow = function () {
            if (!$scope.newItem.soLuong || $scope.newItem.soLuong < 1) {
                focus('soluong');
                return;
            }
            if ($scope.newItem.validateCode == $scope.newItem.maHang) {
                $scope.target.dataDetails.push($scope.newItem);
                $scope.isListItemNull = false;
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
                        return serviceNhapHangAndMerchandise;
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
                    $scope.newItem.maHang = $scope.newItem.maVatTu;
                    $scope.newItem.validateCode = $scope.newItem.maVatTu;
                    console.log($scope.newItem);
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
            if ($scope.target.dataDetails.length == 0) {
                $scope.isListItemNull = true;
            }
            $scope.pageChanged();
        };

        $scope.cancel = function () {
            $scope.target.dataDetails.clear();
            $scope.isListItemNull = true;
            $uibModalInstance.dismiss('cancel');
        };

        $scope.title = function () {
            return 'Phiếu kê khai hàng hóa nhập vào tàu bay từ phiếu xuất kho';
        };

        $scope.selectedkhachHang = function (item) {
            $scope.target.maKhachHang = item.value;
            keKhaiHangNhapVaoTauTuPhieuXuatKhoService.getOrderByCustomer(item.value, function (response) {
                $scope.donHangs = response;
            });
            keKhaiHangNhapVaoTauTuPhieuXuatKhoService.getCustomer(item.id, function (response) {
                $scope.target.maSoThue = response.maSoThue;
            });
        };

        $scope.selectedDonDatHang = function (item) {
            $scope.isLoading = true;
            keKhaiHangNhapVaoTauTuPhieuXuatKhoService.getOrderById(item.id, function (response) {
                var donHang = response.data;
                $scope.target.dataDetails.clear();
                angular.forEach(donHang.dataDetails, function (v, k) {
                    $scope.target.dataDetails.push(v);
                });
                $scope.isLoading = false;
                $scope.pageChanged();

            });
        };

        $scope.selectedMaHang = function (code) {
            if (code) {
                keKhaiHangNhapVaoTauTuPhieuXuatKhoService.getMerchandiseForNvByCode(code).then(function (response) {
                    $scope.newItem = response.data;
                    $scope.newItem.maHang = $scope.newItem.maVatTu;
                    $scope.newItem.validateCode = response.data.maVatTu;
                }, function (error) {
                    $scope.addNewItem(code);
                }
                );
            }
        };

        $scope.selectedCuaHang = function (item) {
            $scope.target.tenCuaHang = item.text;
        };

        $scope.selectedKhoXuat = function (item) {
            $scope.target.tenKhoXuat = item.text;
        };

        $scope.selectedKhoNhap = function (item) {
            $scope.target.tenKhoNhap = item.description;
        };

        $scope.selectedDoanhNghiep = function (item) {
            $scope.target.tenDoanhNghiep = item.text;
            $scope.tempData.mdn = item.value;
            $scope.tempData.update('khoNhans');
            $scope.tempData.update('unitUserNhans');
            $scope.target.maHaiQuan = item.parent;
            var data = $filter('filter')(mdService.tempData.donViHaiQuans, { value: item.parent }, true);
            if (data && data.length == 1) {
                $scope.target.tenHaiQuan = data[0].text;
            }
        };

        $scope.selectedHaiQuan = function (item) {
            $scope.target.tenHaiQuan = item.text;
        };



        $scope.save = function () {
            $scope.Loading = true;
            keKhaiHangNhapVaoTauTuPhieuXuatKhoService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        $scope.target.dataDetails.clear();
                        $scope.isListItemNull = true;
                        $uibModalInstance.close($scope.target);
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                    $scope.Loading = false;
                }
                );
        };

        function filterData() {
            $scope.isLoading = true;
            keKhaiHangNhapVaoTauTuPhieuXuatKhoService.getNewInstance(function (response) {

                $scope.target = response;
                $scope.target.dataDetails = serviceNhapHangAndMerchandise.getSelectData();
                $scope.pageChanged();
                $scope.isLoading = false;


                $scope.$watch("target.dataDetails", function (newValue, oldValue) {
                    if (!$scope.target.tienChietKhau) {
                        $scope.target.tienChietKhau = 0;
                    }
                    $scope.target.thanhTienTruocVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                    $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                }, true);

                $scope.target.idHaiQuan = $rootScope.currentUser.idHaiQuan;
                $scope.target.maHaiQuan = $rootScope.currentUser.maHaiQuan;
                $scope.target.maSoThue = $rootScope.currentUser.maSoThue;
                $scope.target.maDoanhNghiep = $rootScope.currentUser.maDoanhNghiep;

                var data = $filter('filter')($scope.tempData.companies, { id: $scope.target.maDoanhNghiep }, true);
                if (data && data.length > 0) {
                    $scope.target.tenDoanhNghiep = data[0].description;
                }
            });

        };
        $scope.createStore = function (target, name) {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('MdUnitUser', 'add'),
                controller: 'unitUserCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('unitUsers', function () {
                    if (target && name) {
                        target[name] = updatedData.maDonVi;
                    }
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
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
        filterData();
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
    }
]);

nvModule.controller('keKhaiHangNhapVaoTauTuPhieuXuatKhoEditController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log',
    'nvService', 'keKhaiHangNhapVaoTauTuPhieuXuatKhoService', 'mdService', 'targetData', 'configService', 'serviceNhapHangAndMerchandise', 'focus',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log,
        nvService, keKhaiHangNhapVaoTauTuPhieuXuatKhoService, mdService, targetData, configService, serviceNhapHangAndMerchandise, focus) {
        $scope.robot = angular.copy(keKhaiHangNhapVaoTauTuPhieuXuatKhoService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.target = targetData;
        $scope.newItem = {};

        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
            if (data && data.length == 1) {
                return data[0].value;
            }
            return "Empty!";
        };
        $scope.nameCurrency = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
        };
        $scope.displayHelper = function (model, module) {

            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].value;
            }
            return "Empty!";
        };


        $scope.tyGia = 0;
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
                        return serviceNhapHangAndMerchandise;
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
                    $scope.newItem.maHang = $scope.newItem.maVatTu;
                    $scope.newItem.validateCode = $scope.newItem.maVatTu;
                }
            }, function () {

            });
        };

        $scope.removeItem = function (index) {
            var currentPage = $scope.paged.currentPage;
            var itemsPerPage = $scope.paged.itemsPerPage;
            currentPageIndex = (currentPage - 1) * itemsPerPage + index;
            $scope.target.dataDetails.splice(currentPageIndex, 1);
            $scope.pageChanged();
        };

        $scope.cancel = function () {
            $scope.target.dataDetails.clear();
            $uibModalInstance.dismiss('cancel');
        };

        $scope.title = function () {
            return 'Phiếu kê khai hàng hóa nhập vào tàu bay từ phiếu xuất kho';
        };

        $scope.selectedKhoNhap = function (item) {
            $scope.target.tenKhoNhap = item.description;
        };


        $scope.selectedMaHang = function (code) {
            if (code) {
                keKhaiHangNhapVaoTauTuPhieuXuatKhoService.getMerchandiseForNvByCode(code).then(function (response) {
                    $scope.newItem = response.data;
                    $scope.newItem.maHang = $scope.newItem.maVatTu;
                    $scope.newItem.validateCode = response.data.maVatTu;
                }, function (error) {
                    $scope.addNewItem(code);
                }
                );
            }
        };


        $scope.save = function () {
            keKhaiHangNhapVaoTauTuPhieuXuatKhoService.updateCT($scope.target).then(
                    function (response) {
                        if (response.status && response.status == 200) {
                            if (response.data.status) {
                                clientService.noticeAlert("Thành công", "success");
                                $scope.target.dataDetails.clear();
                                $uibModalInstance.close($scope.target);
                            } else {
                                clientService.noticeAlert(response.message, "danger");
                            }
                        } else {
                            console.log('ERROR: Update failed! ' + response.errorMessage);
                            clientService.noticeAlert(response.errorMessage, "danger");
                        }
                    },
                    function (response) {
                        console.log('ERROR: Update failed! ' + response);
                    }
                );
        };

        function filterData() {
            keKhaiHangNhapVaoTauTuPhieuXuatKhoService.getDetails($scope.target.id, function (response) {
                if (response.data.id) {
                    $scope.target = response.data;
                    serviceNhapHangAndMerchandise.setSelectData($scope.target.dataDetails);
                    $scope.pageChanged();
                    $scope.$watch("target.dataDetails", function (newValue, oldValue) {
                        if (!$scope.target.tienChietKhau) {
                            $scope.target.tienChietKhau = 0;
                        }
                        $scope.target.thanhTienTruocVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                        $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                    }, true);
                };

                var data = $filter('filter')($scope.tempData.companies, { id: $scope.target.maDoanhNghiep }, true);
                var dataCustom = $filter('filter')($scope.tempData.donViHaiQuans, { value: $scope.target.maHaiQuan }, true);
                var dataWarehouse = $filter('filter')($scope.tempData.wareHouses, { value: $scope.target.maKhoNhap }, true);
                if (data && dataCustom && dataWarehouse) {
                    $scope.target.tenDoanhNghiep = data[0].description;
                    $scope.target.tenHaiQuan = dataCustom[0].description;
                    $scope.target.tenKhoNhap = dataWarehouse[0].description;
                }
            });

        };
        $scope.createStore = function (target, name) {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('MdUnitUser', 'add'),
                controller: 'unitUserCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('unitUsers', function () {
                    if (target && name) {
                        target[name] = updatedData.maDonVi;
                    }
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
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
        filterData();
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
    }
]);

nvModule.controller('reportkeKhaiHangNhapVaoTauTuPhieuXuatKhoController', [
    '$scope', '$filter', '$window', '$stateParams', '$timeout', '$state', '$uibModalInstance', 'targetData', '$rootScope',
    'mdService', 'keKhaiHangNhapVaoTauTuPhieuXuatKhoService', 'clientService',
    function ($scope, $filter, $window, $stateParams, $timeout, $state, $uibModalInstance, targetData, $rootScope,
        mdService, keKhaiHangNhapVaoTauTuPhieuXuatKhoService, clientService) {
        $scope.robot = angular.copy(keKhaiHangNhapVaoTauTuPhieuXuatKhoService.robot);
        var id = $stateParams.id;
        $scope.target = {};


        $scope.nameOfObject = function (model, module) {
            if (!model) return "";

            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].description;
            }
        };


        function filterData() {
            if (targetData.id) {
                keKhaiHangNhapVaoTauTuPhieuXuatKhoService.getReport(targetData.id, function (response) {

                    if (response.status) {
                        $scope.target = response.data;
                    }
                    $scope.objUser = $rootScope.currentUser;
                    var data1 = $filter('filter')(mdService.tempData.donViHaiQuans, { id: $scope.objUser.idHaiQuan }, true);
                    if (data1) {
                        var dataCustom = $filter('filter')(mdService.tempData.donViHaiQuans, { value: data1[0].extendValue }, true);
                        if (dataCustom.length > 0) {
                            $scope.nameOfCustom = dataCustom[0].description;
                        }
                    };
                });
            }
        };

        $scope.checkDuyet = function () {
            console.log($scope.target.trangThai);
            if ($scope.target.trangThai == 10) {
                return false;
            }
            else {
                return true;
            }
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };



        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
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
        $scope.printExcel = function () {
            var data = [document.getElementById('main-report').innerHTML];
            var fileName = "KeKhaiHangNhapVaoTauBayTuPhieuXuatKho_ExportData.xls";
            var filetype = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8";
            var ieEDGE = navigator.userAgent.match(/Edge/g);
            var ie = navigator.userAgent.match(/.NET/g); // IE 11+
            var oldIE = navigator.userAgent.match(/MSIE/g);
            if (ie || oldIE || ieEDGE) {
                var blob = new window.Blob(data, { type: filetype });
                window.navigator.msSaveBlob(blob, fileName);
            }
            else {
                var a = $("<a style='display: none;'/>");
                var url = window.webkitURL.createObjectURL(new Blob(data, { type: filetype }));
                a.attr("href", url);
                a.attr("download", fileName);
                $("body").append(a);
                a[0].click();
                window.url.revokeObjectURL(url);
                a.remove();
            }

            //      var uri = 'data:application/vnd.ms-excel;base64,'
            //, template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
            //, base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
            //, format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }

            //      var source = document.getElementById("main-report");
            //      var filters = $('.ng-table-filters').remove();
            //      $('.ng-table-sort-header').after(filters);
            //      var ctx = { worksheet: name || 'Sheet 1', table: source.innerHTML };
            //      var url = uri + base64(format(template, ctx));
            //      var a = document.createElement('a');
            //      a.href = url;
            //      a.download = 'NhapHangMua_ExportData.xls';
            //      a.click();
        }
        filterData();
    }
]);

nvModule.controller('printkeKhaiHangNhapVaoTauTuPhieuXuatKhoController', [
    '$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
    'mdService', 'keKhaiHangNhapVaoTauTuPhieuXuatKhoService', 'clientService',
    function ($scope, $state, $window, $stateParams, $timeout, $filter,
        mdService, keKhaiHangNhapVaoTauTuPhieuXuatKhoService, clientService) {
        $scope.robot = angular.copy(keKhaiHangNhapVaoTauTuPhieuXuatKhoService.robot);
        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
            if (data && data.length == 1) {
                return data[0].text;
            };
            return "Empty!";
        }

        function filterData() {
            keKhaiHangNhapVaoTauTuPhieuXuatKhoService.postPrint(
                function (response) {
                    $scope.printData = response;
                });
        };

        $scope.info = keKhaiHangNhapVaoTauTuPhieuXuatKhoService.getParameterPrint().filtered.advanceData;
        $scope.goIndex = function () {
            $state.go("nvKeKhaiHangNhapVaoBayTuPhieuXuatKho");
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
    }
]);

nvModule.controller('printDetailkeKhaiHangNhapVaoTauTuPhieuXuatKhoController', [
    '$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
    'mdService', 'keKhaiHangNhapVaoTauTuPhieuXuatKhoService', 'clientService',
    function ($scope, $state, $window, $stateParams, $timeout, $filter,
        mdService, keKhaiHangNhapVaoTauTuPhieuXuatKhoService, clientService) {
        $scope.robot = angular.copy(keKhaiHangNhapVaoTauTuPhieuXuatKhoService.robot);
        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
            if (data && data.length == 1) {
                return data[0].text;
            };
            return "Empty!";
        }
        $scope.info = keKhaiHangNhapVaoTauTuPhieuXuatKhoService.getParameterPrint().filtered.advanceData;
        $scope.goIndex = function () {
            $state.go("nvKeKhaiHangNhapVaoBayTuPhieuXuatKho");
        }

        function filterData() {
            keKhaiHangNhapVaoTauTuPhieuXuatKhoService.postPrintDetail(
                function (response) {
                    $scope.printData = response;
                });
        }

        $scope.sum = function () {
            var total = 0;
            if ($scope.printData) {
                angular.forEach($scope.printData, function (v, k) {
                    total = total + v.thanhTienSauVat;
                });
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
    }
]);

nvModule.controller('keKhaiHangNhapVaoTauTuPhieuXuatKhoExportItemController', [
    '$scope', '$filter', '$window', '$stateParams', '$timeout', '$state',
    'mdService', 'keKhaiHangNhapVaoTauTuPhieuXuatKhoService', 'clientService', '$uibModalInstance', 'targetData', 'Excel', 'configService', '$location',
    function ($scope, $filter, $window, $stateParams, $timeout, $state,
        mdService, keKhaiHangNhapVaoTauTuPhieuXuatKhoService, clientService, $uibModalInstance, targetData, Excel, configService, $location) {
        $scope.config = mdService.config;
        $scope.title = function () {
            return 'Danh sách hàng xuất';
        };
        $scope.lstMerchandise = [];
        $scope.dataHangHoa = {};
        $scope.hrefTem = configService.apiServiceBaseUri + "/Upload/Barcode/Barcode.xls";

        $scope.target = targetData;
        $scope.maChungTuPk = targetData.maChungTuPk;
        var index = $scope.maChungTuPk.indexOf('.');
        $scope.maDonVi = $scope.maChungTuPk.substr(0, index);
        keKhaiHangNhapVaoTauTuPhieuXuatKhoService.getUnitName($scope.maDonVi).then(function (response) {
            $scope.tenDonVi = response.data;
        });
        keKhaiHangNhapVaoTauTuPhieuXuatKhoService.getInfoItemDetails($scope.target.id, function (response) {
            console.log(response);
            if (response.status) {
                $scope.dataHangHoa = response.data;
                $scope.lstMerchandise = response.data.dataDetails;
            }
            $scope.isLoading = false;

        });


        $scope.exportToExcel = function () {
            keKhaiHangNhapVaoTauTuPhieuXuatKhoService.writeDataToExcel($scope.dataHangHoa, function (response) {
                if (response.status) {
                    clientService.noticeAlert("Thành công", "success");
                    //  $uibModalInstance.close($scope.target);
                }
                else {
                    clientService.noticeAlert("Thành công", "success");

                }

            });
        }


        $scope.goIndex = function () {
            $state.go('nvKeKhaiHangNhapVaoBayTuPhieuXuatKho');
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);