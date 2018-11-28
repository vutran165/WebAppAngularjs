acModule.factory('generalJournalService', ['$resource', '$http', '$window', 'configService',
function ($resource, $http, $window, configService) {
    var rootUrl = configService.rootUrlWeb;
    var serviceUrl = rootUrl + '/_vti_bin/Apps/AC/ACService.svc';
    var result = {
        postReport: function (filter, callback) {
            $http.post(serviceUrl + '/GenerealJournalReport', filter).success(callback);
        },

                
    }
    return result;
}])


acModule.controller('generalJournalController', ['$scope', '$window', '$stateParams', '$timeout',
'mdService', 'generalJournalService', 'clientService','$filter',
function ($scope, $window, $stateParams, $timeout,
mdService, generalJournalService, clientService,$filter) {
    $scope.tempData = mdService.tempData;
    $scope.target = {};
    $scope.data = {};

    //begin pdfmake
    function buildTableBody(data) {
        var body = [];
        header = [
						{ text: 'SỐ CT', alignment: 'center', id: 'soCT' },
						{ text: 'NGÀY', alignment: 'center', id: 'ngayCT' },
						{ text: 'NỘI DUNG', alignment: 'center', id: 'NOIDUNG' },
						{ text: 'TK', alignment: 'center', id: 'TAIKHOANDOI' },
						{ text: 'NỢ', alignment: 'center', id: 'NO' },
						{ text: 'CÓ', alignment: 'center', id: 'CO' }
        ];
        body.push(header);
        angular.forEach(data, function (v, k) {
            var thongTinPhieu = [{ text: v.ChungTu.SoCT != null ? v.ChungTu.SoCT : "", alignment: "center"},
                { text: v.ChungTu.ngayCT != null ? v.ChungTu.ngayCT : "", alignment: "center" },
                { text: v.ChungTu.noiDung != null ? v.ChungTu.noiDung : "",colSpan:4 },
                "",
                "",
                ""
            ];
            body.push(thongTinPhieu);
            angular.forEach(v.ChiTiet, function (vd, kd) {
                var chiTiet = [{ text: vd.SoCT != null ? vd.SoCT : "", alignment: "center", rowSpan: 3 },
                    { text: vd.ngayCT != null ? vd.ngayCT : "", alignment: "center", rowSpan: 3 },
                    { text: vd.noiDung != null ? vd.noiDung : "" },
                    { text: vd.taiKhoan != null ? vd.taiKhoan : "", alignment: "center" },
                    { text: vd.No != null ? $filter('number')(vd.No) : "", alignment: "right" },
                    { text: vd.Co != null ? $filter('number')(vd.Co) : "", alignment: "right" }
                ];
                body.push(chiTiet);
            });
            var total = [{ text: "", colSpan: 2 },
                "",
                { text: v.Total.noiDung != null ? v.Total.noiDung : "", colSpan: 2 },
                "",
                { text: v.Total.No != null ? $filter('number')(v.Total.No) : "", alignment: "right" },
                { text: v.Total.Co != null ? $filter('number')(v.Total.Co) : "", alignment: "right" }
            ];
            body.push(total);
        });
        return body;
    }

    $scope.pdfMaker = function () {
        var convertData = clientService.convertToDateNumber($scope.target, ["TuNgay", "DenNgay"]);
        generalJournalService.postReport(
            convertData, function (response) {
                $scope.data = response;
                var dd = {
                    pageSize: 'A4',
                    pageOrientation: 'landscape',
                    pageMargins: [
                        20,
                        50,
                        20,
                        45
                    ],
                    content: [
                        {
                            text: 'Địa chỉ: '
                        },
                        {
                            text: 'Mã số thuế: '
                        },
                        {
                            text: 'Sổ nhật ký chung',
                            fontSize: 20,
                            alignment: 'center'
                        },
                        {
                            text: 'Tháng ' + $scope.data.ThangBC + ' Năm ' + $scope.data.NamBC,
                            alignment: 'center',
                            margin: [
                                10,
                                10,
                                10,
                                10
                            ]
                        },
                        {
                            table: {
                                widths: [
                                    '*',
                                    '*',
                                    250,
                                    '*',
                                    '*',
                                    '*',
                                ],
                                body: buildTableBody($scope.data.Data)
                            }
                        },
				{
				    table: {
				        widths: [
                                    '*',
                                    300,
                                    '*',
				        ],
				        body: [
                                [{
                                    text: 'Người lập', alignment: 'center', margin: [
                                    20,
                                    20,
                                    20,
                                    20
                                    ]
                                }, {
                                    text: 'Kế toán trưởng', alignment: 'center', margin: [
                                    20,
                                    20,
                                    20,
                                    20
                                    ]
                                }, {
                                    text: 'Giám đốc', alignment: 'center', margin: [
                                    20,
                                    20,
                                    20,
                                    20
                                    ]
                                }],
				        ]
				    },
				    layout: 'noBorders'
				}
                    ],
                }
                pdfMake.createPdf(dd).open("hello");
            })
    }
    //function filterData() {
    //    var convertData = clientService.convertToDateNumber($scope.target, ["TuNgay", "DenNgay"]);
    //    generalJournalService.postReport(
    //        convertData, function (response) {
    //            $scope.data = response;
    //        })
    //};

    //$scope.btnPrint = function () {
    //    filterData();
    //}

    //$scope.print = function () {
        
    //    var table = document.getElementById('tmpReport').innerHTML;
    //    var myWindow = $window.open('', '', 'width=800, height=600');
    //    myWindow.document.write(table);
    //    myWindow.print();
    //}

    //$scope.$on('$viewContentLoaded', function () {
    //    $scope.$watch('data', function (newVal, oldVal) {

    //        //Force angular not to fire script on load
    //        if (newVal != oldVal) {

    //            //Force script to run AFTER ng-repeat has rendered its things to the DOM
    //            $timeout(function () {

    //                //And finally setTimout to wait for browser to render the custom fonts for print preview
    //                setTimeout(function () {

    //                    //Print document
    //                    $scope.print();
    //                    //window.close();
    //                }, 100);
    //            }, 0);
    //        }
    //    }, true);
    //});
    //filterData();

}])