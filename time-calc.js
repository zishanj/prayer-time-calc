(function () {
    "use strict";
    angular.module('timeCalc', [], function ($interpolateProvider) {
        $interpolateProvider.startSymbol('[{');
        $interpolateProvider.endSymbol('}]');
    })
        .controller('CtrlTimeCalc', ['$http', function ($http) {
            var timeCalc = this;
        
            timeCalc.dateAdd = function dateAdd(date, interval, units) {
                var ret = new Date(date); //don't change original date
                switch (interval.toLowerCase()) {
                    case 'year'   :  ret.setFullYear(ret.getFullYear() + units);  break;
                    case 'quarter':  ret.setMonth(ret.getMonth() + 3*units);  break;
                    case 'month'  :  ret.setMonth(ret.getMonth() + units);  break;
                    case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
                    case 'day'    :  ret.setDate(ret.getDate() + units);  break;
                    case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
                    case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
                    case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
                    default       :  ret = undefined;  break;
                }
                
                return ret;
            };
            timeCalc.parseTime = function (tmpTime) {
                var time = tmpTime.match(/(\d+)(?::(\d\d))?\s*(p?)/);
                var d = new Date();
                d.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
                d.setMinutes(parseInt(time[2]) || 0);
                d.setSeconds(0, 0);
                return d;
            };
            timeCalc.getTime = function (tmpTime) {
                var msec = tmpTime;
                var hh = Math.floor(msec / 1000 / 60 / 60);
                msec -= hh * 1000 * 60 * 60;
                var mm = Math.floor(msec / 1000 / 60);
                msec -= mm * 1000 * 60;
                var ss = Math.floor(msec / 1000);
                msec -= ss * 1000;
                return hh + ":" + mm + ":" + ss;
            };
            timeCalc.location = "lahore, pakistan";
            timeCalc.timeZone = "+5";
            timeCalc.method = "Karachi";
            
            timeCalc.change = function () {
                $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + timeCalc.location + '&key=AIzaSyCeYHbsA8mz5ll_2za73-nrvqAd2VaHvXU')
                .then(function(response) {
                    timeCalc.geoData = response.data;
                    
                    prayTimes.setMethod(timeCalc.method);
                    timeCalc.lat = timeCalc.geoData.results[0].geometry.location.lat;
                    timeCalc.lng = timeCalc.geoData.results[0].geometry.location.lng;
                    timeCalc.prayerTimes = prayTimes.getTimes(new Date(), [timeCalc.lat, timeCalc.lng], timeCalc.timeZone);
                    
                    timeCalc.timeImsak = timeCalc.prayerTimes.imsak;
                    timeCalc.timeDawn = timeCalc.prayerTimes.fajr;
                    timeCalc.timeSunrise = timeCalc.prayerTimes.sunrise;
                    timeCalc.timeZawal = timeCalc.prayerTimes.dhuhr;
                    timeCalc.timeZuhr = timeCalc.dateAdd(timeCalc.parseTime(timeCalc.timeZawal), "minute", 10).toLocaleTimeString();
                    timeCalc.timeAsr = timeCalc.prayerTimes.asr;
                    timeCalc.timeSunset = timeCalc.prayerTimes.sunset;
                    timeCalc.timeMaghrib = timeCalc.prayerTimes.maghrib;
                    timeCalc.timeIsha = timeCalc.prayerTimes.isha;


                    var dateSunrise = new Date(0, 0, 0, timeCalc.timeSunrise.split(":")[0], timeCalc.timeSunrise.split(":")[1], 0);
                    var dateSunset = new Date(0, 0, 0, timeCalc.timeSunset.split(":")[0], timeCalc.timeSunset.split(":")[1], 0);
                    var timeDiff = dateSunset.getTime() - dateSunrise.getTime();
                    var msec = timeDiff;
                    var hh = Math.floor(msec / 1000 / 60 / 60);
                    msec -= hh * 1000 * 60 * 60;
                    var mm = Math.floor(msec / 1000 / 60);
                    msec -= mm * 1000 * 60;
                    var ss = Math.floor(msec / 1000);
                    msec -= ss * 1000;
                    timeCalc.dayLength = hh + ":" + mm;

                    timeCalc.timeIshraq = timeCalc.dateAdd(timeCalc.parseTime(timeCalc.timeSunrise), "minute", 20).toLocaleTimeString();
                }, function(response) {
                    console.log(response.status);
                    console.log("Error occured");
                    return;
                });
            
                timeCalc.dayLength = "00:00:00";
                /*if (!timeCalc.timeDawn || !timeCalc.timeSunset) {
                    return;
                }*/               
                            
            };
            
            timeCalc.change();
        }]);
}());
