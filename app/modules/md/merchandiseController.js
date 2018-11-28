mdModule.factory('merchandiseService', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        //var serviceUrl = rootUrl + '/api/Md/Merchandise';
        var serviceUrl = configService.rootUrlWebApi + '/Md/Merchandise';
        var calc = {
            changeCanDienTu: function (target) {
                if (target.isCanDienTu) {
                    result.getNewCanDienTu(function (response) {
                        target.maVatTu = response;
                        target.trangThai = 30;
                    });
                } else {
                    result.getNewCode(target.maLoaiVatTu, function (response) {
                        target.maVatTu = response;
                        target.trangThai = 10;
                    })
                }

            },
            changeGiaMuaVat: function (target) {
                target.giaMua = target.giaMuaVat / ((target.tyLeVatVao / 100) + 1);

                target.giaBanLe = target.giaMua * target.tyLeLaiLe / 100 + target.giaMua;
                target.giaBanBuon = target.giaMua * target.tyLeLaiBuon / 100 + target.giaMua;

                target.giaBanLeVat = Math.round(target.giaBanLe * target.tyLeVatRa / 100 + target.giaBanLe);
                target.giaBanBuonVat = Math.round(target.giaBanBuon * target.tyLeVatRa / 100 + target.giaBanBuon);
            },
            changeGiaMua: function (target) {
                target.giaMuaVat = target.giaMua * target.tyLeVatVao / 100 + target.giaMua;
                target.giaBanLe = target.giaMua * target.tyLeLaiLe / 100 + target.giaMua;
                target.giaBanBuon = target.giaMua * target.tyLeLaiBuon / 100 + target.giaMua;
                target.giaBanLeVat = Math.round(target.giaBanLe * target.tyLeVatRa / 100 + target.giaBanLe);
                target.giaBanBuonVat = Math.round(target.giaBanBuon * target.tyLeVatRa / 100 + target.giaBanBuon);
            },
            changeGiaBanLe: function (target) {

                target.tyLeLaiLe = 100 * (target.giaBanLe - target.giaMua) / target.giaMua;
                target.giaBanLeVat = Math.round(target.giaBanLe * target.tyLeVatRa / 100 + target.giaBanLe);
            },
            changeGiaBanBuon: function (target) {

                target.tyLeLaiBuon = 100 * (target.giaBanBuon - target.giaMua) / target.giaMua;
                target.giaBanBuonVat = Math.round(target.giaBanBuon * target.tyLeVatRa / 100 + target.giaBanBuon);
            },
            changeTyLeLaiLe: function (target) {
                target.giaBanLe = target.giaMua * target.tyLeLaiLe / 100 + target.giaMua;
                target.giaBanLeVat = Math.round(target.giaBanLe * target.tyLeVatRa / 100 + target.giaBanLe);

            },
            changeTyLeLaiBuon: function (target) {
                target.giaBanBuon = target.giaMua * target.tyLeLaiBuon / 100 + target.giaMua;
                target.giaBanBuonVat = Math.round(target.giaBanBuon * target.tyLeVatRa / 100 + target.giaBanBuon);
            },
            changGiaBanLeVat: function (target) {
                target.giaBanLe = target.giaBanLeVat / (1 + target.tyLeVatRa / 100);
                target.tyLeLaiLe = 100 * (target.giaBanLe - target.giaMua) / target.giaMua;
            },
            changeGiaBanBuonVat: function (target) {
                target.giaBanBuon = target.giaBanBuonVat / (1 + target.tyLeVatRa / 100);
                target.tyLeLaiBuon = 100 * (target.giaBanBuon - target.giaMua) / target.giaMua;
            }

        }
        var result = {
            robot: calc,
            postQuery: function (data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            postSelectDataQuery: function (data, callback) {
                $http.post(serviceUrl + '/PostSelectDataQuery', data).success(callback);
            },
            postSelectData: function (data, callback) {
                $http.post(serviceUrl + '/PostSelectData', data).success(callback);
            },
            getCurrentUser: function (callback) {
                $http.get(configService.rootUrlWebApi + '/Authorize/User/GetCurrentUser').success(callback);
            },
            post: function (data, callback) {
                $http.post(serviceUrl + '/Post', data).success(callback);
            },
            update: function (params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            updatePrice: function (params) {
                return $http.put(serviceUrl + '/PutMerchandisePrice/' + params.id, params);
            },
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            },
            getSelectByMaLoai: function (code, callback) {
                $http.get(configService.rootUrlWebApi + '/Md/NhomVatTu/GetSelectByMaLoai/' + code).success(callback);
            },
            getTaxByCode: function (code, callback) {
                $http.get(configService.rootUrlWebApi + '/Md/Tax/GetByCode/' + code).success(callback);
            },
            getDetailByCode: function (code, callback) {
                $http.get(serviceUrl + '/GetDetailByCode/' + code).success(callback);
            },
            getNewCode: function (code, callback) {
                $http.get(serviceUrl + '/GetNewCode/' + code).success(callback);
            },
            getNewCanDienTu: function (callback) {
                $http.get(serviceUrl + '/GetNewCanDienTu').success(callback);
            },
            getBaoBiByCode: function (code, callback) {
                $http.get(configService.rootUrlWebApi + '/Md/Packaging/GetByCode/' + code).success(callback);
            },
            writeDataToExcel: function (data, callback) {
                $http.post(serviceUrl + '/WriteDataToExcel', data).success(callback);
            },
            getMerchandiseForNvByCode: function (code) {
                return $http.get(rootUrl + '/api/Md/Merchandise/GetForNvByCode/' + code);
            },
            getPrice: function (maVatTu, callback) {
                $http.get(serviceUrl + '/GetPrice/' + maVatTu).success(callback);
            },
            getPriceFromSQL: function (maVatTu, callback) {
                $http.get(serviceUrl + '/GetPriceFromSQL/' + maVatTu).success(callback);
            },
            getNhomVatTuFromSQLByMaLoai: function (code,callback) {
                $http.get(configService.rootUrlWebApi + '/Md/NhomVatTu/GetSelectDataFromSQLByMaLoai/'+code).success(callback);
            },
            getKhachHangFromSQL: function (callback) {
                $http.get(configService.rootUrlWebApi + '/Md/Customer/GetSelectDataFromSQL').success(callback);
            },
            getDonViTinhFromSQL: function (callback) {
                $http.get(configService.rootUrlWebApi + '/Md/Packaging/GetSelectDataFromSQL').success(callback);
            },
            getNewCodeFromSQL: function (code, callback) {
                $http.get(serviceUrl + '/GetNewCodeFromSQL/' + code).success(callback);
            }
        }
        return result;
    }]);
mdModule.controller('merchandiseController', [
    '$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog',
    'merchandiseService', 'configService', 'mdService', 'blockUI', 'localStorageService','clientService',
    function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog,
        merchandiseService, configService, mdService, blockUI,localStorageService,clientService) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.isEditable = true;
        $scope.setPage = function (pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };
        $scope.sortType = 'maVatTu'; // set the default sort type
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
            return 'Hàng hóa, Vật tư';
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
                    merchandiseService.deleteItem(item).then(function(data) {
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
                                $scope.tempData.update('merchandises');
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
                    templateUrl: mdService.buildUrl('mdMerchandise', 'add'),
                    controller: 'merchandiseCreateController',
                    windowClass: 'app-modal-window',
                    resolve: {}
                });

                modalInstance.result.then(function(updatedData) {
                    $scope.tempData.update('merchandises');
                    $scope.refresh();
                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.update = function(target) {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: mdService.buildUrl('mdMerchandise', 'update'),
                    controller: 'merchandiseEditController',
                    windowClass: 'app-modal-window',
                    resolve: {
                        targetData: function() {
                            return target;
                        }
                    }
                });

                modalInstance.result.then(function(updatedData) {
                    $scope.tempData.update('merchandises');
                    var index = $scope.data.indexOf(target);
                    if (index !== -1) {
                        $scope.data[index] = updatedData;
                    }
                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.details = function(target) {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: mdService.buildUrl('mdMerchandise', 'details'),
                    controller: 'merchandiseDetailsController',
                    windowClass: 'app-modal-window',
                    resolve: {
                        targetData: function() {
                            return target;
                        }
                    }
                });
            };
            $scope.printITem = function(target) {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: mdService.buildUrl('mdMerchandise', 'printItem'),
                    controller: 'merchandiseExportItemController',
                    windowClass: 'app-modal-window',
                    resolve: {}

                });
                modalInstance.result.then(function(updatedData) {
                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            filterData();
            function filterData() {

                $scope.isLoading = true;
                var postdata = { paged: $scope.paged, filtered: $scope.filtered };
                merchandiseService.postQuery(
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
mdModule.controller('merchandiseDetailsController', [
    '$scope', '$uibModalInstance', 'configService',
    'mdService', 'merchandiseService', 'targetData', '$filter', '$log',
    function ($scope, $uibModalInstance, configService,
        mdService, merchandiseService, targetData, $filter, $log) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.robot = merchandiseService.robot;
        $scope.target = targetData;
        $scope.nhomVatTus = [];
        $scope.merchandiseStatus = angular.copy(mdService.tempData.status);
        $scope.formatLabel = function (model, module) {

            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        }
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.title = function () { return 'Thông tin Hàng hóa, Vật tư '; };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        function filterData() {
            $scope.merchandiseStatus.push(
    {
        value: 30,
        text: "Hiệu lực cân"
    }
    );

            merchandiseService.getSelectByMaLoai($scope.target.maLoaiVatTu, function (response) {
                $scope.nhomVatTus = response;
            });
            merchandiseService.getDetailByCode($scope.target.maVatTu, function (response) {
                $scope.target = response;
                if ($scope.target.trangThai == 30) {
                    $scope.target.isCanDienTu = true;
                }
                $scope.pageChanged();
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
        filterData();
    }
]);
mdModule.controller('merchandiseCreateController', [
    '$scope', '$uibModalInstance', '$filter', '$uibModal', '$log',
    'mdService', 'merchandiseService', 'clientService', 'configService',
    function ($scope, $uibModalInstance, $filter, $uibModal, $log,
        mdService, merchandiseService, clientService, configService) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.robot = merchandiseService.robot;
        $scope.currentUser = {};
        $scope.nhomVatTus = [];
        $scope.target = { };
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.merchandiseStatus = angular.copy(mdService.tempData.status);
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        }
        $scope.changeNhomVatTu = function () {
            merchandiseService.getNewCode($scope.target.maNhomVatTu, function (response) {
                $scope.target.maVatTu = response;
            });
        }
        $scope.title = function () { return 'Thêm Hàng hóa, Vật tư'; };
        $scope.save = function () {
            merchandiseService.post(
                JSON.stringify($scope.target),
                function (response) {
                    //Fix
                    if (response.status) {
                        console.log('Create  Successfully!');
                        clientService.noticeAlert("Thành công", "success");
                        $uibModalInstance.close($scope.target);

                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                    //End fix
                });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.toTenVietTat = function (target) {
            target.tenviettat = target.tendaydu;
        }
        $scope.createMerchandiseType = function (target, name) {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandiseType', 'add'),
                controller: 'merchandiseTypeCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('merchandiseTypes', function () {
                    if (target && name) {
                        target[name] = updatedData.mdNhomVatTu;
                    }

                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.createNhomVatTu = function (target, name) {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdNhomVatTu', 'add'),
                controller: 'nhomVatTuCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('nhomVatTus', function () {
                    if (target && name) {
                        target[name] = updatedData.mdNhomVatTu;
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
        $scope.createShelve = function (target, name) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('MdShelves', 'add'),
                controller: 'shelvesCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('shelves', function () {
                    if (target && name) {
                        target[name] = updatedData.maKeHang;
                    }
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.update = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'price-edit'),
                controller: 'merchandisePriceEditController',
                resolve: {
                    targetData: function () {
                        return target;
                    },
                    initData: {
                        maVatRa: $scope.target.maVatRa,
                        maVatVao: $scope.target.maVatVao,
                        tyLeVatRa: $scope.target.tyLeVatRa,
                        tyLeVatVao: $scope.target.tyLeVatVao
                    }
                }
            });

            modalInstance.result.then(function (updatedData) {
                var index = $scope.target.dataDetails.indexOf(target);
                if (index !== -1) {
                    $scope.target.dataDetails[index] = updatedData;
                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.removeItem = function (index) {
            var currentPage = $scope.paged.currentPage;
            var itemsPerPage = $scope.paged.itemsPerPage;
            currentPageIndex = (currentPage - 1) * itemsPerPage + index;
            $scope.target.dataDetails.splice(currentPageIndex, 1);
            $scope.pageChanged();
        }
        $scope.create = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'price'),
                controller: 'merchandisePriceCreateController',
                resolve: {
                    initData: {
                        maVatRa: $scope.target.maVatRa,
                        maVatVao: $scope.target.maVatVao,
                        tyLeVatRa: $scope.target.tyLeVatRa,
                        tyLeVatVao: $scope.target.tyLeVatVao
                    }
                }
            });

            modalInstance.result.then(function (updatedData) {
                var checkIfExsit = $scope.target.dataDetails.some(function (element, index, array) {
                    return element.maDonVi == updatedData.maDonVi
                });
                if (!checkIfExsit) {
                    $scope.target.dataDetails.push(updatedData);
                    $scope.pageChanged();
                }
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
        function filterData() {

        }
    }
]);
mdModule.controller('merchandiseEditController', [
    '$scope', '$uibModalInstance', '$filter', '$log', '$uibModal',
    'mdService', 'merchandiseService', 'targetData', 'clientService', 'configService',
    function ($scope, $uibModalInstance, $filter, $log, $uibModal,
        mdService, merchandiseService, targetData, clientService, configService) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = targetData;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.nhomVatTus = [];
        $scope.robot = merchandiseService.robot;
        $scope.merchandiseStatus = angular.copy(mdService.tempData.status);
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        }
        $scope.changeNhomVatTu = function () {
            merchandiseService.getNewCode($scope.target.maNhomVatTu, function (response) {
                $scope.target.maVatTu = response;
            });
        }
        $scope.title = function () { return 'Cập nhập Hàng hóa, Vật tư '; };
        $scope.save = function () {
            merchandiseService.update($scope.target).then(
                 function (response) {

                     if (response.status && response.status == 200) {
                         if (response.data.status) {
                             console.log('Create  Successfully!');
                             clientService.noticeAlert("Thành công", "success");
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
            $uibModalInstance.dismiss('cancel');
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
        $scope.createShelve = function (target, name) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('MdShelves', 'add'),
                controller: 'shelvesCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('shelves', function () {
                    if (target && name) {
                        target[name] = updatedData.maKeHang;
                    }
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.toTenVietTat = function (target) {
            target.tenviettat = target.tendaydu;
        }

        $scope.update = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'price-edit'),
                controller: 'merchandisePriceEditController',
                resolve: {
                    targetData: function () {
                        return target;
                    }
                }
            });

            modalInstance.result.then(function (updatedData) {
                var index = $scope.target.dataDetails.indexOf(target);
                if (index !== -1) {
                    $scope.target.dataDetails[index] = updatedData;
                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.removeItem = function (index) {
            var currentPage = $scope.paged.currentPage;
            var itemsPerPage = $scope.paged.itemsPerPage;
            currentPageIndex = (currentPage - 1) * itemsPerPage + index;
            $scope.target.dataDetails.splice(currentPageIndex, 1);
            $scope.pageChanged();
        }
        $scope.create = function () {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'price'),
                controller: 'merchandisePriceCreateController',
                resolve: {
                    initData: {
                        maVatRa: $scope.target.maVatRa,
                        maVatVao: $scope.target.maVatVao,
                        tyLeVatRa: $scope.target.tyLeVatRa,
                        tyLeVatVao: $scope.target.tyLeVatVao
                    }
                }
            });

            modalInstance.result.then(function (updatedData) {
                $scope.target.dataDetails.push(updatedData);
                $scope.pageChanged();
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
        function filterData() {
            $scope.merchandiseStatus.push(
                {
                    value: 30,
                    text: "Hiệu lực cân"
                }
                );
            merchandiseService.getDetailByCode($scope.target.maVatTu, function (response) {
                $scope.target = response;
                if ($scope.target.trangThai == 30) {
                    $scope.target.isCanDienTu = true;
                }
                $scope.pageChanged();
            });
            merchandiseService.getSelectByMaLoai($scope.target.maLoaiVatTu, function (response) {
                $scope.nhomVatTus = response;
            });
        }
        filterData();
    }
]);

mdModule.controller('merchandiseSelectDataController', [
    '$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$uibModalInstance', '$log', '$state',
    'merchandiseService', 'configService', 'mdService', 'serviceSelectData', 'filterObject',
    function ($scope, $resource, $rootScope, $location, $window, $uibModal, $uibModalInstance, $log, $state,
        merchandiseService, configService, mdService, serviceSelectData, filterObject) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.filtered = angular.extend($scope.filtered, filterObject);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.isEditable = true;
        $scope.setPage = function (pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };
        $scope.selecteItem = function (item) {
            $uibModalInstance.close(item);
        }
        $scope.sortType = 'maVatTu'; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.doSearch = function () {
            $scope.paged.currentPage = 1;
            filterData();
        };

        $scope.pageChanged = function () {
            filterData();
        };

        $scope.refresh = function () {
            $scope.setPage($scope.paged.currentPage);
        };

        $scope.title = function () {
            return 'Hàng hóa, Vật tư';
        };

        $scope.doCheck = function (item) {
            if (item) {
                var isSelected = $scope.listSelectedData.some(function (element, index, array) {
                    return element.id == item.id;
                });
                if (item.selected) {
                    if (!isSelected) {
                        $scope.listSelectedData.push(item);
                    }
                } else {
                    if (isSelected) {
                        var index = $scope.listSelectedData.indexOf(item);
                        $scope.listSelectedData.splice(index, 1);
                    }
                }
            } else {
                angular.forEach($scope.data, function (v, k) {

                    $scope.data[k].selected = $scope.all;
                    var isSelected = $scope.listSelectedData.some(function (element, index, array) {
                        if (!element) return false;
                        return element.id == v.id;
                    });

                    if ($scope.all) {
                        if (!isSelected) {
                            $scope.listSelectedData.push($scope.data[k]);
                        }
                    } else {
                        if (isSelected) {
                            $scope.listSelectedData.splice($scope.data[k], 1);
                        }
                    }
                });
            }
        }
        $scope.create = function () {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'add'),
                controller: 'merchandiseCreateController',
                windowClass: 'app-modal-window',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('merchandises');
                $scope.refresh();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.save = function () {
            console.log($scope.listSelectedData);
            //$uibModalInstance.close(true);
        };
        filterData();
        function filterData() {
            $scope.listSelectedData = serviceSelectData.getSelectData();
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            merchandiseService.postSelectDataQuery(
                JSON.stringify(postdata),
                function (response) {
                    $scope.isLoading = false;
                    if (response.status) {
                        $scope.data = response.data.data;
                        angular.forEach($scope.data, function(v, k) {
                            var isSelected = $scope.listSelectedData.some(function(element, index, array) {
                                if (!element) return false;
                                return element.maHang == v.maHang;
                            });
                            if (isSelected) {
                                $scope.data[k].selected = true;
                            }
                        });
                        angular.extend($scope.paged, response.data);
                    }
                });
        };
    }]);
mdModule.controller('merchandiseSimpleSelectDataController', [
    '$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$uibModalInstance', '$log', '$state',
    'merchandiseService', 'configService', 'mdService', 'serviceSelectData', 'filterObject',
    function ($scope, $resource, $rootScope, $location, $window, $uibModal, $uibModalInstance, $log, $state,
        merchandiseService, configService, mdService, serviceSelectData, filterObject) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.filtered = angular.extend($scope.filtered, filterObject);
        $scope.isEditable = true;
        $scope.setPage = function (pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };
        $scope.selecteItem = function (item) {
            $uibModalInstance.close(item);
        }
        $scope.sortType = 'maVatTu'; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.doSearch = function () {
            $scope.paged.currentPage = 1;
            filterData();
        };
        $scope.pageChanged = function () {
            filterData();
        };
        $scope.refresh = function () {
            $scope.setPage($scope.paged.currentPage);
        };
        $scope.title = function () {
            return 'Hàng hóa';
        };
        $scope.doCheck = function (item) {
            if (item) {
                var isSelected = $scope.listSelectedData.some(function (element, index, array) {
                    return element.id == item.id;
                });
                if (item.selected) {
                    if (!isSelected) {
                        $scope.listSelectedData.push(item);
                    }
                } else {
                    if (isSelected) {
                        $scope.listSelectedData.splice(item, 1);
                    }
                }
            } else {
                angular.forEach($scope.data, function (v, k) {

                    $scope.data[k].selected = $scope.all;
                    var isSelected = $scope.listSelectedData.some(function (element, index, array) {
                        if (!element) return false;
                        return element.id == v.id;
                    });

                    if ($scope.all) {
                        if (!isSelected) {
                            $scope.listSelectedData.push($scope.data[k]);
                        }
                    } else {
                        if (isSelected) {
                            $scope.listSelectedData.splice($scope.data[k], 1);
                        }
                    }
                });
            }
        }
        $scope.create = function () {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'add'),
                controller: 'merchandiseCreateController',
                windowClass: 'app-modal-window',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('merchandises');
                $scope.refresh();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.save = function () {
            //console.log($scope.listSelectedData);
            $uibModalInstance.close($scope.listSelectedData);
        };
        filterData();
        function filterData() {
            $scope.listSelectedData = serviceSelectData.getSelectData();
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            merchandiseService.postSelectData(
                JSON.stringify(postdata),
                function (response) {
                    $scope.isLoading = false;
                    if (response.status) {
                        $scope.data = response.data.data;
                        angular.forEach($scope.data, function (v, k) {
                            var isSelected = $scope.listSelectedData.some(function (element, index, array) {
                                if (!element) return false;
                                return element.value == v.value;
                            });
                            if (isSelected) {
                                $scope.data[k].selected = true;
                            }
                        })
                        angular.extend($scope.paged, response.data);
                    }
                });
        };
    }]);
mdModule.controller('merchandiseExportItemController', [
    '$scope', '$filter', '$window', '$stateParams', '$timeout', '$state', '$uibModal',
    'mdService', 'configService', 'merchandiseService', 'clientService', '$uibModalInstance', 'Excel', 'merchandiseAndMerchandise', 'focus',
    function ($scope, $filter, $window, $stateParams, $timeout, $state, $uibModal,
	mdService, configService, merchandiseService, clientService, $uibModalInstance, Excel, merchandiseAndMerchandise, focus) {
        $scope.robot = angular.copy(merchandiseService.robot);
        $scope.config = mdService.config;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.target = { dataDetails: [] };
        $scope.data = [];
        $scope.newItem = {};
        $scope.tempData = mdService.tempData;
        $scope.hrefTem = configService.apiServiceBaseUri + "/Upload/Barcode/Barcode.xls";

        $scope.addRow = function () {
            if (!$scope.newItem.soLuong || $scope.newItem.soLuong < 1) {
                focus('soLuong');
                return;
            }
            if ($scope.newItem.validateCode == $scope.newItem.maHang) {
                $scope.target.dataDetails.push($scope.newItem);
            }
            if (!$scope.newItem.maHang) {
                focus('mahang');
                return;
            }
            //   $scope.target.dataDetails.push($scope.newItem);
            $scope.pageChanged();
            console.log($scope.newItem);
            $scope.newItem = {};
            focus('mahang');
            //console.log($scope.target.dataDetails);
        };
        $scope.title = function () {
            return 'In tem hàng hóa';
        };

        $scope.addNewItem = function (strKey) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'selectData'),
                controller: 'merchandiseSelectDataController',
                windowClass: 'app-modal-window',
                resolve: {
                    serviceSelectData: function () {
                        return merchandiseAndMerchandise;
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
                    console.log(updatedData);
                    $scope.newItem = updatedData;
                    $scope.newItem.soTonMax = updatedData.soLuong;
                    $scope.newItem.validateCode = updatedData.maHang;

                    //    $scope.newItem.donGia = updatedData.giaBanLe;
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
            if (data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.selectedMaHang = function (code) {
            if (code) {
                merchandiseService.getMerchandiseForNvByCode(code).then(function (response) {
                    $scope.newItem = response.data;
                },
                   function () {
                       $scope.addNewItem(code);
                   }
                )
            }
        }
        function filterData() {
            $scope.target.dataDetails = merchandiseAndMerchandise.getSelectData();
            //$scope.addRow();
            merchandiseService.getNewCode(function (response) {
                console.log(response);
                $scope.target.maBoHang = response;
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
        $scope.exportToExcel = function () {
            console.log($scope.target.dataDetails);
            merchandiseService.writeDataToExcel($scope.target.dataDetails, function (response) {
                if (response.status) {
                    clientService.noticeAlert("Thành công", "success");
                    //     $uibModalInstance.close($scope.target);

                }
                else {
                    clientService.noticeAlert(response.message, "danger");
                }

            });
        }
    }]);
