var soDinhMucService = nvModule.factory('soDinhMucService',
[
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.apiServiceBaseUri;
        var serviceUrl = rootUrl + '/api/Md/SoDinhMuc';

        this.parameterPrint = {};

        function getParameterPrint() {
            return this.parameterPrint;
        }

        var calc = {
            changeAmount_1: function (item) {
                if (!item.soLuongToKhai) {
                    item.soLuongToKhai = 0;
                }
                item.soLuongTon = item.soLuongToKhai - item.soLuongXuat;
            },
            changeAmount_2: function (item) {
                if (!item.soLuongXuat) {
                    item.soLuongXuat = 0;
                }
                item.soLuongTon = item.soLuongToKhai - item.soLuongXuat;
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

            getNhomVatTuForNvByCode: function (code) {
                return $http.get(rootUrl + '/api/Md/NhomVatTu/GetByCode/' + code);
            },

            getReport: function (id, callback) {
                $http.get(serviceUrl + '/GetReport/' + id).success(callback);
            },
            getDetails: function (id, callback) {
                $http.get(serviceUrl + '/GetDetails/' + id).success(callback);
            },

            getCurrentUser: function (callback) {
                $http.get(rootUrl + '/api/Authorize/User/GetCurrentUser').success(callback);
            },
            getHistories: function (data, callback) {
                $http.post(serviceUrl + '/GetHistories', data).success(callback);
            },

            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            },
            acceptItem: function (params) {
                return $http.put(serviceUrl + '/Accept/' + params.id, params);
            },
            khoaso: function (params) {
                return $http.put(serviceUrl + '/KhoaSo/' + params.id, params);
            },
            moKhoaSo: function (params) {
            return $http.put(serviceUrl + '/MoKhoaSo/' + params.id, params);
            }
        };
        return result;

    }
]);

var soDinhMucController = nvModule.controller('soDinhMucController', [
    '$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
    'soDinhMucService', 'configService', 'clientService', 'nvService', 'mdService', 'blockUI', 'authorizeService', 'serviceMerchandiseGroup', 'serviceNhapHangAndMerchandise', '$mdDialog', 'localStorageService',
    function (
        $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
        soDinhMucService, configService, clientService, nvService, mdService, blockUI, authorizeService, serviceMerchandiseGroup, serviceNhapHangAndMerchandise, $mdDialog, localStorageService
    ) {
        $scope.config = nvService.config;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.permission = authorizeService.permissionModel.permission;

        $scope.tempData = mdService.tempData;

        $scope.isEditable = true;
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

        $scope.goHome = function () {
            $state.go('home');
        };
        $scope.refresh = function () {
            $scope.filtered.sumary = '';
            $scope.filtered.advanceData = {};
            $scope.setPage($scope.paged.currentPage);
        };
        $scope.title = function () {
            return 'Danh mục sổ định mức';
        };

        $scope.create = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('MdSoDinhMuc', 'add'),
                controller: 'soDinhMucCreateController',
                windowClass: 'app-modal-window',
                //size: 'lg',
                resolve: {}

            });

            modalInstance.result.then(function (updatedData) {
                $scope.refresh();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.details = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('MdSoDinhMuc', 'details'),
                controller: 'soDinhMucDetailsController',
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
                templateUrl: mdService.buildUrl('MdSoDinhMuc', 'histories'),
                controller: 'soDinhMucHistoryController',
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
                templateUrl: mdService.buildUrl('MdSoDinhMuc', 'update'),
                controller: 'soDinhMucEditController',
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

        //Duyệt sổ định mức
        $scope.accept = function (ev, item) {

            var confirm = $mdDialog.confirm()
            .title('Thông báo')
            .textContent('Bạn có chắc muốn duyệt?')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Ok')
            .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {

                soDinhMucService.acceptItem(item).then(function (data) {
                    console.log(data);
                }).then(function (data) {
                    $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Thông báo')
                    .textContent('Duyệt thành công')
                    .ariaLabel('Alert')
                    .ok('Ok')
                    .targetEvent(ev))
                    .finally(function () {
                        //  $scope.tempData.update('khoanMucs');
                        filterData();
                    });
                });

            }, function () {
                console.log('Không duyệt được');
            });
        }


        //Khóa sổ định mức
        $scope.khoasodinhmuc = function (ev, item) {

            var confirm = $mdDialog.confirm()
            .title('Thông báo')
            .textContent('Bạn có chắc muốn khóa sổ?')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Ok')
            .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {

                soDinhMucService.khoaso(item).then(function (data) {
                    console.log(data);
                }).then(function (data) {
                    $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Thông báo')
                    .textContent('Khóa sổ thành công')
                    .ariaLabel('Alert')
                    .ok('Ok')
                    .targetEvent(ev))
                    .finally(function () {
                        //  $scope.tempData.update('khoanMucs');
                        filterData();
                    });
                });

            }, function () {
                console.log('Không khóa sổ được');
            });
        }

        //Mở Khóa sổ định mức
        $scope.moKhoaSoDinhMuc = function (ev, item) {

            var confirm = $mdDialog.confirm()
            .title('Thông báo')
            .textContent('Bạn có chắc muốn mở khóa sổ?')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Ok')
            .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {

                soDinhMucService.moKhoaSo(item).then(function (data) {
                    console.log(data);
                }).then(function (data) {
                    $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Thông báo')
                    .textContent('Mở Khóa sổ thành công')
                    .ariaLabel('Alert')
                    .ok('Ok')
                    .targetEvent(ev))
                    .finally(function () {
                        //  $scope.tempData.update('khoanMucs');
                        filterData();
                    });
                });

            }, function () {
                console.log('Không mở khóa sổ được');
            });
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
                soDinhMucService.deleteItem(item).then(function (data) {
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



        function filterData() {
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            soDinhMucService.postQuery(
                JSON.stringify(postdata),
                function (response) {

                    $scope.isLoading = false;
                    if (response.status) {
                        $scope.data = response.data.data;
                        angular.extend($scope.paged, response.data);
                    }
                });
            var currentUer = $rootScope.currentUser;
            console.log('a', currentUer);
        };
        filterData();
    }
]);

nvModule.controller('soDinhMucDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'soDinhMucService', 'targetData', 'clientService', 'configService', '$filter',
function ($scope, $uibModalInstance,
    mdService, soDinhMucService, targetData, clientService, configService, $filter) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;


    $scope.title = function () {
        return 'Chi tiết sổ định mức';
    };


    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].description;
        }
    };


    function fillterData() {
        $scope.isLoading = true;
        soDinhMucService.getDetails($scope.target.id, function (response) {

            if (response.status) {
                $scope.target = response.data;
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
                $scope.target.dataDetails[i].thanhTienVAT = $scope.target.dataDetails[i].thanhTien * (1 + $scope.target.dataDetails[i].tyLeVatVao / 100);
                $scope.target.dataDetails[i].giaMuaCoVat = $scope.target.dataDetails[i].giaMua * (1 + $scope.target.dataDetails[i].tyLeVatVao / 100);
                $scope.data.push($scope.target.dataDetails[i]);
            }
        }
    }

}
]);

nvModule.controller('soDinhMucHistoryController', [
'$scope', '$uibModalInstance',
'mdService', 'soDinhMucService', 'targetData', 'clientService', 'configService', '$filter',
function ($scope, $uibModalInstance,
    mdService, soDinhMucService, targetData, clientService, configService, $filter) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Chi tiết lịch sử sổ định mức';
    };

    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
        if (data && data.length == 1) {
            $scope.target.tenDoanhNghiep = data[0].description;
            return data[0].text;
        }
        return "Empty!";
    };

    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].description;
        };
        return "";
    }
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
        choiceObj.id = $scope.target.soPhieu;
        choiceObj.value = $scope.target.maSoThue;
        choiceObj.extendValue = $scope.target.soSo;
        soDinhMucService.getHistories(choiceObj, function (response) {
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
                $scope.data.push($scope.target.dataDetails[i]);
            }
        }
    }
}
]);

nvModule.controller('soDinhMucCreateController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log', '$rootScope',
    'nvService', 'soDinhMucService', 'mdService', 'configService', 'serviceMerchandiseGroup', 'serviceNhapHangAndMerchandise', 'focus',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log, $rootScope,
        nvService, soDinhMucService, mdService, configService, serviceMerchandiseGroup, serviceNhapHangAndMerchandise, focus) {
        $scope.robot = angular.copy(soDinhMucService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.newItem = {};

        $scope.target = { dataDetails: [] };


        $scope.isListItemNull = true;


        $scope.title = function () {
            return 'Thêm sổ định mức';
        };


        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].description;
            }
            return "Empty!";
        };

        $scope.tonSoLuong = function (tokhai, xuat) {
            var ton = tokhai - xuat;
            return ton;
        }

        $scope.addRow = function () {
            $scope.target.dataDetails.push($scope.newItem);
            $scope.pageChanged();
            $scope.newItem = {};
            focus('tenHang');
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
                    $scope.newItem.validateCode = updatedData.tenHang;
                    $scope.newItem.tenHang = updatedData.tenHang;

                }
                $scope.pageChanged();
            }, function () {

            });
        };

        $scope.selectedMaHang = function (code) {
            if (code) {

                soDinhMucService.getNhomVatTuForNvByCode(code).then(function (response) {
                    $scope.newItem.maNhomVatTu = response.data.maNhom;
                    $scope.newItem.tenNhomVatTu = response.data.tenNhom;
                    $scope.newItem.validateCode = response.data.maNhom;
                }, function (error) {
                    //$scope.addNewItem(code);
                }
                );
            }
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
        }
        $scope.cancel = function () {
            $scope.target.dataDetails.clear();
            $scope.isListItemNull = true;
            $uibModalInstance.dismiss('cancel');
        };

        //$scope.selectedMaNhomVatTu = function(code) {
        //    if (code) {
        //        soDinhMucService.getByCode(code).then(function(response) {
        //            $scope.newItem = response.data;
        //            $scope.newItem.validateCode = response.data.maNhomVatTu;
        //            $scope.newItem.maNhomVatTu = response.data.maNhomVatTu;
        //        }, function(error) {
        //            $scope.addNewItem(code);
        //        });
        //    }
        //}




        $scope.save = function () {
            $scope.Loading = true;
            soDinhMucService.post(
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

        function pageChanged() {
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

        function filterData() {

            pageChanged();
            $scope.isLoading = false;

            var currentUer = $rootScope.currentUser;

            var data = $filter('filter')($scope.tempData.companies, { id: currentUer.maDonVi }, true);

            if (data && data.length > 0) {

                $scope.target.maSoThue = data[0].value;
                $scope.target.maHaiQuan = data[0].parent;
                $scope.target.idHaiQuan = data[0].referenceDataId;
            }
        };




        filterData();
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
    }
]);


nvModule.controller('soDinhMucEditController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log',
    'nvService', 'soDinhMucService', 'mdService', 'targetData', 'configService', 'serviceNhapHangAndMerchandise', 'focus',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log,
        nvService, soDinhMucService, mdService, targetData, configService, serviceNhapHangAndMerchandise, focus) {
        $scope.robot = angular.copy(soDinhMucService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.target = targetData;
        $scope.newItem = {};

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
                    $scope.newItem.validateCode = updatedData.tenHang;
                    $scope.newItem.tenHang = updatedData.tenHang;

                }
                $scope.pageChanged();
            }, function () {

            });
        };

        $scope.selectedMaHang = function (code) {
            if (code) {

                soDinhMucService.getNhomVatTuForNvByCode(code).then(function (response) {
                    $scope.newItem.maNhomVatTu = response.data.maNhom;
                    $scope.newItem.tenNhomVatTu = response.data.tenNhom;
                    $scope.newItem.validateCode = response.data.maNhom;
                }, function (error) {
                    //$scope.addNewItem(code);
                }
                );
            }
        }

        $scope.title = function () {
            return 'Sửa sổ định mức';
        };



        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.save = function () {
            soDinhMucService.updateCT($scope.target).then(
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
            soDinhMucService.getDetails($scope.target.id, function (response) {
                if (response.data.id) {
                    $scope.target = response.data;
                    serviceNhapHangAndMerchandise.setSelectData($scope.target.dataDetails);
                    $scope.pageChanged();

                }
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
                    $scope.data.push($scope.target.dataDetails[i]);
                }
            }
        }
    }
]);

nvModule.controller('reportSoDinhMucController', [
    '$scope', '$rootScope', '$filter', '$window', '$stateParams', '$timeout', '$state', 'soDinhMucService',
    'mdService', 'clientService',
    function ($scope, $rootScope, $filter, $window, $stateParams, $timeout, $state,
       soDinhMucService, mdService, clientService) {
        $scope.robot = angular.copy(soDinhMucService.robot);
        var id = $stateParams.id;
        $scope.target = {};
        $scope.config = mdService.config;
        $scope.goIndex = function () {
            $state.go('mdSoDinhMuc');
        };


        function filterData() {
            if (id) {
                soDinhMucService.getReport(id, function (response) {

                    if (response.status) {
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
        $scope.printExcel = function () {
            var data = [document.getElementById('main-report').innerHTML];
            var fileName = "KeKhaiHangNhapKhoDoanhNghiepTrongNuoc_ExportData.xls";
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


nvModule.controller('printsoDinhMucController', [
    '$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
    'mdService', 'soDinhMucService', 'clientService',
    function ($scope, $state, $window, $stateParams, $timeout, $filter,
        mdService, soDinhMucService, clientService) {
        $scope.robot = angular.copy(soDinhMucService.robot);
        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
            if (data && data.length == 1) {
                return data[0].text;
            };
            return "Empty!";
        }

        function filterData() {
            soDinhMucService.postPrint(
                function (response) {
                    $scope.printData = response;
                });
        };

        $scope.info = soDinhMucService.getParameterPrint().filtered.advanceData;
        $scope.goIndex = function () {
            $state.go("mdSoDinhMuc");
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
                });
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

nvModule.controller('printDetailsoDinhMucController', [
    '$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
    'mdService', 'soDinhMucService', 'clientService',
    function ($scope, $state, $window, $stateParams, $timeout, $filter,
        mdService, soDinhMucService, clientService) {
        $scope.robot = angular.copy(soDinhMucService.robot);
        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
            if (data && data.length == 1) {
                return data[0].text;
            };
            return "Empty!";
        }
        $scope.info = soDinhMucService.getParameterPrint().filtered.advanceData;
        $scope.goIndex = function () {
            $state.go("mdSoDinhMuc");
        }

        function filterData() {
            soDinhMucService.postPrintDetail(
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
