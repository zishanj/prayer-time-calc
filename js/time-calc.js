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
            //this same method can be used for multiplication
            timeCalc.timeDivision = function timeDivision(days, hours, minutes, seconds, divisor) {
                var c1 = days/divisor;
                var c2 = hours/divisor;
                var c3 = minutes/divisor;
                var c4 = seconds/divisor;
                
                if (c1 != Math.round(c1)) {
                    c2 += (c1 - Math.floor(c1)) * 24;
                    c1 = Math.floor(c1);
                }
                if (c2 != Math.round(c2)) {
                    c3 += (c2 - Math.floor(c2)) * 60;
                    c2 = Math.floor(c2);
                }
                if (c3 != Math.round(c3)) {
                    c4 += (c3 - Math.floor(c3)) * 60;
                    c3 = Math.floor(c3);
                }
                while (c4 > 59) {
                    c3 += 1;
                    c4 -= 60;
                }
                while (c3 > 59) {
                    c2 += 1;
                    c3 -= 60;
                }
                while (c2 > 23) {
                    c1 += 1;
                    c2 -= 24;
                }

                while (c4 < 0 && (c3 > 0 || c2 > 0 || c1 > 0)) {
                    c3 -= 1;
                    c4 += 60;
                }
                while (c3 < 0 && (c2 > 0 || c1 > 0)) {
                    c2 -= 1;
                    c3 += 60;
                }
                while (c2 < 0 && c1 > 0) {
                    c1 -= 1;
                    c2 += 24;
                }
                if (c1 < 0) {
                    c1 += 1;
                    c2 = -(23 - c2);
                    c3 = -(59 - c3);
                    c4 = -(60 - c4);
                    while (c4 <= -60) {
                        c4 += 60;
                        c3 -= 1;
                    }
                    while (c3 <= -60) {
                        c3 += 60;
                        c2 -= 1;
                    }
                    while (c2 <= -24) {
                        c2 += 24;
                        c1 -= 1;
                    }
                }

                while (c1 < 0 && c2 > 0) {
                    c2 -= 24;
                    c1 += 1;
                }
                while (c2 < 0 && c3 > 0) {
                    c3 -= 60;
                    c2 += 1;
                }
                while (c3 < 0 && c4 > 0) {
                    c4 -= 60;
                    c3 += 1;
                }
                c4 *= 100;
                c4 = Math.round(c4);
                c4 /= 100;
                
                return {days: c1, hours: c2, minutes: c3, seconds: c4};
            };
            // Convert a time in hh:mm format to minutes
            timeCalc.timeToMins = function timeToMins(time) {
                var b = time.split(':');
                return b[0] * 60 + +b[1];
            }

            // Convert minutes to a time in format hh:mm
            // Returned value is in range 00  to 24 hrs
            timeCalc.timeFromMins = function timeFromMins(mins) {
                function z(n) {
                    return (n < 10 ? '0' : '') + n;
                }
                var h = (mins / 60 | 0) % 24;
                var m = mins % 60;
                return z(h) + ':' + z(m);
            }
            // Add two times in hh:mm format
            timeCalc.addTimes = function addTimes(t0, t1) {
              return timeCalc.timeFromMins(timeCalc.timeToMins(t0) + timeCalc.timeToMins(t1));
            }
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
            timeCalc.formatTime = function formatTime(n) {
                return (n < 10 ? '0' : '') + n;
            }
            timeCalc.location = "lahore, pakistan";
            timeCalc.timeZone = "+5";
            timeCalc.method = "Karachi";
            timeCalc.fiqh = "Hanafi";
            
            timeCalc.change = function () {
                $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + timeCalc.location + '&key=AIzaSyCeYHbsA8mz5ll_2za73-nrvqAd2VaHvXU')
                .then(function(response) {
                    timeCalc.geoData = response.data;
                    
                    prayTimes.setMethod(timeCalc.method);
                    prayTimes.adjust({asr: timeCalc.fiqh});
                    timeCalc.lat = timeCalc.geoData.results[0].geometry.location.lat;
                    timeCalc.lng = timeCalc.geoData.results[0].geometry.location.lng;
                    timeCalc.prayerTimes = prayTimes.getTimes(new Date(), [timeCalc.lat, timeCalc.lng], timeCalc.timeZone);
                    
                    timeCalc.timeImsak = timeCalc.prayerTimes.imsak;
                    timeCalc.timeDawn = timeCalc.prayerTimes.fajr;
                    timeCalc.timeSunrise = timeCalc.prayerTimes.sunrise;
                    var ishraq = timeCalc.dateAdd(timeCalc.parseTime(timeCalc.timeSunrise), "minute", 20);
                    timeCalc.timeIshraq = timeCalc.formatTime(ishraq.getHours()) + ":" + timeCalc.formatTime(ishraq.getMinutes());
                    timeCalc.timeZawal = timeCalc.prayerTimes.dhuhr;
                    var zuhr = timeCalc.dateAdd(timeCalc.parseTime(timeCalc.timeZawal), "minute", 10);
                    timeCalc.timeZuhr = timeCalc.formatTime(zuhr.getHours()) + ":" + timeCalc.formatTime(zuhr.getMinutes());
                    timeCalc.timeAsr = timeCalc.prayerTimes.asr;
                    var preSunset = timeCalc.dateAdd(timeCalc.parseTime(timeCalc.prayerTimes.sunset), "minute", -20);
                    timeCalc.timePreSunset = timeCalc.formatTime(preSunset.getHours()) + ":" + timeCalc.formatTime(preSunset.getMinutes());
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
                    timeCalc.dayLength = timeCalc.formatTime(hh) + ":" + timeCalc.formatTime(mm);
                    
                    var timeDivision = timeCalc.timeDivision(0, hh, mm, ss, 4);
                    timeCalc.timeDuha = timeCalc.addTimes(timeCalc.timeSunrise, timeDivision.hours + ":" + timeDivision.minutes)
                    
                }, function(response) {
                    console.log(response.status);
                    console.log("Error occured");
                    return;
                });
            
                /*timeCalc.dayLength = "00:00:00";
                if (!timeCalc.timeDawn || !timeCalc.timeSunset) {
                    return;
                }*/               
                            
            };
            
            timeCalc.change();
        }]);
}());
