angular.module('timeCalc', [], function($interpolateProvider) {
            $interpolateProvider.startSymbol('[{');
            $interpolateProvider.endSymbol('}]');
  })
  .controller('CtrlTimeCalc', function() {
    var timeCalc = this;
    prayTimes.setMethod('Karachi');
    timeCalc.prayerTimes = prayTimes.getTimes(new Date(), [31.5497, 74.3436], +5);
    timeCalc.timeImsak = timeCalc.prayerTimes.imsak;
    timeCalc.timeDawn = timeCalc.prayerTimes.fajr;
    timeCalc.timeSunrise = timeCalc.prayerTimes.sunrise;
    timeCalc.timeIshraq = timeCalc.getTime((new Date(timeCalc.parseTime(timeCalc.timeSunrise) + (20*60000))).getTime());
    timeCalc.timeSunset = timeCalc.prayerTimes.sunset;    
    
    timeCalc.change = function() {
      timeCalc.dayLength = "00:00:00";
      if (!timeCalc.timeDawn || !timeCalc.timeSunset)
        return;
      
      var dateDawn = new Date(0, 0, 0, timeCalc.timeDawn.split(":")[0], timeCalc.timeDawn.split(":")[1], 0);
      var dateSunset = new Date(0, 0, 0, timeCalc.timeSunset.split(":")[0], timeCalc.timeSunset.split(":")[1], 0);
      var timeDiff = dateSunset.getTime() - dateDawn.getTime();
      var msec = timeDiff;
      var hh = Math.floor(msec / 1000 / 60 / 60);
      msec -= hh * 1000 * 60 * 60;
      var mm = Math.floor(msec / 1000 / 60);
      msec -= mm * 1000 * 60;
      var ss = Math.floor(msec / 1000);
      msec -= ss * 1000;
      timeCalc.dayLength = hh + ":" + mm + ":" + ss;
    };
    timeCalc.parseTime = function(tmpTime) {
      var time = tmpTime.match(/(\d+)(?::(\d\d))?\s*(p?)/);
      var d = new Date();
      d.setHours( parseInt(time[1]) + (time[3] ? 12 : 0) );
      d.setMinutes( parseInt(time[2]) || 0 );
      d.setSeconds(0,0);
      return d.getTime();
    };
    timeCalc.getTime = function(tmpTime) {
      var hh = Math.floor(tmpTime / 1000 / 60 / 60);
      msec -= hh * 1000 * 60 * 60;
      var mm = Math.floor(msec / 1000 / 60);
      msec -= mm * 1000 * 60;
      var ss = Math.floor(msec / 1000);
      msec -= ss * 1000;
    };
  });
