var express = require('express');
var request = require('request');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.post('/stat/player/fortnite', function(req, res, next) {
  var userName = req.body.userId;

  const api1 = new Promise((resolve, reject) => {
    request('https://api.fortnitetracker.com/v1/profile/all/'+userName, { json: true, headers: {"TRN-Api-Key": "YOUR API KEY"} }, (err, res, body) => {
      if (err) { return console.log(err); }
      resolve(res.body);
    });
  });
  
  api1.then((value) => {
    const api2 = new Promise((resolve, reject) => {
      try {
        var userId = value.accountId.replace(/-/g, '');
        }
       catch(error) {
        console.log(error);
        res.render('error', { message: 'joueur introuvable veuillez réessayer', error: error })
      }


      request('https://fortnite-api.com/v1/stats/br/v2/'+userId, { json: true}, (err, res) => {
        resolve([res.body, value]);
          if (err) { return console.log(err); } 
          
        });
    });


    api2.then((dataapi2) =>{

      function ConvertMinutes(num){
        days = Math.floor(num/1440);
        hours = Math.floor((num%1440)/60);
        return {
            jours: days,
            heures: hours,
        };
    }
      var pseudo = dataapi2[0].data.account["name"];
      var avatarImg = dataapi2[1].avatar;
      var minutesPlayed = dataapi2[0].data.stats.all.overall.minutesPlayed;
      minutesPlayed = ConvertMinutes(minutesPlayed);
      var jours = minutesPlayed.jours;
      var heures = minutesPlayed.heures;
      var tempsDeJeuGlobal = jours+'j  '+heures+'h'
      var top1 = dataapi2[0].data.stats.all.overall.wins;
      var kills = dataapi2[0].data.stats.all.overall.kills;
      var deaths = dataapi2[0].data.stats.all.overall.deaths;
      var AllRatio = dataapi2[1].lifeTimeStats[11]["value"];
      var lvl = dataapi2[0].data.battlePass["level"];
      console.log(dataapi2[1]);
      try {
        res.render('playeurStatFortnite', {
          playerName : pseudo,
          avatarImg : avatarImg,
          AllplayTime: tempsDeJeuGlobal,
          AllTop1: top1,
          AllKill: kills,
          AllRatio: AllRatio,
          Alldeaths: deaths,
          lvl: lvl
        });
      } catch (error) {
        console.log(error);
        res.render('error', { message: 'joueur introuvable veuillez réessayer', error: error })
      }

      
      
    });
  });


});



module.exports = router;
