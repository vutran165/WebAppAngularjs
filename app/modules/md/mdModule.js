var mdModule = angular.module('mdModule', ['ui.bootstrap', 'ngFilters', 'ngServices', 'ngResource', 'blockUI', 'ngSanitize'])

mdModule.config([
    '$windowProvider', '$stateProvider', '$httpProvider', '$urlRouterProvider', '$routeProvider', '$locationProvider',
    function ($windowProvider, $stateProvider, $httpProvider, $urlRouterProvider, $routeProvider, $locationProvider) {
        var window = $windowProvider.$get('$window');

        // $routeProvider.
        // when('/home', {
        // templateUrl : moduleUrl('temp1.html'),
        // controller: 'ctrl1'
        // })
        var hostname = window.location.hostname;
        var port = window.location.port;
        var rootUrl = 'http://' + hostname + ':' + port;
        var moduleUrl = rootUrl + 'md';

        $stateProvider
                .state('mdCountry',
                    {
                        url: '/md/mdCountry',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdCountry/index.html',
                        controller: 'countryController'
                    }
                )
               .state('mdMenu',
                    {
                        url: '/md/mdMenu',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdMenu/index.html',
                        controller: 'menuController'
                    }
                )
                .state('mdShelves',
                    {
                        url: '/md/mdShelves',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdShelves/index.html',
                        controller: 'shelvesController'
                    }
                )
                .state('mdUnitUser',
                    {
                        url: '/md/mdUnitUser',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdUnitUser/index.html',
                        controller: 'unitUserController'
                    }
                )
                .state('reportDangKyKinhDoanh',
                {
                    url: '/md/mdUnitUser/reportDangKyKinhDoanh/:id',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdUnitUser/report.html',
                    controller: 'reportDangKyKinhDoanhController'
                })
                .state('mdTax',
                    {
                        url: '/md/mdTax',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdTax/index.html',
                        controller: 'taxController'
                    }
                )
                .state('mdAccount',
                    {
                        url: '/md/mdAccount',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdAccount/index.html',
                        controller: 'accountController'
                    }
                )
                  .state('mdDonViHaiQuan',
                    {
                        url: '/md/mdDonViHaiQuan',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdDonViHaiQuan/index.html',
                        controller: 'donViHaiQuanController'
                    }
                )
              .state('mdDanhSachDVKD',
                    {
                        url: '/md/mdDanhSachDVKD',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdDanhSachDVKD/index.html',
                        controller: 'danhSachDVKDController'
                    }
                )
               .state('mdDanhSachCuaHang',
                    {
                        url: '/md/mdDanhSachCuaHang',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdDanhSachCuaHang/index.html',
                        controller: 'danhSachCuaHangController'
                    }
                )
             .state('mdLoaiHinhCuaHang',
                    {
                        url: '/md/mdLoaiHinhCuaHang',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdLoaiHinhCuaHang/index.html',
                        controller: 'loaiHinhCuaHangController'
                    }
                )
                .state('mdContract',
                    {
                        url: '/md/mdContract',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdContract/index.html',
                        controller: 'contractController'
                    }
                )
             .state('mdCompany',
                    {
                        url: '/md/mdCompany',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdCompany/index.html',
                        controller: 'companyController'
                    }
                )
            .state('reportCompany', {
                url: '/md/mdCompany/getReport/:maDoanhNghiep',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/Md/MdCompany/report.html',
                controller: 'reportCompanyController'
            })
                .state('mdAccountType',
                    {
                        url: '/md/mdAccountType',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdAccountType/index.html',
                        controller: 'accountTypeController'
                    }
                )
                .state('mdVoucher',
                    {
                        url: '/md/mdVoucher',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdVoucher/index.html',
                        controller: 'voucherController'
                    }
                )
                .state('mdVoucherType',
                    {
                        url: '/md/mdVoucherType',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdVoucherType/index.html',
                        controller: 'voucherTypeController'
                    }
                )
                .state('mdBankAccount',
                    {
                        url: '/md/mdBankAccount',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdBankAccount/index.html',
                        controller: 'bankAccountController'
                    }
                )
                .state('mdCurrency',
                    {
                        url: '/md/mdCurrency',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdCurrency/index.html',
                        controller: 'currencyController'
                    }
                )
                .state('mdWareHouse',
                    {
                        url: '/md/mdWareHouse',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdWareHouse/index.html',
                        controller: 'wareHouseController'
                    }
                )
                .state('mdPackaging',
                    {
                        url: '/md/mdPackaging',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdPackaging/index.html',
                        controller: 'packagingController'
                    }
                )
                .state('mdMerchandise',
                    {
                        url: '/md/mdMerchandise',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdMerchandise/index.html',
                        controller: 'merchandiseController'
                    }
                )
                .state('mdNhomVatTu',
                    {
                        url: '/md/MdNhomVatTu',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdNhomVatTu/index.html',
                        controller: 'nhomVatTuController'
                    }
                )
                .state('mdCustomer',
                    {
                        url: '/md/mdCustomer',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdCustomer/index.html',
                        controller: 'customerController'
                    }
                )
                .state('mdMerchandiseType',
                    {
                        url: '/md/mdMerchandiseType',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdMerchandiseType/index.html',
                        controller: 'merchandiseTypeController'
                    }
                ).
                state('mdUser',
                {
                    url: 'md/mdUser',
                    templateUrl: rootUrl + '/SitePages/listuser.aspx'
                }).
                state('mdKhoanMuc',
                {
                    url: '/md/mdKhoanMuc',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdKhoanMuc/index.html',
                    controller: 'khoanMucController'
                }).
                state('mdKichHoat',
                {
                    url: '/md/mdKichHoatDangKy',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdKichHoatDangKy/index.html',
                    controller: 'kichHoatDangKyController'
                }).
                state('mdPeriod',
                {
                    url: '/md/mdPeriod',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdPeriod/index.html',
                    controller: 'periodController'
                }).
                state('mdTypeReason',
                {
                    url: '/md/mdTypeReason',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdTypeReason/index.html',
                    controller: 'typeReasonController'
                }).
                state('mdDinhMuc',
                {
                    url: '/md/mdDinhMuc',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdDinhMuc/index.html',
                    controller: 'dinhMucController'
                }).
                state('mdLoaiDoiTuong',
                {
                    url: '/md/mdLoaiDoiTuong',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdLoaiDoiTuong/index.html',
                    controller: 'loaiDoiTuongController'
                }).
                state('mdDoiTuong',
                {
                    url: '/md/mdDoiTuong',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdDoiTuong/index.html',
                    controller: 'doiTuongController'
                }).
            state('mdSellingMachine',
                {
                    url: '/md/mdSellingMachine',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdSellingMachine/index.html',
                    controller: 'sellingMachineController'
                }).
            state('reportContract',
                {
                    url: '/md/reportContract/:id',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdContract/report.html',
                    controller: "reportContractController"
                }).
            state('mdBoHang',
                {
                    url: '/md/mdBoHang',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdBoHang/index.html',
                    controller: "boHangController"
                }).
        state('mdTest',
               {
                   url: '/md/mdTest',
                   templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdTest/index.html',
                   controller: "testController"
               }).
        state('mdQuocGia',
               {
                   url: '/md/mdQuocGia',
                   templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdQuocGia/index.html',
                   controller: "quocGiaController"
               })
        .state('mdCuaHang',
               {
                   url: '/md/mdCuaHang',
                   templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdCuaHang/index.html',
                   controller: "cuaHangController"
               }).
        state('mdDonViTinh',
               {
                   url: '/md/mdDonViTinh',
                   templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdDonViTinh/index.html',
                   controller: "donViTinhController"
               }).
        state('mdNhanVien',
               {
                   url: '/md/mdNhanVien',
                   templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/mdNhanVien/index.html',
                   controller: "nhanVienController"
               })
        .state('mdUserCompany',
               {
                   url: '/md/mdUserCompany',
                   templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/mdUserCompany/index.html',
                   controller: "userCompanyController"
               })
            //Dùng xong bỏ
            .state('mdKhaiBaoDongGoi',
               {
                   url: '/md/mdKhaiBaoDongGoi',
                   templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdKhaiBaoDongGoiBaoBi/index.html',
                   controller: "khaiBaoDongGoiController"
               })
        .state('mdKhaiBaoGiaHanThoiGian',
               {
                   url: '/md/mdKhaiBaoGiaHanThoiGian',
                   templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdKhaiBaoGiaHanThoiGian/index.html',
                   controller: "khaiBaoGiaHanThoiGianController"
               })
        .state('mdKhaiBaoChuyenQuyenSh',
               {
                   url: '/md/mdKhaiBaoChuyenQuyenSh',
                   templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/MD/MdKhaiBaoChuyenQuyenSh/index.html',
                   controller: "khaiBaoChuyenQuyenShController"
               })
        ;
    }
]);


mdModule.factory('mdService', [
    '$resource', '$http', '$window', 'clientService', 'configService', 'authService',
    function ($resource, $http, $window, clientService, configService, authService) {
        var hostname = window.location.hostname;
        var port = window.location.port;
        var rootUrl = 'http://' + hostname + ':' + port;
        var serviceUrl = configService.apiServiceBaseUri;

        var result = {
            config: configService,
            client: clientService,
        };
        result.buildUrl = function (module, action) {
            return rootUrl + '/_layouts/15/BTS.SP.ERP/MD/' + module + '/' + action + '.html';
        };

        var tempData = $window.CacheManager();
        var cacheStatus = tempData.cacheStatus;
        result.cacheStatus = cacheStatus;
        result.tempData = tempData;
        result.loadDataAuth = initDataAuth;
        function initData() {
            tempData.register('donViHaiQuans', null, function () {
                return $resource(serviceUrl + '/api/Md/DonViHaiQuan/GetSelectData').query({}, isArray = true);
            });
            tempData.register('unitUsers', null, function () {
                return $resource(serviceUrl + '/api/Md/UnitUser/GetSelectData').query({}, isArray = true);
            });
            tempData.register('dsDonVis', null, function () {
                return $resource(serviceUrl + '/api/Md/DanhSachCuaHang/GetSelectData').query({}, isArray = true);
            });
        }
        function initDataAuth() {
            tempData.register('status',
                [
                    { value: 10, text: 'Hiệu lực' },
                    { value: 20, text: 'Hết hiệu lực' },
                ],
                null);
            tempData.register('sex',
              [
                  { value: 1, text: 'Nam' },
                  { value: 0, text: 'Nữ' },
              ],
              null);
            tempData.register('loaiChungTus',
                [
                    { value: "PTHU", text: 'Phiếu thu' },
                    { value: "PCHI", text: 'Phiếu chi' },
                    { value: "PUNCHI", text: 'Ủy nhiệm chi' },
                    { value: "PKHAC", text: 'Phiếu khác' },
                    { value: "NMUA", text: 'Phiếu nhập mua' },
                    { value: "XBAN", text: 'Phiếu xuất bản' },
                    { value: "DCX", text: 'Phiếu điều chuyển xuất' },
                    { value: "DCN", text: 'Phiếu điều chuyển nhập' },
                    { value: "XNVLSX", text: 'Phiếu xuất nguyên vật liệu cho sản xuất' },
                    { value: "NKTP", text: 'Nhập kho thành phẩm từ sản xuất' },
                    { value: "XKTPTC", text: 'Xuất kho thành phẩm tái chế' },
                    { value: "NHBANTL", text: 'Nhập hàng bán trả lại' },
                    { value: "TDK", text: 'Tồn đầu kỳ' }
                ],
                null);

            tempData.register('loaiTKs', [
                {
                    value: 'No',
                    text: 'Nợ'
                },
                {
                    value: 'Co',
                    text: "Có"
                }
            ], null);
            //natures
            tempData.register('natures',
                [
                    { value: 2, text: 'Dư nợ' },
                    { value: 3, text: 'Dư có' },
                    { value: 4, text: 'Lưỡng tính' },
                ], null);
            //
            tempData.register('cap',
               [
                   { value: 1, text: '1-Tổng cục' },
                   { value: 2, text: '2-Cục' },
                   { value: 3, text: '3-Chi cục' }
               ], null);
            tempData.register('typeXKs',
               [
                   { value: 0, text: 'Xuất' },
                   { value: 1, text: 'Nhập' },
               ], null);

            //
            tempData.register('donViHaiQuans', null, function () {
                return $resource(serviceUrl + '/api/Md/DonViHaiQuan/GetSelectData').query({}, isArray = true);
            });
            tempData.register('typeReasons', null, function () {
                return $resource(serviceUrl + '/api/Md/TypeReason/GetSelectData').query({}, isArray = true);
            });
            tempData.register('unitUsers', null, function () {
                return $resource(serviceUrl + '/api/Md/UnitUser/GetSelectData').query({}, isArray = true);
            });

            tempData.register('dsDonVis', null, function () {
                return $resource(serviceUrl + '/api/Md/DanhSachCuaHang/GetSelectData').query({}, isArray = true);
            });

            tempData.register('loaiHinhCuaHangs', null, function () {
                return $resource(serviceUrl + '/api/Md/LoaiHinhCuaHang/GetSelectData').query({}, isArray = true);
            });
            tempData.register('loaiDoiTuongs', null, function () {
                return $resource(serviceUrl + '/api/Md/LoaiDoiTuong/GetSelectData').query({}, isArray = true);
            });
            //tempData.register('loaiDoiTuongs', null, function () {
            //    return $resource(serviceUrl + "/api/Md/DoiTuong/GetSelectData").query({}, isArray = true);
            //});

            tempData.register('doiTuongs', null, function () {
                return $resource(serviceUrl + '/api/Md/DoiTuong/GetSelectData').query({}, isArray = true);
            });

            tempData.register('shelves', null, function () {
                return $resource(serviceUrl + '/api/Md/Shelves/GetSelectData').query({}, isArray = true);
            });
            tempData.register('accounts', null, function () {
                return $resource(serviceUrl + '/api/Md/Account/GetSelectData').query({}, isArray = true);
            });
            tempData.register('accountTypes', null, function () {
                return $resource(serviceUrl + '/api/Md/AccountType/GetSelectData').query({}, isArray = true);
            });
            tempData.register('voucherTypes', null, function () {
                return $resource(serviceUrl + '/api/Md/VoucherType/GetSelectData').query({}, isArray = true);
            });
            tempData.register('vouchers', null, function () {
                return $resource(serviceUrl + '/api/Md/Voucher/GetSelectData').query({}, isArray = true);
            });
            tempData.register('packagings', null, function () {
                return $resource(serviceUrl + '/api/Md/Packaging/GetSelectData').query({}, isArray = true);
            });
            tempData.register('currencies', null, function () {
                return $resource(serviceUrl + '/api/Md/Currency/GetSelectData').query({}, isArray = true);
            });
            tempData.register('merchandiseTypes', null, function () {
                return $resource(serviceUrl + '/api/Md/MerchandiseType/GetSelectData').query({}, isArray = true);
            });
            tempData.register('nhomVatTus', null, function () {
                return $resource(serviceUrl + '/api/Md/NhomVatTu/GetSelectData').query({}, isArray = true);
            });
            tempData.register('merchandises', null, function () {
                return $resource(serviceUrl + '/api/Md/Merchandise/GetSelectData').query({}, isArray = true);
            });
            tempData.register('customers', null, function () {
                return $resource(serviceUrl + '/api/Md/Customer/GetSelectData').query({}, isArray = true);
            });
            tempData.register('contracts', null, function () {
                return $resource(serviceUrl + '/api/Md/Contract/GetSelectData').query({}, isArray = true);
            });
            tempData.register('bankAccounts', null, function () {
                return $resource(serviceUrl + '/api/Md/BankAccount/GetSelectData').query({}, isArray = true);
            });
            tempData.register('companies', null, function () {
                return $resource(serviceUrl + '/api/Md/Company/GetSelectData').query({}, isArray = true);
            });
            tempData.register('companiesById', null, function () {
                return $resource(serviceUrl + '/api/Md/Company/GetSelectDataValueId').query({}, isArray = true);
            });
            tempData.register('companiesByIdHQ', null, function () {
                return $resource(serviceUrl + '/api/Md/Company/GetSelectDataValueIdByHQ/' + tempData.mhq).query({}, isArray = true);
            });

            tempData.register('wareHouses', null, function () {
                return $resource(serviceUrl + '/api/Md/WareHouse/GetSelectData').query({}, isArray = true);
            });

            tempData.register('khoNhans', null, function () {
                return $resource(serviceUrl + '/api/Md/WareHouse/GetSelectDataByDN/' + tempData.mdn).query({}, isArray = true);
            });
            tempData.register('unitUserNhans', null, function () {
                return $resource(serviceUrl + '/api/Md/UnitUser/GetSelectDataByDN/' + +tempData.mdn).query({}, isArray = true);
            });

            tempData.register('taxs', null, function () {
                return $resource(serviceUrl + '/api/Md/Tax/GetSelectData').query({}, isArray = true);
            });
            tempData.register('khoanMucs', null, function () {
                return $resource(serviceUrl + '/api/Md/KhoanMuc/GetSelectData').query({}, isArray = true);
            });
            tempData.register('sellingMachines', null, function () {
                return $resource(serviceUrl + '/api/Md/SellingMachine/GetSelectData').query({}, isArray = true);
            });
            tempData.register('donViTinhs', null, function () {
                return $resource(serviceUrl + '/api/Md/DonViTinh/GetSelectData').query({}, isArray = true);
            });
            tempData.register('menus', null, function () {
                return $resource(serviceUrl + '/api/Md/Menu/GetSelectData').query({}, isArray = true);
            });

        }
        if (authService.authentication.isAuth) {
            initDataAuth();
        } else {
            initData();
        }


        return result;
    }]);


mdModule.factory('serviceContractAndMerchandise', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        var urlService = configService.rootUrlWebApi;
        var serviceMerchandiseUrl = urlService + '/api/Md/Merchandise';
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);

mdModule.factory('serviceBoHangAndMerchandise', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        var urlService = configService.rootUrlWebApi;
        var serviceMerchandiseUrl = urlService + '/api/Md/Merchandise';
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);
mdModule.factory('merchandiseAndMerchandise', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        var urlService = configService.rootUrlWebApi;
        var serviceMerchandiseUrl = urlService + '/api/Md/Merchandise';
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);
