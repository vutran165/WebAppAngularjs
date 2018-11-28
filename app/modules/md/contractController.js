mdModule.factory('contractService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        //var serviceUrl = rootUrl + '/_vti_bin/Apps/Md/ContractService.svc';
        var serviceUrl = configService.rootUrlWebApi + '/Md/Contract';
        var calc = {
            changeSoLuongBao: function(item) {
                if (!item.soLuongLe) {
                    item.soLuongLe = 0;
                }
                if (!item.maBaoBi) {
                    item.luongBao = 1;
                }
                item.soLuong = item.soLuongBao * item.luongBao + item.soLuongLe;
                item.thanhTien = item.soLuong * item.donGia;
            },
            changeDonGia: function(item) {
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
            changeSoLuongLe: function(item) {
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
            }
        }
        var result = {
            robot: calc,
            postQuery: function(data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            post: function(data, callback) {
                $http.post(serviceUrl + '/Post', data).success(callback);
            },
            update: function(params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            getReport: function(id, callback) {
                $http.get(serviceUrl + '/GetReport/' + id).success(callback);
            },
            getDetails: function(id, callback) {
                $http.get(serviceUrl + '/GetDetails/' + id).success(callback);
            },
            deleteItem: function(params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            },
            getMerchandiseForNvByCode: function(code) {
                return $http.get(configService.rootUrlWebApi + '/Md/Merchandise/GetForNvByCode/' + code);
            },
            getProfile: function(callback) {
                return $http.get(configService.rootUrlWebApi + '/Md/Contract/GetProfile').success(callback);
            }
        }
        return result;
    }
]);

var contractController = mdModule.controller('contractController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog', '$filter',
'contractService', 'configService', 'mdService', 'blockUI', 'serviceContractAndMerchandise', 'localStorageService', 'clientService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog, $filter,
contractService, configService, mdService, blockUI, serviceContractAndMerchandise, localStorageService, clientService) {
    $scope.config = mdService.config;
    $scope.tempData = mdService.tempData;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };
    $scope.sortType = 'maHd'; // set the default sort type
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
        return 'Danh mục hợp đồng';
    };
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    }
    
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
                contractService.deleteItem(item).then(function(data) {
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
                            $scope.tempData.update('contracts');
                            filterData();
                        });
                });

            }, function() {
                console.log('Không xóa');
            });
        };

        $scope.create = function() {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdContract', 'add'),
                controller: 'contractCreateController',
                windowClass: 'app-modal-window',
                resolve: {}
            });

            modalInstance.result.then(function(updatedData) {
                $scope.tempData.update('contracts');
                $scope.refresh();
            }, function() {
                serviceContractAndMerchandise.getSelectData().clear();
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.update = function(target) {
            var modalInstance = $uibModal.open({
                templateUrl: mdService.buildUrl('mdContract', 'update'),
                controller: 'contractEditController',
                windowClass: 'app-modal-window',
                resolve: {
                    targetData: function() {
                        return target;
                    }
                }
            });

            modalInstance.result.then(function(updatedData) {
                $scope.tempData.update('contracts');
                $scope.refresh();
            }, function() {
                serviceContractAndMerchandise.getSelectData().clear();
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.details = function(target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdContract', 'details'),
                controller: 'contractDetailsController',
                windowClass: 'app-modal-window',
                resolve: {
                    targetData: function() {
                        return target;
                    }
                }
            });
        };


        filterData();
        function filterData() {
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            contractService.postQuery(
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
}]);
mdModule.controller('contractDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'contractService', 'targetData', '$filter', 'clientService', 'configService',
function ($scope, $uibModalInstance,
    mdService, contractService, targetData, $filter, clientService, configService) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    //$scope.target = clientService.convertFromDateNumber(targetData, ["ngayKy", "NgayThanhLy"]);
    $scope.target = targetData;

    $scope.tempData = mdService.tempData;
    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };

    $scope.title = function () { return 'Thông tin hợp đồng '; };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    function filterData() {
        $scope.isLoading = true;
        contractService.getDetails($scope.target.id, function (response) {

            if (response.status) {
                $scope.target = response.data;

                //$scope.target = clientService.convertFromDateNumber(response.data, ["ngayKy", "NgayThanhLy"]);
            }
            $scope.pageChanged();
            $scope.isLoading = false;
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
mdModule.controller('contractCreateController', [
    '$scope', '$uibModalInstance', '$filter', '$uibModal', '$log',
    'mdService', 'contractService', 'clientService', 'configService', 'serviceContractAndMerchandise',
    function ($scope, $uibModalInstance, $filter, $uibModal, $log,
        mdService, contractService, clientService, configService, serviceContractAndMerchandise) {
        $scope.robot = angular.copy(contractService.robot);
        $scope.config = mdService.config;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.target = { dataDetails: [] };
        $scope.data = [];
        $scope.newItem = {};
        $scope.tempData = mdService.tempData;
        contractService.getProfile(function (response) {
            $scope.target.donViThucHien = response.maDonVi;
            $scope.target.nguoiThucHien = response.username;
        });
        $scope.addRow = function () {
            $scope.target.dataDetails.push($scope.newItem);
            $scope.pageChanged();
            $scope.newItem = {};
        };
        $scope.addNewItem = function (strKey) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'selectData'),
                controller: 'merchandiseSelectDataController',
                windowClass: 'app-modal-window',
                resolve: {
                    serviceSelectData: function () {
                        return serviceContractAndMerchandise;
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
        $scope.setIndex = function (index) {
            $scope.selectedRow = index;
        }
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
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
        $scope.selectedMaHang = function (code) {
            if (code && code.length > 0) {
                contractService.getMerchandiseForNvByCode(code).then(function (response) {
                    $scope.newItem = response.data;
                },
                   function (error) {
                       $scope.addNewItem(code);
                   }
                )
            }
        }
        $scope.$watch("target.dataDetails", function (newValue, oldValue) {
            var total = 0;

            angular.forEach($scope.target.dataDetails, function (v, k) {
                total = total + v.thanhTien;
            });
            $scope.target.giaTriHD = total;
        }, true);
        $scope.title = function () { return 'Thêm hợp đồng'; };
        $scope.save = function () {
            //var convertData = clientService.convertToDateNumber($scope.target, ["ngayKy", "NgayThanhLy"]);
            var convertData = $scope.target;
            contractService.post(
                JSON.stringify(convertData),
                 function (response) {
                     //Fix
                     if (response.status) {
                         console.log('Create  Successfully!');
                         clientService.noticeAlert("Thành công", "success");
                         $scope.target.dataDetails.clear();
                         $uibModalInstance.close($scope.target);

                     } else {
                         clientService.noticeAlert(response.message, "danger");
                     }
                     //End fix
                 });
        };
        function filterData() {
            $scope.target.dataDetails = serviceContractAndMerchandise.getSelectData();
            //$scope.addRow();
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
        $scope.cancel = function () {
            $scope.target.dataDetails.clear();
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

        filterData();
    }
]);
mdModule.controller('contractEditController', [
    '$scope', 'clientService', '$uibModalInstance', '$filter', '$uibModal', '$log',
    'mdService', 'contractService', 'targetData', 'configService', 'serviceContractAndMerchandise',
    function ($scope, clientService, $uibModalInstance, $filter, $uibModal, $log,
        mdService, contractService, targetData, configService, serviceContractAndMerchandise) {
        $scope.robot = angular.copy(contractService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = mdService.config;
        $scope.target = targetData;
        //$scope.target = clientService.convertFromDateNumber(targetData, ["ngayKy", "NgayThanhLy"]);
        $scope.tempData = mdService.tempData;
        $scope.newItem = {};
        $scope.title = function () { return 'Cập nhập hợp đồng '; };
        $scope.setIndex = function (index) {
            $scope.selectedRow = index;
        }
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.addRow = function () {
            serviceContractAndMerchandise.getSelectData().push($scope.newItem);
            $scope.target.dataDetails = serviceContractAndMerchandise.getSelectData();
            $scope.pageChanged();
            $scope.newItem = {};
        };
        $scope.removeRow = function (index) {
            var currentPage = $scope.paged.currentPage;
            var itemsPerPage = $scope.paged.itemsPerPage;
            currentPageIndex = (currentPage - 1) * itemsPerPage + index;
            $scope.target.dataDetails.splice(currentPageIndex, 1);
            serviceContractAndMerchandise.getSelectData().splice(index, 1);
            $scope.pageChanged();
        };

        $scope.selectedMaHang = function (code) {
            if (code && code.length > 0) {
                contractService.getMerchandiseForNvByCode(code).then(function (response) {
                    $scope.newItem = response.data;
                },
                   function (error) {
                       $scope.addNewItem(code);
                   }
                )
            }
        }
        $scope.addNewItem = function (strKey) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'selectData'),
                controller: 'merchandiseSelectDataController',
                windowClass: 'app-modal-window',
                resolve: {
                    serviceSelectData: function () {
                        return serviceContractAndMerchandise;
                    },
                    filterObject: function () {
                        return {
                            summary: strKey
                        };
                    }
                }
            });

            modalInstance.result.then(function (updatedData) {
                $scope.target.dataDetails = serviceContractAndMerchandise.getSelectData();
                if (!updatedData.selected) {
                    $scope.newItem = updatedData;
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

            contractService.update($scope.target).then(
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
        $scope.cancel = function () {
            $scope.target.dataDetails.clear();
            $uibModalInstance.dismiss('cancel');
        };
        function filterData() {

            $scope.isLoading = true;
            contractService.getDetails($scope.target.id, function (response) {
                if (response.status) {

                    $scope.target = response.data;
                    serviceContractAndMerchandise.setSelectData($scope.target.dataDetails);
                }
                $scope.pageChanged();
                $scope.isLoading = false;
                $scope.$watch("target.dataDetails", function (newValue, oldValue) {
                    var total = 0;
                    angular.forEach($scope.target.dataDetails, function (v, k) {
                        total = total + v.thanhTien;
                    });
                    $scope.target.giaTriHD = total;
                }, true);
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
nvModule.controller('reportContractController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
'mdService', 'contractService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
mdService, contractService, clientService) {
    $scope.robot = angular.copy(contractService.robot);
    var id = $stateParams.id;
    $scope.target = {};

    function filterData() {
        if (id) {
            contractService.getReport(id, function (response) {
                if (response.status) {
                    $scope.target = response.data;
                }
            });
        }
    };
    $scope.goIndex = function () {
        $state.go('mdContract');
    }

    $scope.print = function () {
        var table = document.getElementById('main-report').innerHTML;
        var myWindow = $window.open('', '', 'width=800, height=600');
        myWindow.document.write(table);
        myWindow.print();
    }
    filterData();
}])