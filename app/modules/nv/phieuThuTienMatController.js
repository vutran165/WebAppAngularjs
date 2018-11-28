var phieuThuTienMatService = nvModule.factory('phieuThuTienMatService',
    ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.apiServiceBaseUri;
        var serviceUrl = rootUrl + '/api/Nv/ThuTienMat';
        var result = {
            post: function (data, callback) {
                $http.post(serviceUrl + '/Post', data).success(callback)
            },
            postQuery: function (data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
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
            postApproval: function (data, callback) {
                $http.post(serviceUrl + '/PostApproval', data).success(callback);
            },
            updateCT: function (params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },

        };
        return result;

    }
    ])

var phieuThuTienMatController = nvModule.controller('phieuThuTienMatController', [
'$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
'phieuThuTienMatService', 'configService', 'clientService', 'nvService', 'mdService', 'blockUI', function (
    $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
phieuThuTienMatService, configService, clientService, nvService, mdService, blockUI
    ) {
    $scope.config = nvService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };
    $scope.sortType = 'maChungTu'; // set the default sort type
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
        return 'Phiếu thu tiền mặt';
    };
    $scope.update = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('nvPhieuThuTienMat', 'update'),
            controller: 'phieuThuTienMatEditController',
            windowClass: 'app-modal-window',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });

        modalInstance.result.then(function (updatedData) {
            $scope.refresh();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.create = function () {

        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('nvPhieuThuTienMat', 'add'),
            controller: 'phieuThuTienMatCreateController',
            windowClass: 'app-modal-window',
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
            templateUrl: nvService.buildUrl('nvPhieuThuTienMat', 'details'),
            controller: 'phieuThuTienMatDetailsController',
            windowClass: 'app-modal-window',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
    };

    filterData();
    function filterData() {
        $scope.isLoading = true;
        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        phieuThuTienMatService.postQuery(
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
}])
nvModule.controller('phieuThuTienMatDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'phieuThuTienMatService', 'targetData', 'clientService', '$filter',
function ($scope, $uibModalInstance,
    mdService, phieuThuTienMatService, targetData, clientService, $filter) {

    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;

    $scope.title = function () {
        return 'Phiếu thu tiền mặt';
    };

    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };
    function fillterData() {
        phieuThuTienMatService.getDetails($scope.target.id, function (response) {
            if (response.status) {
                $scope.target = response.data;
            };
        });
    };
    $scope.approval = function () {
        phieuThuTienMatService.postApproval(JSON.stringify($scope.target), function (response) {
            if (response) {
                alert("Duyệt thành công!");
                fillterData();
            }
            else { alert("Thất bại! - Xảy ra lỗi hoặc phiếu này đã duyệt"); }

        });
    };


    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    fillterData();
}
]);
nvModule.controller('phieuThuTienMatEditController', [
'$scope', '$uibModalInstance',
'mdService', 'phieuThuTienMatService', 'targetData', 'clientService', '$filter', '$state',
function ($scope, $uibModalInstance,
    mdService, phieuThuTienMatService, targetData, clientService, $filter, $state) {

    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;

    $scope.title = function () {
        return 'Phiếu thu tiền mặt';
    };

    $scope.formatLabel = function (model, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };
    $scope.removeRow = function (index) {
        $scope.data.splice(index, 1);
    };
    // add row
    $scope.addRow = function () {
        if ($scope.data.length > 0) {
            var item = angular.copy($scope.data[0]);
            item.tkCo = null;
            $scope.data.push($scope.item);
        }
        else {
            $scope.inserted = {
                tkCo: null,
                makhachHang: '',
                soTien: 0,
            };
            $scope.data.push($scope.inserted);
        };
    };
    $scope.save = function () {
        phieuThuTienMatService.updateCT($scope.target).then(
                function (response) {
                    if (response.status && response.status == 200) {
                        if (response.data.status) {
                            console.log('Create  Successfully!');
                            clientService.noticeAlert("Thành công", "success");
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
                });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveAndPrint = function () {
        phieuThuTienMatService.updateCT(
            JSON.stringify($scope.target), function (response) {
                if (response.data.status) {
                    clientService.noticeAlert("Thành công", "success");
                    console.log(response);
                    var url = $state.href('reportPhieuThuTienMat', { id: response.id });
                    window.open(url, 'Report Viewer');
                    $uibModalInstance.close($scope.target);
                } else {
                    clientService.noticeAlert(response.data.message, "danger");
                }
            }
            );
    };
    $scope.sum = function () {
        var total = 0;
        angular.forEach($scope.data, function (value, key) {
            console.log(value + '  ---' + key);
            total = total + value.soTien;
        });
        $scope.total = total;
    };
    fillterData();
    function fillterData() {
        phieuThuTienMatService.getDetails($scope.target.id, function (response) {
            if (response.status) {

                $scope.target = response.data;
                $scope.data = $scope.target.dataDetails;
            }
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);
nvModule.controller('phieuThuTienMatCreateController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state',
    'nvService', 'phieuThuTienMatService', 'mdService',
    function ($scope, $uibModalInstance, clientService, $filter, $state,
        nvService, phieuThuTienMatService, mdService) {
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.data = []
        $scope.target = {};
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.title = function () {
            return 'Phiếu thu tiền mặt';
        }
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        // remove row 
        $scope.removeRow = function (index) {
            $scope.data.splice(index, 1);
        };
        // add row
        $scope.addRow = function () {
            if ($scope.data.length > 0) {
                var item = angular.copy($scope.data[0]);
                item.tkCo = null;
                $scope.data.push(item);
            }
            else {
                $scope.inserted = {
                    tkCo: null,
                    makhachHang: '',
                    soTien: 0,
                };
                $scope.data.push($scope.inserted);
            };
        };
        $scope.save = function () {
            var extendData = { dataDetails: $scope.data };
            angular.extend($scope.target, extendData);
            phieuThuTienMatService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        $uibModalInstance.close($scope.target);
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                }
                );
        };
        $scope.saveAndKeep = function () {
            var tempData = angular.copy($scope.target);
            var extendData = { dataDetails: $scope.data };
            angular.extend($scope.target, extendData);
            phieuThuTienMatService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        phieuThuTienMatService.getNewInstance(function (response2) {
                            var expectData = response2;
                            tempData.maChungTu = expectData.maChungTu;
                            tempData.ngay = expectData.ngay;
                            $scope.target = tempData;
                        })
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                }
                );
        };

        $scope.saveAndPrint = function () {
            var extendData = { dataDetails: $scope.data };
            angular.extend($scope.target, extendData);
            phieuThuTienMatService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        console.log(response);
                        var url = $state.href('reportPhieuThuTienMat', { id: response.id });
                        window.open(url, 'Report Viewer');
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
                console.log(value + '  ---' + key);
                total = total + value.soTien;
            });
            $scope.total = total;
        };

        function filterData() {
            phieuThuTienMatService.getNewInstance(function (response) {

                $scope.target = response;
            })
            if ($scope.data.length == 0) {
                $scope.addRow();
            }
        };
        filterData();

    }
]);
nvModule.controller('reportPhieuThuTienMatController', ['$scope', '$window', '$stateParams', '$timeout',
'mdService', 'phieuThuTienMatService', 'clientService',
function ($scope, $window, $stateParams, $timeout,
mdService, phieuThuTienMatService, clientService) {
    var id = $stateParams.id;
    $scope.target = {};

    function filterData() {
        if (id) {
            phieuThuTienMatService.getReport(id, function (response) {
                if (response.status) {
                    $scope.target = response.data;
                }
            });
        }
    };

    $scope.print = function () {
        var table = document.getElementById('test').innerHTML;
        var myWindow = $window.open('', '', 'width=800, height=600');
        myWindow.document.write(table);
        myWindow.print();
    }

    $scope.$on('$viewContentLoaded', function () {
        $scope.$watch('target', function (newVal, oldVal) {

            //Force angular not to fire script on load
            if (newVal != oldVal) {

                //Force script to run AFTER ng-repeat has rendered its things to the DOM
                $timeout(function () {

                    //And finally setTimout to wait for browser to render the custom fonts for print preview
                    setTimeout(function () {

                        //Print document
                        $scope.print();
                        //window.close();
                    }, 100);
                }, 0);
            }
        }, true);
    });
    filterData();
}])
