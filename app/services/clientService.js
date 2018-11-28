ngServices.factory('clientService', [
    '$resource', '$http', '$window', '$injector', '$rootScope', '$q',
    function ($resource, $http, $window, $injector, $rootScope, $q) {
        var result = {
            now: new Date(),
        }
        result.convertToDateNumber = function (data, arrayProper) {
            var tempData = angular.extend({}, data);
            angular.forEach(tempData, function (value, key) {
                if (arrayProper.indexOf(key) != -1) {

                    var d = new Date(tempData[key]);
                    var dateNumber = d.getTime();
                    var timeZone = d.getTimezoneOffset();

                    var finalDate = '/Date(' + dateNumber + timeZone + ')/';
                    tempData[key] = finalDate;
                }
            });
            return tempData;
        }
        result.convertFromDateNumber = function (data, arrayProper) {
            var tempData = angular.extend({}, data);
            angular.forEach(tempData, function (value, key) {
                if (arrayProper.indexOf(key) != -1) {
                    if (tempData[key]) {
                        tempData[key] = new Date(parseInt(tempData[key].replace('/Date(', '')));
                    }

                }

            });
            return tempData;
        }

        result.convertNumberToString = function (data, arrayProper) {
            var tempData = angular.extend({}, data);
            angular.forEach(tempData, function(value, key) {
            });
        }
        //funtion check grant access menu, correct : true, wrong: false;
        result.checkGrant = function (idMenu, menu) {
            var data = false;
            if (menu != null && menu.includes(idMenu)) {
                data = true;
            }
            return data;
        }
        //end check grant
        result.noticeAlert = function (_msg, _type) {
            var msgObject = { msg: _msg, type: _type }
            if (!$rootScope.noticeAlert) { $rootScope.noticeAlert = []; }
            $rootScope.noticeAlert.push(msgObject);
        }
        result.saveExcel = function (data, fileName) {
            var fileName = fileName + ".xls"
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
                var url = window.url.createObjectURL(new Blob(data, { type: filetype }));
                a.attr("href", url);
                a.attr("download", fileName);
                $("body").append(a);
                a[0].click();
                window.url.revokeObjectURL(url);
                a.remove();
            }
        }
        result.multipleUploadFile = function (moduleNameFile, url) {
            var deferred = $q.defer();
            var fileslength = document.getElementById('files').files.length;
            if (fileslength > 0) {
                var totalfile = 0;
                var progressBar = document.querySelector('progress');
                var xhr = new XMLHttpRequest();
                xhr.open('POST', url);
                var formData = new FormData();
                for (var i = 0; i < fileslength; i++) {
                    var file = document.getElementById('files').files[i];
                    if (file.size > 10485760) {
                        alert(file.name + " vượt dung lượng cho phép là 10Mb.");
                    } else {
                        formData.append(moduleNameFile + '-' + i, file);
                        totalfile++;
                    }
                }
                xhr.onload = function (e) {
                    progressBar.value = 0;
                    progressBar.textContent = progressBar.value;
                };
                xhr.upload.onprogress = function (e) {
                    if (e.lengthComputable) {
                        progressBar.value = (e.loaded / e.total) * 100;
                        progressBar.textContent = progressBar.value;
                    }
                };
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        var json = JSON.parse(xhr.responseText);
                        if (!json) {
                            deferred.reject(new Error("Có lỗi trong quá trình upload. Xin thử lại !"));
                            alert("Có lỗi trong quá trình upload. Xin thử lại !");
                        } else {
                            var dinhkem = "";
                            for (var i = 0; i < json.length; i++) {
                                if (!json[i].error) {
                                    dinhkem += moduleNameFile + "/" + json[i].data + ";";
                                } else {
                                    deferred.reject(new Error("Lỗi đính kèm file " + json[i].data));
                                    alert("Lỗi đính kèm file " + json[i].data);
                                }
                            }
                            deferred.resolve(dinhkem);
                        }
                    }
                };
                if (totalfile == fileslength) {
                    xhr.send(formData);
                }
            } else {
                alert("Bạn chưa chọn file đính kèm nào...");
            }
            return deferred.promise;
        };
        result.singleUpLoad = function (index, moduleNameFile, url) {
            var deferred = $q.defer();
            var file = index[0];
            if (file.size > 10485760) {
                alert("File có dung lượng vượt quá ngưỡng 10Mb cho phép !");
            }
            else {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', url);
                var formData = new FormData();
                formData.append(moduleNameFile + '-', file);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        var json = JSON.parse(xhr.responseText);
                        if (!json) {
                            deferred.reject(new Error("Có lỗi trong quá trình upload. Xin thử lại !"));
                            alert("Có lỗi trong quá trình upload. Xin thử lại !");
                        } else {
                            var dinhkem = "";
                            for (var i = 0; i < json.length; i++) {
                                if (!json[i].error) {
                                    dinhkem = json[i].data + ";";
                                } else {
                                    deferred.reject(new Error("Lỗi đính kèm file " + json[i].data));
                                }
                            }
                            deferred.resolve(dinhkem);

                        }
                    }
                };
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        $('.progress .progress-bar').css({
                            width: percentComplete * 100 + '%'
                        });
                        if (percentComplete === 1) {
                            //$('.progress .progress-bar').addClass('hide');
                        }
                    }
                }, false);
                xhr.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        $('.progress .progress-bar').css({
                            width: percentComplete * 100 + '%'
                        });
                    }
                }, false);
                xhr.send(formData);
            }
            //});
            return deferred.promise;
        };
        return result;
    }
]);