
ngServices.factory('tokensManagerService', ['$http', 'configService', function ($http, configService) {

    var serviceBase = configService.rootUrlWebApi;

    var tokenManagerServiceFactory = {};

    var _getRefreshTokens = function () {

        return $http.get(serviceBase + '/refreshtokens').then(function (results) {
            return results;
        });
    };

    var _deleteRefreshTokens = function (tokenid) {

        return $http.delete(serviceBase + '/refreshtokens/?tokenid=' + tokenid).then(function (results) {
            return results;
        });
    };

    tokenManagerServiceFactory.deleteRefreshTokens = _deleteRefreshTokens;
    tokenManagerServiceFactory.getRefreshTokens = _getRefreshTokens;

    return tokenManagerServiceFactory;

}]);