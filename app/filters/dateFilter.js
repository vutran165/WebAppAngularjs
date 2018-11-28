
ngFilters.filter("jsDate", ['$filter', function ($filter) {
    return function (input, format) {
        return (input)
               ? $filter('date')(parseInt(input.substr(6)), format)
               : '';
    };
}]);

ngFilters.filter("jsCurrency", ['$filter', function ($filter) {
    return function (input) {
        var ft = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ'];
        var sd = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
        var td = ['mười', 'mười một', 'mười hai', 'mười ba', 'mười bốn', 'mười lăm', 'mười sáu', 'mười bảy', 'mười tám', 'mười chín'];
        var fn = ['hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];

        var str = input.toString();
        str = str.replace(/[\, ]/g, '');
        if (str != parseFloat(str))
            return 'không có số này';
        var x = str.indexOf('.');
        if (x == -1) x = str.length;
        if (x > 15) return 'quá lớn';
        var n = str.split('');
        var sss = '';
        var sk = 0;
        for (var i = 0; i < x; i++) {
            if ((x - i) % 3 == 2) {
                if (n[i] == '1') {
                    sss += td[Number(n[i + 1])] + ' ';
                    i++;
                    sk = 1;
                }
                else if (n[i] != 0) {
                    sss += fn[n[i] - 2] + ' ';
                    sk = 1;
                }
            }
            else if (n[i] != 0) {
                sss += sd[n[i]] + ' ';
                if ((x - i) % 3 == 0) sss += ' trăm';
                sk = 1;
            }


            if ((x - i) % 3 == 1) {
                if (sk) sss += ft[(x - i - 1) / 3] + ' ';
                sk = 0;
            }
        }

        if (x != str.length) {
            var y = str.length;
            sss += ' đồng';
            for (var i = x + 1; i < y; i++) sss += sd[n[i]] + ' ';
        }
        return sss.replace(/\s+/g, ' ');
        console.log(sss + '  SSS');
        return sss;
    };
}]);

ngFilters.filter('uniqueItem',['$filter', function($filter) {

    return function(array, nameOfObject) {
        var output = [], keys = [];

        angular.forEach(array, function(item) {
            var key = item[nameOfObject];

            if (keys.indexOf(key) === -1) {

                keys.push(key);
                output.push(item);
            }
        });

        return output;
    }
}]);