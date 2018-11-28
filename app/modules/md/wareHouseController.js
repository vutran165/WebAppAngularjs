mdModule.factory('wareHouseService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        //var serviceUrl = rootUrl + '/_vti_bin/Apps/Md/WareHouseService.svc';
        var serviceUrl = configService.rootUrlWebApi + '/Md/WareHouse';
        var result = {
            postQuery: function (data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            post: function (data, callback) {
                $http.post(serviceUrl + '/Post', data).success(callback);
            },
            postSelectData: function (data, callback) {
                $http.post(serviceUrl + '/PostSelectData', data).success(callback);
            },
            update: function (params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            },
            postCodeStore: function (data, callback) {
                $http.post(serviceUrl + '/PostCodeStore', data).success(callback);
            }
        }
        return result;
    }
]);

var wareHouseController = mdModule.controller('wareHouseController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog', '$filter',
'wareHouseService', 'configService', 'mdService', 'blockUI', 'clientService', 'localStorageService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog, $filter,
wareHouseService, configService, mdService, blockUI, clientService, localStorageService) {
    $scope.tempData = mdService.tempData;
    $scope.config = mdService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;

    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length > 0) {
            return data[0].description;
        }
        return "Empty!";
    };

    $scope.customChange = function (mahq) {
        if (mahq) {
            mahq = mahq.toUpperCase();
            var data = $filter('filter')(mdService.tempData.donViHaiQuans, { value: mahq }, true);
            console.log(data);
            if (data && data.length > 0) {
                $scope.filtered.advanceData.maHaiQuan = data[0].value;
                $scope.filtered.advanceData.idHaiQuan = data[0].id;
            }
        }
    };


    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };
    $scope.sortType = 'maKho'; // set the default sort type
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
        return 'Kho';
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
            wareHouseService.deleteItem(item).then(function (data) {
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
                        $scope.tempData.update('wareHouses');
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
            templateUrl: mdService.buildUrl('mdWareHouse', 'add'),
            controller: 'wareHouseCreateController',
            resolve: {},
            size: 'lg'
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('wareHouses');
            $scope.refresh();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.update = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdWareHouse', 'update'),
            controller: 'wareHouseEditController',
            size: 'lg',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('wareHouses');
            var index = $scope.data.indexOf(target);
            if (index !== -1) {
                $scope.data[index] = updatedData;
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.details = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdWareHouse', 'details'),
            controller: 'wareHouseDetailsController',
            size: 'lg',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
    };

    function filterData() {
        $scope.isLoading = true;
        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        wareHouseService.postQuery(
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


    filterData();

}]);

mdModule.controller('wareHouseDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'wareHouseService', 'targetData', '$filter',
function ($scope, $uibModalInstance,
    mdService, wareHouseService, targetData, $filter) {
    $scope.tempData = mdService.tempData;
    $scope.config = mdService.config;
    $scope.target = targetData;
    console.log(targetData);

    $scope.displayHelper = function (code, module) {
        if (!code) return "";
        var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
        if (data && data.length == 1) {
            return data[0].description;
        };
        return "Empty!";
    }

    $scope.tagdoiTuongs = [];

    $scope.tagCustomerTypes = [];


    var lstStore = [];
    var lstCompanyType = [];

    function loadStore() {
        if (targetData.loaiHinhCuaHang) {
            lstStore = targetData.loaiHinhCuaHang.split(',');
        }
        if (targetData.maDoiTuong) {
            lstCompanyType = targetData.maDoiTuong.split(',');
        }
        angular.forEach(lstStore, function (filterObject) {
            angular.forEach(mdService.tempData.loaiHinhCuaHangs, function (obj) {
                if (obj.value == filterObject) {
                    $scope.tagdoiTuongs.push(obj);
                }

            });
        });

        angular.forEach(lstCompanyType, function (filterObject) {
            angular.forEach(mdService.tempData.doiTuongs, function (obj) {
                if (obj.value == filterObject) {
                    $scope.tagCustomerTypes.push(obj);
                }

            });
        });

        $scope.target.idHaiQuan = targetData.donViHaiQuanChuQuan;
        var data = $filter('filter')(mdService.tempData.companies, { value: targetData.maSoThue }, true);
        if (data && data.length > 0) {
            $scope.target.maDoanhNghiep = data[0].id;
        }
    }


    loadStore();

    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };

    $scope.title = function () { return 'Thông tin Kho '; };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

mdModule.controller('wareHouseCreateController', [
    '$scope', '$uibModalInstance', '$filter', 'configService',
    'mdService', 'wareHouseService', 'clientService',
    function ($scope, $uibModalInstance, $filter, configService,
        mdService, wareHouseService, clientService) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = {};
        $scope.tagCustomerTypes = [];
        $scope.tagdoiTuongs = [];

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
        $scope.title = function () { return 'Thêm Kho'; };

        $scope.loadCustomerType = function (query) {
            return $scope.tempData.doiTuongs;
        }

        var choiceObj = angular.copy(configService.choiceObj);

        function selectedComapny() {
            choiceObj.id = $scope.target.maSoThue;
            choiceObj.value = $scope.target.donViHaiQuanChuQuan;
            wareHouseService.postCodeStore(choiceObj, function (response) {
                $scope.target.maKho = response;
            });
        }


        $scope.objectChange = function (item) {

            var data = $filter('filter')(mdService.tempData.companies, { id: item }, true);
            if (data && data.length > 0) {
                $scope.target.maSoThue = data[0].value;
                selectedComapny();
            }

        }

        $scope.customChange = function () {

            var data = $filter('filter')(mdService.tempData.donViHaiQuans, { value: $scope.target.donViHaiQuanChuQuan }, true);
            if (data && data.length > 0) {
                $scope.target.idHaiQuan = data[0].value;
            }
            selectedComapny();
        }


        $scope.selectedCustom = function (item) {
            $scope.target.donViHaiQuanChuQuan = item.value;
            selectedComapny();
        }

        $scope.selectedObject = function (item) {
            $scope.target.maSoThue = item.value;
            $scope.target.maDoanhNghiep = item.id;
            selectedComapny();
        }






        $scope.$watch('tagCustomerTypes', function (newV, oldV) {
            var values = $scope.tagCustomerTypes.map(function (element) {
                return element.value;
            });
            $scope.target.maDoiTuong = values.join();
            console.log($scope.target.maDoiTuong);
        }, true);


        $scope.loadDoiTuong = function (query) {

            return $scope.tempData.loaiHinhCuaHangs;
        }

        $scope.$watch('tagdoiTuongs', function (newValue, oldValue) {

            var values = $scope.tagdoiTuongs.map(function (element) {
                return element.value;
            });
            $scope.target.loaiHinhCuaHang = values.join();
            console.log($scope.tagdoiTuongs);
        }, true);




        $scope.save = function () {

            wareHouseService.post(
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
    }
]);

mdModule.controller('wareHouseEditController', [
    '$scope', '$uibModalInstance', '$filter', 'configService',
    'mdService', 'wareHouseService', 'targetData', 'clientService',
    function ($scope, $uibModalInstance, $filter, configService,
        mdService, wareHouseService, targetData, clientService) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = targetData;

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
                return data[0].text;
            }
            return "Empty!";
        };

        $scope.loadCustomerType = function (query) {
            return $scope.tempData.doiTuongs;
        }


        var choiceObj = angular.copy(configService.choiceObj);

        function selectedComapny() {
            choiceObj.id = $scope.target.maSoThue;
            choiceObj.value = $scope.target.donViHaiQuanChuQuan;
            wareHouseService.postCodeStore(choiceObj, function (response) {
                $scope.target.maKho = response;
            });
        }


        $scope.objectChange = function (item) {

            var data = $filter('filter')(mdService.tempData.companies, { id: item }, true);
            if (data && data.length > 0) {
                $scope.target.maSoThue = data[0].value;
                selectedComapny();
            }

        }

        $scope.customChange = function () {

            var data = $filter('filter')(mdService.tempData.donViHaiQuans, { value: $scope.target.donViHaiQuanChuQuan }, true);
            if (data && data.length > 0) {
                $scope.target.idHaiQuan = data[0].value;
            }
            selectedComapny();
        }


        $scope.selectedCustom = function (item) {
            $scope.target.donViHaiQuanChuQuan = item.value;
            selectedComapny();
        }

        $scope.selectedObject = function (item) {
            $scope.target.maSoThue = item.value;
            $scope.target.maDoanhNghiep = item.id;
            selectedComapny();
        }



        $scope.$watch('tagCustomerTypes', function (newV, oldV) {
            var values = $scope.tagCustomerTypes.map(function (element) {
                return element.value;
            });
            $scope.target.maDoiTuong = values.join();
            console.log($scope.target.maDoiTuong);
        }, true);


        $scope.loadDoiTuong = function (query) {

            return $scope.tempData.loaiHinhCuaHangs;
        }

        $scope.$watch('tagdoiTuongs', function (newValue, oldValue) {

            var values = $scope.tagdoiTuongs.map(function (element) {
                return element.value;
            });
            $scope.target.loaiHinhCuaHang = values.join();
            console.log($scope.target.loaiHinhCuaHang);
        }, true);


        $scope.tagdoiTuongs = [];

        $scope.tagCustomerTypes = [];

        var lstStore = [];
        var lstCompanyType = [];

        function loadStore() {
            if (targetData.loaiHinhCuaHang) {
                lstStore = targetData.loaiHinhCuaHang.split(',');
            }
            if (targetData.maDoiTuong) {
                lstCompanyType = targetData.maDoiTuong.split(',');
            }
            angular.forEach(lstStore, function (filterObject) {
                angular.forEach(mdService.tempData.loaiHinhCuaHangs, function (obj) {
                    if (obj.value == filterObject) {
                        $scope.tagdoiTuongs.push(obj);
                    }

                });
            });

            angular.forEach(lstCompanyType, function (filterObject) {
                angular.forEach(mdService.tempData.doiTuongs, function (obj) {
                    if (obj.value == filterObject) {
                        $scope.tagCustomerTypes.push(obj);
                    }

                });
            });


            $scope.target.idHaiQuan = targetData.donViHaiQuanChuQuan;
            var data = $filter('filter')(mdService.tempData.companies, { value: targetData.maSoThue }, true);
            if (data && data.length > 0) {
                $scope.target.maDoanhNghiep = data[0].id;
            }

        }

        loadStore();

        $scope.title = function () { return 'Cập nhập Kho '; };
        console.log(targetData);
        $scope.save = function () {
            wareHouseService.update($scope.target).then(
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
    }
]);

mdModule.controller('wareHouseSelectDataController', [
    '$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$uibModalInstance', '$log', '$state', 'selectedWareHouse', 'selectedDoanhNghiep', 'selectedHaiQuan', '$filter',
    'wareHouseService', 'configService', 'mdService',
    function ($scope, $resource, $rootScope, $location, $window, $uibModal, $uibModalInstance, $log, $state, selectedWareHouse, selectedDoanhNghiep, selectedHaiQuan, $filter,
        wareHouseService, configService, mdService) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.filtered.advanceData.listDoanhNghiep = selectedDoanhNghiep;
        $scope.filtered.advanceData.maHaiQuan = selectedHaiQuan.maHaiQuan;
        $scope.filtered.advanceData.idHaiQuan = selectedHaiQuan.idHaiQuan;
        $scope.isEditable = true;
        $scope.setPage = function (pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };
        $scope.selecteItem = function (item) {
            $uibModalInstance.close(item);
        }
        $scope.sortType = 'maKho'; // set the default sort type
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
            return 'Kho hàng';
        };

        $scope.doCheck = function (item) {
            var tmp = $filter('filter')($scope.listSelected, { id: item.id }, true);
            if (item.selected) {
                if (!tmp || tmp.length < 1) {
                    $scope.listSelected.push(item);
                }
            } else {
                if (tmp && tmp.length > 0) {
                    $scope.listSelected.splice($scope.listSelected.indexOf(tmp[0]), 1);
                }
            }
        }

        //$scope.doCheck = function (item) {
        //    if (item) {
        //        var isSelected = $scope.listSelectedData.some(function (element, index, array) {
        //            return element.id == item.id;
        //        });
        //        if (item.selected) {
        //            if (!isSelected) {
        //                $scope.listSelectedData.push(item);
        //            }
        //        } else {
        //            if (isSelected) {
        //                $scope.listSelectedData.splice(item, 1);
        //            }
        //        }
        //    } else {
        //        angular.forEach($scope.data, function (v, k) {

        //            $scope.data[k].selected = $scope.all;
        //            var isSelected = $scope.listSelectedData.some(function (element, index, array) {
        //                if (!element) return false;
        //                return element.id == v.id;
        //            });

        //            if ($scope.all) {
        //                if (!isSelected) {
        //                    $scope.listSelectedData.push($scope.data[k]);
        //                }
        //            } else {
        //                if (isSelected) {
        //                    $scope.listSelectedData.splice($scope.data[k], 1);
        //                }
        //            }
        //        });
        //    }
        //}
        $scope.create = function () {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdWareHouse', 'add'),
                controller: 'wareHouseCreateController',
                windowClass: 'app-modal-window',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('wareHouses');
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
            $uibModalInstance.close($scope.listSelected);
        };
        filterData();
        function filterData() {
            if (selectedWareHouse) {
                $scope.listSelected = angular.copy(selectedWareHouse);
            } else {
                $scope.listSelected = [];
            }
            //$scope.listSelectedData = serviceSelectData.getSelectData();
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            wareHouseService.postSelectData(JSON.stringify(postdata), function (response) {
                $scope.isLoading = false;
                if (response.status && response.data) {
                    $scope.data = response.data.data;
                    if ($scope.data && $scope.data.length > 0 && $scope.listSelected && $scope.listSelected.length > 0) {
                        for (var i = 0; i < $scope.data.length; i++) {
                            var tmp = $filter('filter')($scope.listSelected, { id: $scope.data[i].id }, true);
                            if (tmp && tmp.length > 0) {
                                $scope.data[i].selected = true;
                            }
                        }
                    }
                    angular.extend($scope.paged, response.data);
                }
            });
            //wareHouseService.postSelectData(
            //    JSON.stringify(postdata),
            //    function (response) {
            //        $scope.isLoading = false;
            //        if (response.status) {
            //            $scope.data = response.data.data;
            //            angular.forEach($scope.data, function(v, k) {
            //                var isSelected = $scope.listSelectedData.some(function(element, index, array) {
            //                    if (!element) return false;
            //                    return element.value == v.value;
            //                });
            //                if (isSelected) {
            //                    $scope.data[k].selected = true;
            //                }
            //            });
            //            angular.extend($scope.paged, response.data);
            //        }
            //    });
        };
    }]);