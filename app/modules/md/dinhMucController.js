mdModule.factory('dinhMucService', ['$resource', '$http', '$window', 'configService', 'clientService',
function ($resource, $http, $window, configService, clientService) {
    var rootUrl = configService.rootUrlWeb;
    var serviceUrl = configService.rootUrlWebApi + '/Md/DinhMuc';
    var result = {
        postQuery: function (data, callback) {
            $http.post(serviceUrl + '/PostQuery', data).success(callback);
        },
        post: function (data, callback) {
            $http.post(serviceUrl + '/Post', data).success(callback);
        },
        update: function (params) {
            return $http.put(serviceUrl + '/' + params.id, params);
        },
        deleteItem: function (params) {
            return $http.delete(serviceUrl + '/' + params.id, params);
        },
        getDetails: function (id, callback) {
            $http.get(serviceUrl + '/GetDetails/' + id).success(callback);
        }
    }
    return result;
}])

var dinhMucController = mdModule.controller('dinhMucController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog',
'dinhMucService', 'configService', 'mdService', 'localStorageService', 'clientService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog,
dinhMucService, configService, mdService, localStorageService, clientService) {
    $scope.config = mdService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };
    $scope.sortType = 'code'; // set the default sort type
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
        return 'Danh mục định mức theo quy định';
    };
        //delete
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
                dinhMucService.deleteItem(item).then(function(data) {
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
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdDinhMuc', 'add'),
                controller: 'dinhMucCreateController',
                windowClass: 'app-modal-window',
                resolve: {}
            });

            modalInstance.result.then(function(updatedData) {
                $scope.refresh();
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.update = function(target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mddinhMuc', 'update'),
                controller: 'dinhMucEditController',
                resolve: {
                    targetData: function() {
                        return target;
                    }
                }
            });

            modalInstance.result.then(function(updatedData) {
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
                templateUrl: mdService.buildUrl('mddinhMuc', 'detail'),
                controller: 'dinhMucDetailsController',
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
            dinhMucService.postQuery(
                JSON.stringify(postdata),
                function (response) {
                    $scope.isLoading = false;
                    console.log(response);
                    if (response.status) {
                        $scope.data = response.data.data;
                        angular.extend($scope.paged, response.data);
                    }
                });
        };
}]);

mdModule.controller('dinhMucDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'dinhMucService', 'targetData', '$filter', 'configService',
function ($scope, $uibModalInstance,
    mdService, dinhMucService, targetData, $filter, configService) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;

    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        };
        return code;
    }

    $scope.title = function () { return 'Thông tin định mức theo quy đinh '; };

    function fillterData() {
        $scope.isLoading = true;
        dinhMucService.getDetails($scope.target.id, function (response) {
            console.log(response);
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
                $scope.data.push($scope.target.dataDetails[i]);
            }
        }
    }
}
]);

mdModule.controller('dinhMucCreateController', [
    '$scope', '$uibModalInstance',
    'mdService', 'dinhMucService', 'clientService', 'configService', '$filter',
    function ($scope, $uibModalInstance,
        mdService, dinhMucService, clientService, configService, $filter) {
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.title = function () { return 'Thêm định mức theo quy định'; };
        $scope.target = { dataDetails: [{}] };

        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };

        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
            if (data && data.length == 1) {
                return data[0].text;
            };
            return "Empty!";
        }

        $scope.save = function () {
            dinhMucService.post(
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

        $scope.addRow = function () {
            $scope.target.dataDetails.push({});
        };
        $scope.delRow = function (index) {
            $scope.target.dataDetails.splice(index, 1);
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

mdModule.controller('dinhMucEditController', [
    '$scope', '$uibModalInstance',
    'mdService', 'dinhMucService', 'targetData', 'clientService',
    function ($scope, $uibModalInstance,
        mdService, dinhMucService, targetData, clientService) {
        $scope.config = mdService.config;
        $scope.target = targetData;
        $scope.tempData = mdService.tempData;
        $scope.title = function () { return 'Cập nhập định mức theo quy đinh '; };
        console.log(targetData);
        $scope.save = function () {
            dinhMucService.update($scope.target).then(
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