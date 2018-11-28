var phieuNhapHangBanTraLaiService = nvModule.factory('phieuNhapHangBanTraLaiService',
[
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.apiServiceBaseUri;
        var serviceUrl = rootUrl + '/api/Nv/NhapHangBanTraLai';

        this.parameterPrint = {};

        function getParameterPrint() {
            return this.parameterPrint;
        }

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
            sumVat: function (tyGia, target) {
                var tienVat = 0;
                if (tyGia) {
                    tienVat = (target.thanhTienTruocVat * tyGia) / 100;
                }
                return tienVat;
            },

            changeDonGia: function (item) {

                if (!item.soLuong) {
                    item.soLuong = 0;
                }
                item.thanhTien = item.soLuong * item.donGia;
            },
            changeSoLuong: function (item) {
                if (!item.donGia) {
                    item.donGia = 0;
                }
                item.thanhTien = item.soLuong * item.donGia;

            },


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
            getCurrentUser: function (callback) {
                $http.get(rootUrl + '/api/Authorize/User/GetCurrentUser').success(callback);
            },
            getWareHouseByCode: function (code, callback) {
                $http.get(rootUrl + '/api/Md/WareHouse/GetByCode/' + code).success(callback);
            },
            postApproval: function (id, callback) {
                $http.post(serviceUrl + '/PostApproval', id).success(callback);
            },
            updateCT: function (params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            getProductCost: function (id, callback) {
                $http.get(serviceUrl + '/ProductCost/' + id).success(callback);
            },
            getMerchandiseForNvByCode: function (code) {
                return $http.get(rootUrl + '/api/Md/Merchandise/GetForNvByCode/' + code);
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

var phieuNhapHangBanTraLaiController = nvModule.controller('phieuNhapHangBanTraLaiController', [
    '$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
    'phieuNhapHangBanTraLaiService', 'configService', 'clientService', 'nvService', 'mdService', 'blockUI', 'serviceBanHangTraLaiAndMerchandise', '$mdDialog', 'localStorageService', 'authorizeService', 'serviceCompanySelected', function (
        $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
        phieuNhapHangBanTraLaiService, configService, clientService, nvService, mdService, blockUI, serviceBanHangTraLaiAndMerchandise, $mdDialog, localStorageService, authorizeService, serviceCompanySelected) {
        $scope.robot = angular.copy(phieuNhapHangBanTraLaiService.robot);
        $scope.config = nvService.config;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.filtered.isAdvance = true;
        $scope.permission = authorizeService.permissionModel.permission;
        $scope.tempData = mdService.tempData;
        $scope.lstDoanhnghiep = angular.copy($scope.tempData.companiesByHQ);
        $scope.isEditable = true;
        $scope.filtered.advanceData.denNgay = new Date();
        $scope.selectedCompany = function (code) {
            if (code) {
                phieuNhapHangBanTraLaiService.getSelectCompanyByCode(code).then(function (response) {
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
            $scope.filtered.advanceData.idHaiQuan = $rootScope.currentUser.idHaiQuan;
            strKey = $scope.filtered.advanceData.maHaiQuan.substring(0, 2);
            if ($rootScope.currentUser.idHaiQuan == 01) {
                $scope.listUnitCustom = mdService.tempData.donViHaiQuans;
            }
            else {
                $scope.listUnitCustom = $filter('filter')(mdService.tempData.donViHaiQuans, { value: strKey });
            }

        }

        loadDefault();

        $scope.setPage = function (pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };
        $scope.sortType = 'ngayCT'; // set the default sort type
        $scope.sortReverse = false; // set the default sort order
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
            return 'Kê khai hàng hóa nhập trả lại từ khách hàng';
        };
        $scope.displayHelper = function (code, module) {
            if (!code) return "";
            var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
            if (data && data.length == 1) {
                return data[0].description;
            };
            return "Empty!";
        }
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].description;
            }
            return "Empty!";
        };

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
                phieuNhapHangBanTraLaiService.deleteItem(item).then(function (data) {
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

        $scope.create = function () {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvPhieuNhapHangBanTraLai', 'add'),
                controller: 'phieuNhapHangBanTraLaiCreateController',
                windowClass: 'app-modal-window',
                resolve: {}

            });

            modalInstance.result.then(function (updatedData) {
                serviceBanHangTraLaiAndMerchandise.getSelectData().clear();
                $scope.refresh();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.details = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvPhieuNhapHangBanTraLai', 'details'),
                controller: 'phieuNhapHangBanTraLaiDetailsController',
                windowClass: 'app-modal-window',
                resolve: {
                    targetData: function () {
                        return target;
                    }
                }
            });
        };


        $scope.printPopup = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvPhieuNhapHangBanTraLai', 'report'),
                controller: 'reportPhieuNhapHangBanTraLaiController',
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

        $scope.histories = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvPhieuNhapHangBanTraLai', 'histories'),
                controller: 'phieuNhapHangBanTraLaiHistoryController',
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

        $scope.update = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvPhieuNhapHangBanTraLai', 'update'),
                controller: 'phieuNhapHangBanTraLaiEditController',
                windowClass: 'app-modal-window',
                resolve: {
                    targetData: function () {
                        return target;
                    }
                }
            });

            modalInstance.result.then(function (updatedData) {
                serviceBanHangTraLaiAndMerchandise.getSelectData().clear();
                $scope.refresh();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.print = function () {
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            phieuNhapHangBanTraLaiService.setParameterPrint(
                postdata);
            $state.go("printPhieuNhapHangBanTraLai");
        }
        $scope.printDetail = function () {

            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            phieuNhapHangBanTraLaiService.setParameterPrint(
                postdata);
            $state.go("printDetailPhieuNhapHangBanTraLai");
        }

        function filterData() {
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            phieuNhapHangBanTraLaiService.postQuery(
                JSON.stringify(postdata),
                function (response) {
                    $scope.isLoading = false;
                    if (response.status) {
                        $scope.data = response.data.data;
                        angular.extend($scope.paged, response.data);
                        console.log($scope.paged);
                    }
                });
        };
    }
]);

nvModule.controller('phieuNhapHangBanTraLaiDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'phieuNhapHangBanTraLaiService', 'targetData', 'clientService', 'configService', '$filter',
function ($scope, $uibModalInstance,
    mdService, phieuNhapHangBanTraLaiService, targetData, clientService, configService, $filter) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Kê khai hàng hóa nhập trả lại từ khách hàng';
    };
    fillterData();

    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
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
        phieuNhapHangBanTraLaiService.postApproval($scope.target, function (response) {
            if (response) {
                alert("Duyệt thành công!");
                fillterData();
            }
            else { alert("Thất bại! - Xảy ra lỗi hoặc phiếu này đã duyệt"); }
        });
    };

    function fillterData() {
        $scope.isLoading = true;
        phieuNhapHangBanTraLaiService.getDetails($scope.target.id, function (response) {
            if (response.status) {
                $scope.target = response.data;
                var data = $filter('filter')(mdService.tempData.customers, { value: $scope.target.hoChieuCmNd }, true);
                if (data && data.length > 0) {
                    $scope.target.tenKhachHang = data[0].text;
                }
            }
            $scope.isLoading = false;
            $scope.pageChanged();
        });
    }

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

nvModule.controller('phieuNhapHangBanTraLaiHistoryController', [
'$scope', '$uibModalInstance',
'mdService', 'phieuNhapHangBanTraLaiService', 'targetData', 'clientService', 'configService', '$filter',
function ($scope, $uibModalInstance,
    mdService, phieuNhapHangBanTraLaiService, targetData, clientService, configService, $filter) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Phiếu kê khai hàng hóa nhập trả lại từ khách hàng';
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
        phieuNhapHangBanTraLaiService.getHistories(choiceObj, function (response) {
            if (response.status) {
                $scope.dataHistory = response.extData;

                if ($scope.dataHistory.length > 0) {
                    angular.forEach($scope.dataHistory, function (v, k) {
                        var data = $filter('filter')(mdService.tempData.customers, { value: v.hoChieuCmNd }, true);
                        if (data && data.length > 0) {
                            v.tenKhachHang = data[0].text;
                        }
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

nvModule.controller('phieuNhapHangBanTraLaiCreateController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log',
    'nvService', 'phieuNhapHangBanTraLaiService', 'mdService', 'configService', 'serviceBanHangTraLaiAndMerchandise', 'focus',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log,
        nvService, phieuNhapHangBanTraLaiService, mdService, configService, serviceBanHangTraLaiAndMerchandise, focus) {
        $scope.robot = angular.copy(phieuNhapHangBanTraLaiService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;

        $scope.target = { dataDetails: [], dataClauseDetails: [] };
        $scope.newItem = {};

        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };


        $scope.target.thanhTienSauVat = 0;


        $scope.nameCurrency = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
        };
        $scope.cancel = function () {
            $scope.target.dataDetails.clear();
            $uibModalInstance.dismiss('cancel');
        };
        $scope.title = function () {
            return 'Phiếu nhập hàng bán trả lại';
        };
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
                        return serviceBanHangTraLaiAndMerchandise;
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


        $scope.selectedMaHang = function (code) {
            if (code) {
                phieuNhapHangBanTraLaiService.getMerchandiseForNvByCode(code).then(function (response) {

                    $scope.newItem = response.data;
                    $scope.newItem.maHang = $scope.newItem.maVatTu;
                    $scope.newItem.validateCode = response.data.maVatTu;
                }, function () {
                    $scope.addNewItem(code);
                }
                );
            }
        }
        $scope.selectedkhachHang = function (item) {
            $scope.target.tenKhachHang = item.text;


        };

        $scope.selectedKhoNhap = function (item) {
            $scope.target.maKhoNhap = item.value;
            // phieuNhapHangBanTraLaiService.getProductCost(item.id, function(response) {
            // $scope.giaVonThangTruoc = response;
            // });
        }

        $scope.save = function () {
            phieuNhapHangBanTraLaiService.post(
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

        function tinhGiaVon() {
            if ($scope.target.dataDetails.length > 0) {
                var total = 0;
                angular.forEach($scope.target.dataDetails, function (value, key) {
                    total = total + value.soLuong * $scope.giaVonThangTruoc;
                });
                return total;
            }
            return 0;
        }

        function filterData() {
            $scope.isLoading = true;
            phieuNhapHangBanTraLaiService.getNewInstance(function (response) {
                $scope.target = response;
                $scope.target.dataDetails = serviceBanHangTraLaiAndMerchandise.getSelectData();
                $scope.pageChanged();
                $scope.isLoading = false;
                $scope.$watch("target.dataDetails", function (newValue, oldValue) {
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

                //phieuNhapHangBanTraLaiService.getCurrentUser(function (response) {
                //    $scope.target.maDoanhNghiep = response.unitUser.id;
                //    $scope.target.maHaiQuan = response.unitUser.maHaiQuan;
                //    var data = $filter('filter')($scope.tempData.companies, { id: response.unitUser.id }, true);
                //    var dataCustom = $filter('filter')($scope.tempData.donViHaiQuans, { value: $scope.target.maHaiQuan }, true);
                //    if (data && dataCustom) {
                //        $scope.target.maSoThue = data[0].value;
                //        $scope.target.idHaiQuan = dataCustom[0].id;
                //    }

                //});


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

nvModule.controller('phieuNhapHangBanTraLaiEditController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log',
    'nvService', 'phieuNhapHangBanTraLaiService', 'mdService', 'targetData', 'configService', 'serviceBanHangTraLaiAndMerchandise', 'focus',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log,
        nvService, phieuNhapHangBanTraLaiService, mdService, targetData, configService, serviceBanHangTraLaiAndMerchandise, focus) {
        $scope.robot = angular.copy(phieuNhapHangBanTraLaiService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;

        $scope.tempData = mdService.tempData;
        $scope.newItem = {};
        $scope.target = targetData;
        $scope.tkKtKhoNhap = "";
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.tyGia = 0;
        $scope.giaVonThangTruoc = 1;

        $scope.cancel = function () {
            $scope.target.dataDetails.clear();
            $uibModalInstance.dismiss('cancel');
        };
        $scope.title = function () {
            return 'Kê khai hàng hóa nhập trả lại từ khách hàng';
        };

        $scope.nameCurrency = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
        };
        $scope.save = function () {
            phieuNhapHangBanTraLaiService.updateCT($scope.target).then(
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
                    }
                );
        };
        $scope.saveAndPrint = function () {

            phieuNhapHangBanTraLaiService.updateCT($scope.target).then(
                    function (response) {
                        if (response.data.status) {
                            clientService.noticeAlert("Thành công", "success");
                            console.log('Update Successfully!');
                            var url = $state.href('reportphieuNhapHangBanTraLai', { id: response.data.data.id });
                            window.open(url, 'Report Viewer');
                            $scope.target.dataDetails.clear();
                            $uibModalInstance.close($scope.target);
                        } else {
                            clientService.noticeAlert(response.data.message, "danger");
                        }
                    },
                    function (response) {
                        console.log('ERROR: Update failed! ' + response);
                    }
                );
        }
        function filterData() {
            phieuNhapHangBanTraLaiService.getDetails($scope.target.id, function (response) {
                if (response.data.id) {
                    $scope.target = response.data;
                    serviceBanHangTraLaiAndMerchandise.setSelectData($scope.target.dataDetails);
                    $scope.pageChanged();

                    $scope.$watch('target.vat', function (v, k) {
                        $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                        $scope.target.thanhTienSauVat = $scope.target.thanhTienTruocVat + $scope.target.tienVat;
                    });

                    $scope.$watch("target.dataDetails", function (newValue, oldValue) {
                        $scope.target.thanhTienTruocVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                        $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                        $scope.target.thanhTienSauVat = $scope.target.thanhTienTruocVat + $scope.target.tienVat;
                    }, true);
                }
            });

        };


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
                        return serviceBanHangTraLaiAndMerchandise;
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


        $scope.selectedMaHang = function (code) {
            if (code) {
                phieuNhapHangBanTraLaiService.getMerchandiseForNvByCode(code).then(function (response) {

                    $scope.newItem = response.data;
                }, function () {
                    $scope.addNewItem(code);
                }
                )
            }
        }
        $scope.selectedkhachHang = function (item) {
            $scope.target.maKhachHang = item.value;
            phieuNhapHangBanTraLaiService.getCustomer(item.id, function (response) {
                $scope.target.maSoThue = response.maSoThue;
            });

        };
        $scope.selectedTax = function (item) {
            $scope.target.vat = item.value;
            var z = $filter('filter')($scope.tempData.taxs, { value: item.value }, true);
            $scope.tyGia = parseFloat(z[0].extendValue);
        };
        $scope.selectedKhoNhap = function (item) {
            $scope.target.maKhoNhap = item.value;

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

        function init() {
            phieuNhapHangBanTraLaiService.getWareHouseByCode($scope.target.maKhoNhap, function (response) {
                var zK = $filter('filter')($scope.target.dataClauseDetails, { tkNo: response.taiKhoanKt });
            });
            var zT = $filter('filter')($scope.tempData.taxs, { value: $scope.target.vat }, true);
            if (zT.length == 1) {
                $scope.tyGia = zT[0].extendValue;
            };

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

nvModule.controller('printNhapHangBanTraLaiController', [
    '$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
    'mdService', 'phieuNhapHangBanTraLaiService', 'clientService',
    function ($scope, $state, $window, $stateParams, $timeout, $filter,
        mdService, phieuNhapHangBanTraLaiService, clientService) {
        $scope.robot = angular.copy(phieuNhapHangBanTraLaiService.robot);
        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
            if (data && data.length == 1) {
                return data[0].text;
            };
            return "Empty!";
        }

        function filterData() {
            phieuNhapHangBanTraLaiService.postPrint(
                function (response) {
                    $scope.printData = response;
                });
        };

        $scope.info = phieuNhapHangBanTraLaiService.getParameterPrint().filtered.advanceData;
        $scope.goIndex = function () {
            $state.go("nvPhieuNhapHangBanTraLai");
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

nvModule.controller('printDetailNhapHangBanTraLaiController', [
    '$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
    'mdService', 'phieuNhapHangBanTraLaiService', 'clientService',
    function ($scope, $state, $window, $stateParams, $timeout, $filter,
        mdService, phieuNhapHangBanTraLaiService, clientService) {
        $scope.robot = angular.copy(phieuNhapHangBanTraLaiService.robot);
        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
            if (data && data.length == 1) {
                return data[0].text;
            };
            return "Empty!";
        }
        $scope.info = phieuNhapHangBanTraLaiService.getParameterPrint().filtered.advanceData;

        $scope.goIndex = function () {
            $state.go('nvPhieuNhapHangBanTraLai');
        }


        function filterData() {
            phieuNhapHangBanTraLaiService.postPrintDetail(
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

nvModule.controller('reportPhieuNhapHangBanTraLaiController', [
    '$scope', '$window', '$stateParams', '$timeout', '$state', '$filter', 'targetData', '$uibModalInstance', '$rootScope',
    'mdService', 'phieuNhapHangBanTraLaiService', 'clientService',
    function ($scope, $window, $stateParams, $timeout, $state, $filter, targetData, $uibModalInstance, $rootScope,
        mdService, phieuNhapHangBanTraLaiService, clientService) {
        $scope.robot = angular.copy(phieuNhapHangBanTraLaiService.robot);
        var id = $stateParams.id;
        $scope.target = {};


        $scope.nameOfObject = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].description;
            }
        };

        $scope.displayHelper = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
            if (data && data.length == 1) {
                return data[0].description;
            }
        };

        function filterData() {
            if (targetData.id) {
                phieuNhapHangBanTraLaiService.getReport(targetData.id, function (response) {

                    if (response.status) {
                        $scope.target = response.data;
                        $scope.objUser = $rootScope.currentUser;
                        var data1 = $filter('filter')(mdService.tempData.donViHaiQuans, { id: $scope.objUser.idHaiQuan }, true);
                        if (data1) {
                            var dataCustom = $filter('filter')(mdService.tempData.donViHaiQuans, { value: data1[0].extendValue }, true);
                            if (dataCustom.length > 0) {
                                $scope.nameOfCustom = dataCustom[0].description;
                            }
                        }
                    }
                });
            }
        };


        $scope.checkDuyet = function () {
            console.log($scope.target.trangThai);
            if ($scope.target.trangThai == 10) {
                return false;
            } else {
                return true;
            }
        }


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.print = function () {
            var table = document.getElementById('main-report').innerHTML;
            var myWindow = $window.open('', '', 'width=800, height=600');
            myWindow.document.write(table);
            myWindow.print();
        }

        //$scope.$on('$viewContentLoaded', function () {
        //    $scope.$watch('target', function (newVal, oldVal) {

        //        //Force angular not to fire script on load
        //        if (newVal != oldVal) {

        //            //Force script to run AFTER ng-repeat has rendered its things to the DOM
        //            $timeout(function () {

        //                //And finally setTimout to wait for browser to render the custom fonts for print preview
        //                setTimeout(function () {

        //                    //Print document
        //                    $scope.print();
        //                    //window.close();
        //                }, 100);
        //            }, 0);
        //        }
        //    }, true);
        //});
        filterData();

    }
]);

