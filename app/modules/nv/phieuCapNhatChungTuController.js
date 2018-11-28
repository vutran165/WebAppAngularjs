var phieuCapNhatChungTuService = nvModule.factory('phieuCapNhatChungTuService',
    ['$resource', '$http', '$window', 'configService', 'clientService',
  function ($resource, $http, $window, configService, clientService) {
      var rootUrl = configService.apiServiceBaseUri;
      var serviceUrl = rootUrl + '/api/Nv/CapNhatChungTu';
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
          getMerchandiseByCode: function (code, callback) {
              $http.get(rootUrl + '/api/Md/Merchandise/GetByCode/' + code).success(callback);
          },
          postApproval: function (id, callback) {
              $http.post(serviceUrl + '/PostApproval', id).success(callback);
          },
          update: function (params) {
              return $http.put(serviceUrl + '/' + params.id, params);
          }

      };
      return result;

  }
])

nvModule.controller('phieuCapNhatChungTuController', [
'$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
'phieuCapNhatChungTuService', 'configService', 'clientService', 'nvService', 'mdService', 'blockUI', function (
    $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
phieuCapNhatChungTuService, configService, clientService, nvService, mdService, blockUI
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
        return 'Phiếu hạch toán chứng từ';
    };
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    }
    $scope.formatLabel = function (model, module, displayModel) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            displayModel = data[0].text;
            return data[0].text;
        }
        return "Empty!";
    };
    $scope.create = function () {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('nvPhieuCapNhatChungTu', 'add'),
            controller: 'phieuCapNhatChungTuCreateController',
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
            templateUrl: nvService.buildUrl('nvPhieuCapNhatChungTu', 'update'),
            controller: 'phieuCapNhatChungTuEditController',
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
    $scope.details = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('nvPhieuCapNhatChungTu', 'details'),
            controller: 'phieuCapNhatChungTuDetailsController',
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
        phieuCapNhatChungTuService.postQuery(
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
nvModule.controller('phieuCapNhatChungTuDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'phieuCapNhatChungTuService', 'targetData', 'clientService', '$filter',
function ($scope, $uibModalInstance,
    mdService, phieuCapNhatChungTuService, targetData, clientService, $filter) {

    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Phiếu hạch toán chứng từ';
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

    $scope.approval = function () {
        phieuCapNhatChungTuService.postApproval($scope.target, function (response) {
            if (response) {
                alert("Duyệt thành công!");
                fillterData();
            }
            else { alert("Thất bại! - Xảy ra lỗi hoặc phiếu này đã duyệt"); }
        });
    };

    function fillterData() {
        phieuCapNhatChungTuService.getDetails($scope.target.id, function (response) {
            if (response.status) {

                $scope.target = response.data;
            }
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);
nvModule.controller('phieuCapNhatChungTuCreateController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state',
    'nvService', 'phieuCapNhatChungTuService', 'mdService',
    function ($scope, $uibModalInstance, clientService, $filter, $state,
        nvService, phieuCapNhatChungTuService, mdService) {
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.target = { dataDetails: [] };
        $scope.countIndex = 0;
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.setIndex = function (index) {
            $scope.selectedRow = index;
        }
        $scope.removeRow = function (index) {
            $scope.target.dataDetails.splice(index, 1);
        };
        $scope.addRow = function (defaultValue) {
            var item = {
                index: $scope.countIndex,
                maHang: null,
                makhachHang: null,
                maKhoanMuc: null,
                taiKhoan: null,
                donGia: 0,
                soLuong: 0,
                soTien: 0,
            };
            if ($scope.target.dataDetails.length > 0) {
                var preItem = $scope.target.dataDetails[$scope.target.dataDetails.length - 1];
            }
            if (defaultValue) { item = defaultValue };
            $scope.target.dataDetails.push(item);
        };

        function updateSoTien() {
            $scope.target.soTien = 0;
            angular.forEach($scope.target.dataDetails, function (value, key) {
                $scope.target.soTien += value.soTien;
            })
        };
        $scope.changeSoLuong = function (item) {
            item.soTien = item.donGia * item.soLuong;
            updateSoTien();
        }
        $scope.changDonGia = function (item) {
            item.soTien = item.donGia * item.soLuong;
            updateSoTien();
        }
        $scope.updateItem = function () {
            updateSoTien();
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.title = function () {
            return 'Phiếu hạch toán chứng từ';
        };
        $scope.save = function () {
            phieuCapNhatChungTuService.post(
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
            phieuCapNhatChungTuService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        phieuCapNhatChungTuService.getNewInstance(function (response) {
                            var expectData = response;
                            tempData.maChungTu = expectData.maChungTu;
                            tempData.ngayCT = expectData.ngayCT;
                            $scope.target = tempData;
                        })
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }

                }
                );
        };
        $scope.saveAndPrint = function () {
            phieuCapNhatChungTuService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        console.log(response);
                        var url = $state.href('reportphieuCapNhatChungTu', { id: response.id });
                        window.open(url, 'Report Viewer');
                        $uibModalInstance.close($scope.target);
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                }
                );
        }
        function filterData() {
            phieuCapNhatChungTuService.getNewInstance(function (response) {
                $scope.target = response;
                if ($scope.target.dataDetails.length == 0) {
                    $scope.addRow();
                }
            })
        };
        filterData();
    }
]);
nvModule.controller('phieuCapNhatChungTuEditController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state',
    'nvService', 'phieuCapNhatChungTuService', 'mdService', 'targetData',
    function ($scope, $uibModalInstance, clientService, $filter, $state,
        nvService, phieuCapNhatChungTuService, mdService, targetData) {
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.target = targetData;
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.setIndex = function (index) {
            $scope.selectedRow = index;
        }
        $scope.removeRow = function (index) {
            $scope.target.dataDetails.splice(index, 1);
        };
        $scope.addRow = function (defaultValue) {
            var item = {
                index: $scope.countIndex,
                maHang: null,
                makhachHang: null,
                maKhoanMuc: null,
                taiKhoan: null,
                donGia: 0,
                soLuong: 0,
                soTien: 0,
            };
            if ($scope.target.dataDetails.length > 0) {
                var preItem = $scope.target.dataDetails[$scope.target.dataDetails.length - 1];
            }
            if (defaultValue) { item = defaultValue };
            $scope.target.dataDetails.push(item);
        };
        function updateSoTien() {
            $scope.target.soTien = 0;
            angular.forEach($scope.target.dataDetails, function (value, key) {
                $scope.target.soTien += value.soTien;
            })
        };
        $scope.changeSoLuong = function (item) {
            item.soTien = item.donGia * item.soLuong;
            updateSoTien();
        }
        $scope.changDonGia = function (item) {
            item.soTien = item.donGia * item.soLuong;
            updateSoTien();
        }
        $scope.updateItem = function () {
            updateSoTien();
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.title = function () {
            return 'Phiếu hạch toán chứng từ';
        };
        $scope.save = function () {
            phieuCapNhatChungTuService.update($scope.target).then(
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
        function filterData() {
            phieuCapNhatChungTuService.getDetails($scope.target.id, function (response) {
                if (response.status) {
                    $scope.target = response.data;
                    var max = 0;
                    angular.forEach($scope.target.dataDetails, function (value, key) {
                        if (value.index > max) {
                            $scope.countIndex = value.index;
                            max = value.index;
                        }
                    });
                    init();
                }
            });

        };
        function init() {
        }
        filterData();
    }
]);
nvModule.controller('reportphieuCapNhatChungTuController', ['$scope', '$window', '$stateParams', '$timeout',
'mdService', 'phieuCapNhatChungTuService', 'clientService',
function ($scope, $window, $stateParams, $timeout,
mdService, phieuCapNhatChungTuService, clientService) {
    var id = $stateParams.id;
    $scope.target = {};

    function filterData() {
        if (id) {
            phieuCapNhatChungTuService.getReport(id, function (response) {

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

