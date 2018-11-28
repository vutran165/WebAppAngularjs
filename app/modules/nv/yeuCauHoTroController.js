var yeuCauHoTroService = nvModule.factory('yeuCauHoTroService',
[
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.apiServiceBaseUri;
        var serviceUrl = rootUrl + '/api/Nv/YeuCauHoTro';

        this.parameterPrint = {};

        function getParameterPrint() {
            return this.parameterPrint;
        }

        var calc = {
            sum: function (obj, name) {
                var total = 0
                if (obj && obj.length > 0) {
                    angular.forEach(obj, function (v, k) {
                        var increase = v[name];
                        if (!increase) {
                            increase = 0;
                        }
                        total += increase;
                    });
                }
                return total;
            },
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
            postReply: function (data, callback) {
                $http.post(serviceUrl + '/PostReply/'+ data).success(callback);
            },
            postQuery: function (data, callback) {

                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            postReplyQuery: function (data, callback) {

                $http.post(serviceUrl + '/PostReplyQuery', data).success(callback);
            },
            getNewReplyInstance: function (id, callback) {
                $http.get(serviceUrl + '/GetNewReplyInstance/' + id).success(callback);
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
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            },
            getSelectHQDataForYCHT: function (callback) {
                $http.get(serviceUrl + '/GetSelectHQDataForYCHT').success(callback);
            },
            updateCT: function (params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            updateReply: function (params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
        };
        return result;

    }
]);

var YeuCauHoTroController = nvModule.controller('yeuCauHoTroController', [
    '$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
    'yeuCauHoTroService', 'configService', 'clientService', 'nvService', 'mdService', 'blockUI', 'serviceYeuCauHoTroAndMerchandise', '$mdDialog', 'clientService', 'localStorageService',
    function (
        $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
        yeuCauHoTroService, configService, clientService, nvService, mdService, blockUI, serviceYeuCauHoTroAndMerchandise, $mdDialog, clientService, localStorageService
    ) {
        $scope.config = nvService.config;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.tempData = mdService.tempData;
        console.log($scope.tempData.donViHaiQuans);
        $scope.isEditable = true;
        $scope.setPage = function (pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };
        $scope.sortType = 'iCreateDate'; // set the default sort type
        $scope.sortReverse = false; // set the default sort order
        $scope.doSearch = function () {
            $scope.paged.currentPage = 1;
            filterData();
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
                yeuCauHoTroService.deleteItem(item).then(function (data) {
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

        $scope.pageChanged = function () {
            filterData();
        };

        $scope.goHome = function () {
            $state.go('home');
        };
        $scope.refresh = function () {
            $scope.filtered.advanceData = {};
            $scope.setPage($scope.paged.currentPage);
        };
        $scope.title = function () {
            return 'Yêu cầu hỗ trợ';
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
            var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };


        $scope.create = function () {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('YeuCauHoTro', 'add'),
                controller: 'yeuCauHoTroCreateController',
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
                templateUrl: nvService.buildUrl('YeuCauHoTro', 'details'),
                controller: 'yeuCauHoTroDetailsController',
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

        $scope.sum = function () {
            var total = 0;
            if ($scope.data) {
                angular.forEach($scope.data, function (v, k) {
                    total = total + v.thanhTienSauVat;
                })
            }
            return total;
        }
        $scope.update = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('YeuCauHoTro', 'update'),
                controller: 'yeuCauHoTroEditController',
                windowClass: 'app-modal-window',
                //size:'lg',
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
        function filterData() {
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            yeuCauHoTroService.postQuery(
                JSON.stringify(postdata),
                function (response) {
                    $scope.isLoading = false;
                    if (response.status) {
                        $scope.data = response.data.data;
                        angular.extend($scope.paged, response.data);
                        //console.log($scope.paged);
                    }
                });
        };
        filterData();
    }
]);

nvModule.controller('yeuCauHoTroDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'yeuCauHoTroService', 'targetData', 'clientService', 'configService', '$filter',
function ($scope, $uibModalInstance,
    mdService, yeuCauHoTroService, targetData, clientService, configService, $filter) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Yêu cầu hỗ trợ';
    };
    fillterData();
    $scope.nameCurrency = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
    };
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
        if (data && data.length == 1) {
            return data[0].description;
        };
        return "Empty!";
    }
    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };

    function fillterData() {
        $scope.isLoading = true;

        yeuCauHoTroService.getDetails($scope.target.id, function (response) {
            if (response.status) {
                $scope.target = response.data;
            }
            $scope.isLoading = false;
            $scope.pageChanged();
        });
        yeuCauHoTroService.getSelectHQDataForYCHT(function (response) {
            $scope.customizeDonViHaiQuans = response;
        });
        console.log($scope.target);
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.pageChanged = function () {
        var currentPage = $scope.paged.currentPage;
        var itemsPerPage = $scope.paged.itemsPerPage;
    }
}
]);
nvModule.controller('yeuCauHoTroCreateController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log', 'userService',
    'nvService', 'yeuCauHoTroService', 'mdService', 'configService', 'serviceYeuCauHoTroAndMerchandise', 'focus',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log, userService,
        nvService, yeuCauHoTroService, mdService, configService, serviceYeuCauHoTroAndMerchandise, focus) {
        $scope.robot = angular.copy(yeuCauHoTroService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.newItem = {};
        $scope.target = { dataDetails: [] };
        $scope.customCode = {};


        // $scope.target.ngayCT = $filter('date')($scope.target.ngayCT, "dd/MM/yyyy");

        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
            if (data && data.length == 1) {
                return data[0].description;
            };
            return "Empty!";
        }
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.nameCurrency = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
        };


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.title = function () {
            return 'Yêu cầu hỗ trợ';
        };

        $scope.save = function () {
            $scope.Loading = true;
            yeuCauHoTroService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        $uibModalInstance.close($scope.target);
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                    $scope.Loading = false;

                }
                );
        };
        $scope.saveAndKeep = function () {
            var tempData = angular.copy($scope.target);
            yeuCauHoTroService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        yeuCauHoTroService.getNewInstance(function (response1) {
                            var expectData = response1;
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
            yeuCauHoTroService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        var url = $state.href('reportyeuCauHoTro', { id: response.id });
                        window.open(url, 'Report Viewer');
                        $uibModalInstance.close($scope.target);
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                }
                );
        }
        function filterData() {
            $scope.isLoading = true;
            yeuCauHoTroService.getNewInstance(function (response) {
                $scope.target = response;
                $scope.pageChanged();
                $scope.isLoading = false;

                //yeuCauHoTroService.getCurrentUser(function (response) {
                //    $scope.target.maDoanhNghiep = response.unitUser.id;
                //    $scope.target.maHaiQuan = response.unitUser.maHaiQuan;
                //    var data = $filter('filter')($scope.tempData.companies, { id: $scope.target.maDoanhNghiep }, true);
                //    var dataCustom = $filter('filter')($scope.tempData.donViHaiQuans, { value: $scope.target.maHaiQuan }, true);
                //    if (data && dataCustom) {
                //        $scope.target.maSoThue = data[0].value;
                //        $scope.target.tenDoanhNghiep = data[0].description;
                //        $scope.target.idHaiQuan = dataCustom[0].id;

                //    }
                //});

            });
            yeuCauHoTroService.getSelectHQDataForYCHT(function (response) {
                $scope.customizeDonViHaiQuans = response;
            });
        };
        filterData();
        $scope.pageChanged = function () {
            var currentPage = $scope.paged.currentPage;
            var itemsPerPage = $scope.paged.itemsPerPage;



        }
    }
]);
nvModule.controller('yeuCauHoTroEditController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log',
    'nvService', 'yeuCauHoTroService', 'mdService', 'targetData', 'configService', 'serviceYeuCauHoTroAndMerchandise', 'focus',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log,
        nvService, yeuCauHoTroService, mdService, targetData, configService, serviceYeuCauHoTroAndMerchandise, focus) {
        $scope.robot = angular.copy(yeuCauHoTroService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.target = targetData;
        $scope.newItem = {};
        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
            if (data && data.length == 1) {
                return data[0].description;
            };
            return "Empty!";
        }
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.nameCurrency = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.title = function () {
            return 'Yêu cầu hỗ trợ';
        };

        $scope.save = function () {
            yeuCauHoTroService.updateCT($scope.target).then(
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
                    }
                );
        };
        $scope.saveAndPrint = function () {
            yeuCauHoTroService.updateCT($scope.target).then(
                    function (response) {
                        if (response.data.status) {
                            clientService.noticeAlert("Thành công", "success");
                            console.log('Update Successfully!');
                            var url = $state.href('reportyeuCauHoTro', { id: response.data.data.id });
                            window.open(url, 'Report Viewer');
                            $uibModalInstance.close(response.data);
                        } else {
                            clientService.noticeAlert(response.data.message, "danger");
                        }
                    },
                    function (response) {
                        console.log('ERROR: Update failed! ' + response);
                    }
                );
        }
        function filterData() {
            yeuCauHoTroService.getDetails($scope.target.id, function (response) {
                if (response.data.id) {
                    $scope.target = response.data;

                    $scope.pageChanged();
                }
            });
            yeuCauHoTroService.getSelectHQDataForYCHT(function (response) {
                $scope.customizeDonViHaiQuans = response;
            });
        };
        filterData();
        $scope.pageChanged = function () {
            var currentPage = $scope.paged.currentPage;
            var itemsPerPage = $scope.paged.itemsPerPage;

        }
    }
]);
nvModule.controller('reportYeuCauHoTroController', [
    '$scope', '$filter', '$window', '$stateParams', '$timeout', '$state',
    'mdService', 'yeuCauHoTroService', 'clientService',
    function ($scope, $filter, $window, $stateParams, $timeout, $state,
        mdService, yeuCauHoTroService, clientService) {
        $scope.robot = angular.copy(yeuCauHoTroService.robot);
        var id = $stateParams.id;
        $scope.target = {};



        $scope.goIndex = function () {
            $state.go('yeuCauHoTro');
        };

        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
            if (data && data.length == 1) {
                return data[0].description;
            };
            return "Empty!";
        }


        $scope.displayWareHouse = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].description;
            }
            return "Empty!";
        };

        function filterData() {
            if (id) {
                yeuCauHoTroService.getReport(id, function (response) {

                    if (response.status) {
                        $scope.target = response.data;

                    }
                    yeuCauHoTroService.getCurrentUser(function (response) {
                        $scope.currentUser = response;
                    });

                });

            }

        };

        $scope.checkDuyet = function () {
            // console.log($scope.target.trangThai);
            if ($scope.target.trangThai == 10) {
                return false;
            } else {
                return true;
            }
        }
        $scope.goIndex = function () {
            $state.go("nvYeuCauHoTro");
        };

        $scope.nameCompany = '';

        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
            if (data && data.length == 1) {
                $scope.nameCompany = data[0].text;
                return $scope.nameCompany;
            };
            return "Empty!";
        }
        $scope.print = function () {
            var table = document.getElementById('main-report').innerHTML;
            var myWindow = $window.open('', '', 'width=800, height=600');
            myWindow.document.write(table);
            myWindow.print();
        }

        $scope.printExcel = function () {
            var data = [document.getElementById('main-report').innerHTML];
            var fileName = "YeuCauHoTro_ExportData.xls";
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



var ReplyYeuCauHoTroController = nvModule.controller('replyYeuCauHoTroController', [
    '$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
    'yeuCauHoTroService', 'configService', 'clientService', 'nvService', 'mdService', 'blockUI', 'serviceYeuCauHoTroAndMerchandise', '$mdDialog', 'clientService', 'localStorageService',
    function (
        $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
        yeuCauHoTroService, configService, clientService, nvService, mdService, blockUI, serviceYeuCauHoTroAndMerchandise, $mdDialog, clientService, localStorageService
    ) {
        $scope.config = nvService.config;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.tempData = mdService.tempData;
        console.log($scope.tempData.donViHaiQuans);
        $scope.isEditable = true;
        $scope.setPage = function (pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };
        $scope.sortType = 'iCreateDate'; // set the default sort type
        $scope.sortReverse = false; // set the default sort order
        $scope.doSearch = function () {
            $scope.paged.currentPage = 1;
            filterData();
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
                yeuCauHoTroService.deleteItem(item).then(function (data) {
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

        $scope.pageChanged = function () {
            filterData();
        };

        $scope.goHome = function () {
            $state.go('home');
        };
        $scope.refresh = function () {
            $scope.filtered.advanceData = {};
            $scope.setPage($scope.paged.currentPage);
        };
        $scope.title = function () {
            return 'Cập nhật yêu cầu hỗ trợ';
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
            var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };


        $scope.create = function (target) {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('YeuCauHoTro', 'reply-add'),
                controller: 'replyYeuCauHoTroCreateController',
                windowClass: 'app-modal-window',
                //size: 'lg',
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
                templateUrl: nvService.buildUrl('YeuCauHoTro', 'reply-details'),
                controller: 'replyYeuCauHoTroDetailsController',
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

        $scope.sum = function () {
            var total = 0;
            if ($scope.data) {
                angular.forEach($scope.data, function (v, k) {
                    total = total + v.thanhTienSauVat;
                })
            }
            return total;
        }
        $scope.update = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('YeuCauHoTro', 'reply-update'),
                controller: 'replyYeuCauHoTroEditController',
                windowClass: 'app-modal-window',
                //size:'lg',
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
        function filterData() {
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            yeuCauHoTroService.postReplyQuery(
                JSON.stringify(postdata),
                function (response) {
                    $scope.isLoading = false;
                    if (response.status) {
                        $scope.data = response.data.data;
                        angular.extend($scope.paged, response.data);
                        //console.log($scope.paged);
                    }
                });
        };
        filterData();
    }
]);

nvModule.controller('replyYeuCauHoTroDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'yeuCauHoTroService', 'targetData', 'clientService', 'configService', '$filter',
function ($scope, $uibModalInstance,
    mdService, yeuCauHoTroService, targetData, clientService, configService, $filter) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Cập nhật yêu cầu hỗ trợ';
    };
    fillterData();
    $scope.nameCurrency = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
    };
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
        if (data && data.length == 1) {
            return data[0].description;
        };
        return "Empty!";
    }
    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };

    function fillterData() {
        $scope.isLoading = true;

        yeuCauHoTroService.getDetails($scope.target.id, function (response) {
            if (response.status) {
                $scope.target = response.data;
            }
            $scope.isLoading = false;
            $scope.pageChanged();
        });
        yeuCauHoTroService.getSelectHQDataForYCHT(function (response) {
            $scope.customizeDonViHaiQuans = response;
        });
        console.log($scope.target);
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.pageChanged = function () {
        var currentPage = $scope.paged.currentPage;
        var itemsPerPage = $scope.paged.itemsPerPage;

    }
}
]);

nvModule.controller('replyYeuCauHoTroCreateController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log',
    'nvService', 'yeuCauHoTroService', 'mdService', 'targetData', 'configService', 'serviceYeuCauHoTroAndMerchandise', 'focus',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log,
        nvService, yeuCauHoTroService, mdService, targetData, configService, serviceYeuCauHoTroAndMerchandise, focus) {
        $scope.robot = angular.copy(yeuCauHoTroService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.target = targetData;
        $scope.newItem = {};
        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
            if (data && data.length == 1) {
                return data[0].description;
            };
            return "Empty!";
        }
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.nameCurrency = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.title = function () {
            return 'Cập nhật yêu cầu hỗ trợ';
        };

        $scope.save = function () {
            yeuCauHoTroService.updateReply($scope.target).then(
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
                    }
                );
        };
        $scope.saveAndPrint = function () {
            yeuCauHoTroService.updateReply($scope.target).then(
                    function (response) {
                        if (response.data.status) {
                            clientService.noticeAlert("Thành công", "success");
                            console.log('Update Successfully!');
                            var url = $state.href('reportreplyYeuCauHoTro', { id: response.data.data.id });
                            window.open(url, 'Report Viewer');
                            $uibModalInstance.close(response.data);
                        } else {
                            clientService.noticeAlert(response.data.message, "danger");
                        }
                    },
                    function (response) {
                        console.log('ERROR: Update failed! ' + response);
                    }
                );
        }
        function filterData() {
            yeuCauHoTroService.getNewReplyInstance($scope.target.id, function (response) {
                if (response.data.id) {
                    $scope.target = response.data;

                    $scope.pageChanged();
                }
            });
            yeuCauHoTroService.getSelectHQDataForYCHT(function (response) {
                $scope.customizeDonViHaiQuans = response;
            });
        };
        filterData();
        $scope.pageChanged = function () {
            var currentPage = $scope.paged.currentPage;
            var itemsPerPage = $scope.paged.itemsPerPage;

        }
    }
]);
nvModule.controller('replyYeuCauHoTroEditController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log',
    'nvService', 'yeuCauHoTroService', 'mdService', 'targetData', 'configService', 'serviceYeuCauHoTroAndMerchandise', 'focus',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log,
        nvService, yeuCauHoTroService, mdService, targetData, configService, serviceYeuCauHoTroAndMerchandise, focus) {
        $scope.robot = angular.copy(yeuCauHoTroService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.target = targetData;
        $scope.newItem = {};
        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
            if (data && data.length == 1) {
                return data[0].description;
            };
            return "Empty!";
        }
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.nameCurrency = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.title = function () {
            return 'Cập nhật yêu cầu hỗ trợ';
        };

        $scope.save = function () {
            yeuCauHoTroService.updateReply($scope.target).then(
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
                    }
                );
        };
        $scope.saveAndPrint = function () {
            yeuCauHoTroService.updateReply($scope.target).then(
                    function (response) {
                        if (response.data.status) {
                            clientService.noticeAlert("Thành công", "success");
                            console.log('Update Successfully!');
                            var url = $state.href('reportreplyYeuCauHoTro', { id: response.data.data.id });
                            window.open(url, 'Report Viewer');
                            $uibModalInstance.close(response.data);
                        } else {
                            clientService.noticeAlert(response.data.message, "danger");
                        }
                    },
                    function (response) {
                        console.log('ERROR: Update failed! ' + response);
                    }
                );
        }
        function filterData() {
            yeuCauHoTroService.getDetails($scope.target.id, function (response) {
                if (response.data.id) {
                    $scope.target = response.data;

                    $scope.pageChanged();
                }
            });
            yeuCauHoTroService.getSelectHQDataForYCHT(function (response) {
                $scope.customizeDonViHaiQuans = response;
            });
        };
        filterData();
        $scope.pageChanged = function () {
            var currentPage = $scope.paged.currentPage;
            var itemsPerPage = $scope.paged.itemsPerPage;
        }
    }
]);
nvModule.controller('reportReplyYeuCauHoTroController', [
    '$scope', '$filter', '$window', '$stateParams', '$timeout', '$state',
    'mdService', 'yeuCauHoTroService', 'clientService',
    function ($scope, $filter, $window, $stateParams, $timeout, $state,
        mdService, yeuCauHoTroService, clientService) {
        $scope.robot = angular.copy(yeuCauHoTroService.robot);
        var id = $stateParams.id;
        $scope.target = {};



        $scope.goIndex = function () {
            $state.go('replyYeuCauHoTro');
        };

        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
            if (data && data.length == 1) {
                return data[0].description;
            };
            return "Empty!";
        }


        $scope.displayWareHouse = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].description;
            }
            return "Empty!";
        };

        function filterData() {
            if (id) {
                yeuCauHoTroService.getReport(id, function (response) {

                    if (response.status) {
                        $scope.target = response.data;

                    }
                    yeuCauHoTroService.getCurrentUser(function (response) {
                        $scope.currentUser = response;
                    });

                });

            }

        };

        $scope.checkDuyet = function () {
            // console.log($scope.target.trangThai);
            if ($scope.target.trangThai == 10) {
                return false;
            } else {
                return true;
            }
        }
        $scope.goIndex = function () {
            $state.go("replyYeuCauHoTro");
        };

        $scope.nameCompany = '';

        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
            if (data && data.length == 1) {
                $scope.nameCompany = data[0].text;
                return $scope.nameCompany;
            };
            return "Empty!";
        }
        $scope.print = function () {
            var table = document.getElementById('main-report').innerHTML;
            var myWindow = $window.open('', '', 'width=800, height=600');
            myWindow.document.write(table);
            myWindow.print();
        }

        $scope.printExcel = function () {
            var data = [document.getElementById('main-report').innerHTML];
            var fileName = "ReplyYeuCauHoTro_ExportData.xls";
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

