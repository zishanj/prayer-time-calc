angular.module('timeCalc', [])
  .controller('CtrlTimeCalc', function() {
    var timeCalc = this;
  
    timeCalc.change = function() {
      timeCalc.dayLength = "";
      if (!timeCalc.timeDawn || !timeCalc.timeSunset)
        return;
      
      var dateDawn = new Date(0, 0, 0, timeCalc.timeDawn.split(":")[0], timeCalc.timeDawn.split(":")[1], timeCalc.timeDawn.split(":")[2]);
      var dateSunset = new Date(0, 0, 0, timeCalc.timeSunset.split(":")[0], timeCalc.timeSunset.split(":")[1], timeCalc.timeSunset.split(":")[2]);
      var timeDiff = dateSunset.getTime() - dateDawn.getTime();
      var msec = timeDiff;
      var hh = Math.floor(msec / 1000 / 60 / 60);
      msec -= hh * 1000 * 60 * 60;
      var mm = Math.floor(msec / 1000 / 60);
      msec -= mm * 1000 * 60;
      var ss = Math.floor(msec / 1000);
      msec -= ss * 1000;
      timeCalc.dayLength = hh + ":" + mm + ":" + ss;
    }
  });
