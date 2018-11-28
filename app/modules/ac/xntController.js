acModule.factory('xntService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.apiServiceBaseUri;
        var serviceUrl = rootUrl + '/api/Ac/XuatNhapTon';
        var calc = {
            sum: function(obj, name) {
                var total = 0
                if (obj && obj.length > 0) {
                    angular.forEach(obj, function(v, k) {
                        var increase = v[name];
                        if (!increase) {
                            increase = 0;
                        }
                        total += increase;
                    });
                }
                return total;
            }
        }
        var result = {
            robot: calc,
            post: function (data, callback) {
                $http.post(serviceUrl + '/Post', data).success(callback);
            },
            postQuery: function (data, callback) {

                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            getDetails: function (id, callback) {
                $http.get(serviceUrl + '/GetDetails/' + id).success(callback);
            },
            postApproval: function (data, callback) {
                $http.post(serviceUrl + '/PostApproval', data).success(callback);
            },
            postInventoryReportItem: function (filter, callback) {
                $http.post(serviceUrl + '/PostReportInventoryItemBySoTK', filter).success(callback);
            },
            getNewParameter: function (callback) {
                $http.get(serviceUrl + '/GetNewParameter').success(callback);
            },
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            }
        }
        return result;
    }
]);
acModule.controller('xntController', [
    '$scope', '$rootScope', '$window', '$stateParams', '$timeout', '$sce', '$state', '$uibModal', '$log','acService',
    'mdService', 'xntService', 'clientService', 'configService', '$filter', '$mdDialog',
    function($scope, $rootScope, $window, $stateParams, $timeout, $sce, $state, $uibModal, $log,acService,
        mdService, xntService, clientService, configService, $filter, $mdDialog) {
        $scope.config = acService.config;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);
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
        $scope.goHome = function () {
            $state.go('home');
        };
        $scope.refresh = function () {
            $scope.setPage($scope.paged.currentPage);
        };
        $scope.title = function () {
            return 'Báo cáo xuất nhập tồn.';
        };
        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
            if (data && data.length == 1) {
                return data[0].text;
            };
            return code;
        }

        $scope.details = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: acService.buildUrl('XNT','details'),
                controller: 'xntDetailController',
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

        $scope.import = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: acService.buildUrl('XNT', 'import'),
                controller: 'xntImportController',
                size: 'md'
            });
            modalInstance.result.then(function (updatedData) {
                $scope.refresh();
            }, function () {
                $scope.refresh();
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.report = function () {
            $uibModal.open({
                backdrop: 'static',
                templateUrl: acService.buildUrl('XNT', 'report'),
                controller: 'xntReportController',
                size: 'md'
            });
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
                xntService.deleteItem(item).then(function (data) {
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

        function filterData() {
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            xntService.postQuery(
                JSON.stringify(postdata),
                function (response) {
                    $scope.isLoading = false;
                    if (response.status) {
                        $scope.data = response.data.data;
                        angular.extend($scope.paged, response.data);
                    }
                });
        };
        filterData();
    }
]);

acModule.controller('xntImportController', [
'$scope', '$uibModalInstance',
'mdService', 'clientService', 'configService', '$filter', 'Upload',
function ($scope, $uibModalInstance,
    mdService, clientService, configService, $filter, Upload) {
    $scope.config = mdService.config;
    $scope.title = function () {
        return 'Import Phiếu xuất nhập tồn';
    };
    $scope.import = function () {
        $scope.isLoading = true;
        if ($scope.form.file.$valid && $scope.file) {
            $scope.upload($scope.file);
        }
    };

    $scope.upload = function (file) {
        Upload.upload({
            url: configService.apiServiceBaseUri+'/api/Ac/XuatNhapTon/ImportXml',
            data: { file: file }
        }).then(function (resp) {
            $scope.isLoading = false;
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            clientService.noticeAlert("Import thành công", "success");
            $uibModalInstance.close();
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);
acModule.controller('xntReportController', [
'$scope', '$uibModalInstance',
'mdService', 'clientService', 'configService', '$filter',
function ($scope, $uibModalInstance,
    mdService, clientService, configService, $filter) {
    $scope.config = mdService.config;
    $scope.title = function () {
        return 'Báo cáo xuất nhập tồn';
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);
acModule.controller('xntDetailController', [
'$scope', '$uibModalInstance',
'mdService', 'xntService', 'targetData', 'clientService', 'configService', '$filter',
function ($scope, $uibModalInstance,
    mdService, xntService, targetData, clientService, configService, $filter) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Báo cáo xuất nhập tồn.';
    };
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        };
        return code;
    }
    function fillterData() {
        $scope.isLoading = true;
        xntService.getDetails($scope.target.id, function (response) {
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
                $scope.target.dataDetails[i].thanhTienVAT = $scope.target.dataDetails[i].thanhTien * (1 + $scope.target.dataDetails[i].tyLeVatVao / 100);
                $scope.target.dataDetails[i].giaMuaCoVat = $scope.target.dataDetails[i].giaMua * (1 + $scope.target.dataDetails[i].tyLeVatVao / 100);
                $scope.data.push($scope.target.dataDetails[i]);
            }
        }
    }

}
]);

acModule.controller('xntTheoToKhaiController', ['$scope', '$rootScope', '$window', '$stateParams', '$timeout', '$sce', '$state', '$uibModal', '$log',
'mdService', 'xntService', 'clientService', 'configService', '$filter', 'serviceInventoryAndWareHouse', 'serviceInventoryAndMerchandiseType', 'serviceInventoryAndMerchandise', 'serviceInventoryAndMerchandiseGroup',
function ($scope, $rootScope, $window, $stateParams, $timeout, $sce, $state, $uibModal, $log,
mdService, xntService, clientService, configService, $filter, serviceInventoryAndWareHouse, serviceInventoryAndMerchandiseType, serviceInventoryAndMerchandise, serviceInventoryAndMerchandiseGroup) {
    $scope.tempData = mdService.tempData;
    $scope.config = configService;
    $scope.target = {};
    $scope.goIndex = function () {
        $state.go('home');
    }

    $scope.tagMerchandises = [];

   
    //Hàng hóa
    $scope.selectMerchandise = function () {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('MdMerchandise', 'selectDataSimple'),
            controller: 'merchandiseSimpleSelectDataController',
            resolve: {
                serviceSelectData: function () {
                    return serviceInventoryAndMerchandise;
                },
                filterObject: function () {
                    return {

                    }
                }
            }
        });
        modalInstance.result.then(function (updatedData) {
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
    $scope.removeMerchandise = function (index) {
        $scope.tagMerchandises.splice(index, 1);
    }
    $scope.$watch('tagMerchandises', function (newValue, oldValue) {
        var values = $scope.tagMerchandises.map(function (element) {
            return element.value;
        })
        $scope.target.merchandiseCodes = values.join();
    }, true);

    $rootScope.$on('$locationChangeStart',
    function (event, next, current) {
        $scope.tagMerchandises.clear();
    })
    function filterData() {
        xntService.getNewParameter(function (response) {
            $scope.target = response;
        });
        $scope.tagMerchandises = serviceInventoryAndMerchandise.getSelectData();
    }
    filterData();
    $scope.report = function () {

        $state.go('xntReportTheoToKhai', { obj: $scope.target });
    }

}])
acModule.controller('xntReportTheoToKhaiController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'xntService', 'mdService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, xntService, mdService, clientService) {
    var para = $state.params.obj;
    $scope.robot = angular.copy(xntService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.goIndex = function () {
        $state.go('home');
    }
    function filterData() {
        $scope.isLoading = true;
        if (para) {
            xntService.postInventoryReportItem(para, function (response) {
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

    filterData();
}]);