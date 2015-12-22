angular.module('config', []).provider('configService', function(){
	var options = {};
	this.config = function(opt)
	{
		angular.extend(options, opt);
	}

	this.$get = [function () {
        if (!options) {
            throw new Error('config 로딩 실패');
        }
        return options;
    }];
});