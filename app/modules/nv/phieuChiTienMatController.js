var phieuChiTienMatService = nvModule.factory('phieuChiTienMatService',
    ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.apiServiceBaseUri;
        var serviceUrl = rootUrl + '/api/Nv/ChiTienMat';
        var result = {
            post: function (data, callback) {
                $http.post(serviceUrl + '/Post', data).success(callback)
			    .error(function (msg) {
			        clientService.noticeAlert("Lỗi không xác định", "danger");
			    });
            },
            postQuery: function (data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            getNewInstance: function (callback) {
                $http.get(serviceUrl + '/GetNewInstance').success(callback);
            },
            getDetails: function (id, callback) {
                $http.get(serviceUrl + '/GetDetails/' + id).success(callback);
            },
            getReport: function (id, callback) {
                $http.get(serviceUrl + '/GetReport/' + id).success(callback);
            },
            updateCT: function (params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            postApproval: function (data, callback) {
                $http.post(serviceUrl + '/PostApproval', data).success(callback);
            }
        };
        return result;

    }
    ])

var phieuChiTienMatController = nvModule.controller('phieuChiTienMatController', [
    '$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
    'phieuChiTienMatService', 'configService', 'clientService', 'nvService', 'mdService', 'blockUI', function (
        $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
        phieuChiTienMatService, configService, clientService, nvService, mdService, blockUI
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
            return 'Phiếu chi tiền mặt';
        };
        $scope.create = function () {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvPhieuChiTienMat', 'add'),
                controller: 'phieuChiTienMatCreateController',
                windowClass: 'app-modal-window',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.refresh();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        $scope.update = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvPhieuChiTienMat', 'update'),
                controller: 'phieuChiTienMatEditController',
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
                $log.info('Modal dismissed at:' + new Date());
            });
        }

        $scope.details = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvPhieuChiTienMat', 'details'),
                controller: 'phieuChiTienMatDetailsController',
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
            phieuChiTienMatService.postQuery(
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
nvModule.controller('phieuChiTienMatDetailsController', [
    '$scope', '$uibModalInstance',
    'mdService', 'phieuChiTienMatService', 'targetData', 'clientService', '$filter',
    function ($scope, $uibModalInstance,
        mdService, phieuChiTienMatService, targetData, clientService, $filter) {

        $scope.config = mdService.config;
        $scope.target = targetData;
        $scope.tempData = mdService.tempData;
        fillterData();
        $scope.title = function () {
            return 'Phiếu chi tiền mặt';
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

            phieuChiTienMatService.getDetails($scope.target.id, function (response) {

                if (response.status) {

                    $scope.target = response.data;
                }
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


        $scope.approval = function () {
            phieuChiTienMatService.postApproval(JSON.stringify($scope.target), function (response) {
                if (response) {

                    alert("Duyệt thành công!");
                    fillterData();
                }
                else { alert("Thất bại! - Xảy ra lỗi hoặc phiếu này đã duyệt"); }
            })
        };
    }
]);
nvModule.controller('phieuChiTienMatCreateController', [
    '$scope', '$uibModalInstance', '$filter', '$state',
    'nvService', 'phieuChiTienMatService', 'mdService', 'clientService',
    function ($scope, $uibModalInstance, $filter, $state,
        nvService, phieuChiTienMatService, mdService, clientService) {
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        console.log($scope.tempData);
        $scope.data = [];
        $scope.target = {};
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.title = function () {
            return 'Phiếu chi tiền mặt';
        };
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
                item.soTien = 0;
                item.maKhachHang = '';
                $scope.data.push(item);

            } else {
                $scope.inserted = {
                    tkNo: null,
                    makhachHang: '',
                    soTien: 0,
                };
                $scope.data.push($scope.inserted);
            }

        };
        $scope.saveAndKeep = function () {
            var tempData = angular.copy($scope.target);
            var extendData = { dataDetails: $scope.data };
            angular.extend($scope.target, extendData);
            phieuChiTienMatService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        phieuChiTienMatService.getNewInstance(function (response2) {
                            var expectData = response2;
                            tempData.maChungTu = expectData.maChungTu;
                            tempData.ngay = expectData.ngay;
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
            phieuChiTienMatService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        var url = $state.href('reportPhieuChiTienMat', { id: response.data.id });
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
        }

        $scope.save = function () {
            var extendData = { dataDetails: $scope.data };
            angular.extend($scope.target, extendData);
            phieuChiTienMatService.post(
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
        function filterData() {
            phieuChiTienMatService.getNewInstance(function (response) {

                $scope.target = response;
            })
            if ($scope.data.length == 0) {
                $scope.addRow();
            }
        };
        filterData();

    }
]);
nvModule.controller('phieuChiTienMatEditController', ['$scope', '$uibModalInstance', '$filter', '$state', 'targetData',
    'nvService', 'phieuChiTienMatService', 'mdService', 'clientService', function ($scope, $uibModalInstance, $filter,
        $state, targetData, nvService, phieuChiTienMatService, mdService, clientService) {
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.data = [];
        $scope.target = targetData;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.title = function () {
            return 'Phiếu chi tiền mặt';
        };
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.addRow = function () {
            if ($scope.data.length > 0) {
                var item = angular.copy($scope.data[0]);
                item.soTien = 0;
                item.maKhachHang = '';
                $scope.data.push(item);

            } else {
                $scope.inserted = {
                    tkNo: null,
                    makhachHang: '',
                    soTien: 0,
                };
                $scope.data.push($scope.inserted);
            }
        };
        $scope.removeRow = function (index) {
            $scope.data.splice(index, 1);
        };
        $scope.save = function () {
            phieuChiTienMatService.updateCT($scope.target).then(
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
        $scope.saveAndPrint = function () {
            phieuChiTienMatService.updateCT($scope.target).then(function (response) {
                debugger;
                if (response.data.status) {
                    clientService.noticeAlert("Thành công", "success");
                    var url = $state.href('reportPhieuChiTienMat', { id: response.data.data.id });
                    window.open(url, 'Report Viewer');
                    $uibModalInstance.close($scope.target);
                } else {
                    clientService.noticeAlert(response.data.message, "danger");
                }
            });
        };
        $scope.sum = function () {
            var total = 0;
            angular.forEach($scope.data, function (value, key) {
                console.log(value + '---' + key);
                total = total + value.soTien;
            });
            $scope.total = total;
        };
        fillterData();
        function fillterData() {
            phieuChiTienMatService.getDetails($scope.target.id, function (response) {
                if (response.status) {

                    $scope.target = response.data;
                    $scope.data = $scope.target.dataDetails;
                }
            });
        }


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }])
nvModule.controller('reportPhieuChiTienMatController', ['$scope', '$window', '$stateParams', '$timeout',
    'mdService', 'phieuChiTienMatService', 'clientService',
    function ($scope, $window, $stateParams, $timeout,
        mdService, phieuChiTienMatService, clientService) {
        var id = $stateParams.id;
        $scope.target = {};
        function filterData() {
            if (id) {
                phieuChiTienMatService.getReport(id, function (response) {
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

