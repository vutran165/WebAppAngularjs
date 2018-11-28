mdModule.factory('periodService', ['$resource', '$http', '$window', 'configService', 'clientService',
function ($resource, $http, $window, configService, clientService) {
    var rootUrl = configService.rootUrlWeb;
    //var serviceUrl = rootUrl + '/_vti_bin/Apps/Md/PeriodService.svc';
    var serviceUrl = configService.rootUrlWebApi + '/Md/Period';
    var result = {
        postQuery: function (data, callback) {
            $http.post(serviceUrl + '/PostQuery', data).success(callback);
        },
        postCreateNewPeriod: function (data, callback) {
            $http.post(serviceUrl + '/PostCreateNewPeriod', data).success(callback);
        },
        post: function (data, callback) {
            $http.post(serviceUrl + '/Post', data).success(callback);
        },
        postApproval: function (data, callback) {
            return $http.post(serviceUrl + '/PostAppoval', data).success(callback);
        },
        update: function (params) {
            return $http.put(serviceUrl + '/' + params.id, params);
        },
        deleteItem: function (params) {
            return $http.delete(serviceUrl + '/' + params.id, params);
        },
    }
    return result;
}])

var periodController = mdModule.controller('periodController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog',
'periodService', 'configService', 'mdService', 'blockUI', 'clientService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog,
periodService, configService, mdService, blockUI, clientService) {
    $scope.tempData = mdService.tempData;
    $scope.config = mdService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };
    $scope.isDisabled = false;
    $scope.isCreateDisDisabled = false;
    $scope.sortType = 'period'; // set the default sort type
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
        return 'Kỳ khóa sổ';
    };
    $scope.target = {};
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
            c=periodService.deleteItem(item).then(function (data) {
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
                        $scope.tempData.update('periods');
                        filterData();
                    });
            });

        }, function () {
            console.log('Không xóa');
        });
    };
    $scope.approval = function (item) {
        $scope.isDisabled = true;
        periodService.postApproval(
            JSON.stringify(item),
            function (response) {
                //Fix
                if (response.status) {
                    console.log('Create  Successfully!');
                    clientService.noticeAlert(response.message, "success");
                    $scope.isDisabled = false;
                    $scope.refresh();
                } else {
                    $scope.isDisabled = false;
                    clientService.noticeAlert(response.message, "danger");
                }
                //End fix
            }).error(function (error) {
                $scope.isDisabled = false;
            });
    }
    $scope.create = function () {

        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdperiod', 'add'),
            controller: 'periodCreateController',
            resolve: {}
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('periods');
            $scope.refresh();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.update = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdperiod', 'update'),
            controller: 'periodEditController',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('periods');
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
            templateUrl: mdService.buildUrl('mdperiod', 'details'),
            controller: 'periodDetailsController',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
    };

    $scope.save = function () {
        $scope.isCreateDisabled = true;
        periodService.postCreateNewPeriod(
            JSON.stringify({year:$scope.target.year}),
            function (response) {
                //Fix
                if (response) {
                    console.log('Create  Successfully!');
                    clientService.noticeAlert("Thành công", "success");
                    $scope.refresh();
                } else {
                    clientService.noticeAlert(response.message, "danger");
                }
                $scope.isCreateDisabled = false;
                //End fix
            });
    };
    filterData();
    function filterData() {
        $scope.isLoading = true;
        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        periodService.postQuery(
            JSON.stringify(postdata),
            function (response) {
                $scope.isLoading = false;
                if (response.status) {
                    $scope.data = response.data.data;
                    angular.extend($scope.paged, response.data);
                }
            });
        initCollectionYears();
    };
    function initCollectionYears() {
        
        var currentDate = new Date();
        currentYear = currentDate.getFullYear();
        $scope.collectionYears = [
            {
                text: 'Năm ' + (currentYear - 1),
                value: currentYear - 1
            },
            {
                text: 'Năm ' + currentYear,
                value: currentYear
            },
            {
                text: 'Năm ' + (currentYear + 1),
                value: (currentYear + 1)
            }
        ];
        $scope.target.year = currentYear;
    }

}]);

mdModule.controller('periodDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'periodService', 'targetData','$filter',
function ($scope, $uibModalInstance,
    mdService, periodService, targetData, $filter) {
    $scope.tempData = mdService.tempData;
    $scope.config = mdService.config;
    //$scope.target = clientService.convertFromDateNumber(targetData, ["ngayKy", "NgayThanhLy"]);
    $scope.target = targetData;
    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };

    $scope.title = function () { return 'Thông tin Kỳ khóa sổ '  ; };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

mdModule.controller('periodCreateController', [
    '$scope', '$uibModalInstance',
    'mdService', 'periodService', 'clientService',
    function ($scope, $uibModalInstance,
        mdService, periodService, clientService) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = {};

        $scope.title = function () { return 'Thêm Kỳ khóa sổ'; };

        $scope.save = function () {
            //var convertData = clientService.convertToDateNumber($scope.target, ["ToDate", "FromDate"]);
            var convertData = $scope.target;
            periodService.post(
                JSON.stringify(convertData),
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

mdModule.controller('periodEditController', [
    '$scope', '$uibModalInstance',
    'mdService', 'periodService', 'targetData', 'clientService',
    function ($scope, $uibModalInstance,
        mdService, periodService, targetData, clientService) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        //$scope.target = clientService.convertFromDateNumber(targetData, ["ngayKy", "NgayThanhLy"]);
        $scope.target = targetData;
        $scope.title = function () { return 'Cập nhập Kỳ khóa sổ '  ; };
        console.log(targetData);
        $scope.save = function () {
            periodService.update($scope.target).then(
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