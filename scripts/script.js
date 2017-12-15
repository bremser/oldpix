// Description:
// Oldpix finds photographs from the Library of Congress
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
// oldpix find oakland
// will search for photo with this subject in title / description
// oldpix date 1932
// finds photo to match date in date field of LoC json (also notes if date is outside range of Depression-era FSA collection)


module.exports = function(robot) {

  robot.respond(/oldpix date (.*)/i, function(msg) {
    var dateQuery;
    var locURL = 'http://www.loc.gov/pictures/search/?fo=json&fa=displayed:anywhere&fi=date&q=';
    dateQuery = escape(msg.match[1]);
    return msg.http(locURL + dateQuery).get()(function(err, res, body) {
      var image, photographer, response, date, fsaSuggest, photourl, title, pageList, whichResp;
      if (dateQuery > 1944 || dateQuery < 1935) {
        fsaSuggest = '\n (note: the depression years archive at LOC covers 1935-1944)';
      } else {
        fsaSuggest = ' ';
      };
      response = JSON.parse(body);
      var allResponses = [];
      allResponses.push(response);
      if (response.pages.total > 2) {
        var response2;
        return msg.http(locURL + dateQuery + '&sp=' + getRando(2, response.pages.total)).get()(function(err, res, body) {
          response2 = JSON.parse(body);
          allResponses.push(response2);
          let whichResp = Math.floor(Math.random() * 2);
          let rando = getRando(0, 19);

          if (allResponses[whichResp].results[rando].title !== null) {
            title = allResponses[whichResp].results[rando].title;
          } else {
            title = 'no title'
          };

          if (allResponses[whichResp].results[rando].created_published_date !== null) {
            date = allResponses[whichResp].results[rando].created_published_date;
          } else {
            date = 'no date'
          };

          if (allResponses[whichResp].results[rando].image.full !== null) {
            photourl = allResponses[whichResp].results[rando].image.full;
          } else {
            photourl = 'no photo jpeg'
          };

          if (allResponses[whichResp].results[rando].creator !== null) {
            photographer = allResponses[whichResp].results[rando].creator;
          } else {
            photographer = 'no photographer credit'
          };

          return msg.send('http:' + photourl + '\n find date: *' + dateQuery + fsaSuggest + '* \n photo date: ' + date + '   \n photo title: ' + title + '\n by: ' + fixName(photographer) + '\n more info at - http:' + allResponses[whichResp].results[rando].links.item);

        });
      } else {
        return msg.send('\n  not much turned up for: *' + dateQuery + '*');
      }
    });
  });


  robot.respond(/oldpix find (.*)/i, function(msg) {
    var photoQuery;
    var locURL = 'http://www.loc.gov/pictures/search/?fo=json&fa=displayed:anywhere&q=';
    photoQuery = escape(msg.match[1]);
    return msg.http(locURL + photoQuery).get()(function(err, res, body) {
      var image, images, photographer, response, date, photourl, title, hits;
      response = JSON.parse(body);
      var allResponses = [];
      allResponses.push(response);

      if (response.pages.total > 2) {
        var response2;
        return msg.http(locURL + photoQuery + '&sp=' + getRando(2, response.pages.total)).get()(function(err, res, body) {
          response2 = JSON.parse(body);
          allResponses.push(response2);
          let whichResp = Math.floor(Math.random() * 2);
          let rando = getRando(0, 19);

          if (allResponses[whichResp].results[rando].title !== null) {
            title = allResponses[whichResp].results[rando].title;
          } else {
            title = 'no title'
          };

          if (allResponses[whichResp].results[rando].created_published_date !== null) {
            date = allResponses[whichResp].results[rando].created_published_date;
          } else {
            date = 'no date'
          };

          if (allResponses[whichResp].results[rando].image.full !== null) {
            photourl = allResponses[whichResp].results[rando].image.full;
          } else {
            photourl = 'no photo jpeg'
          };

          if (allResponses[whichResp].results[rando].creator !== null) {
            photographer = allResponses[whichResp].results[rando].creator;
          } else {
            photographer = 'no photographer credit'
          };

          return msg.send('http:' + photourl + '\n find: *' + photoQuery + '* \n photo date: ' + date + '   \n photo title: ' + title + '\n by: ' + fixName(photographer) + '\n more info at - http:' + allResponses[whichResp].results[rando].links.item);

        });
      } else {
        return msg.send('\n  not much turned up for: *' + photoQuery + '*');
      }
    });
  });

  //
  // const famousPhotographers = {
  //   "photographers":[
  //     {"name": "Dorothea Lange",
  //      "search": "lange, dorothea"
  //     },
  //     {"name": "Russell Lee",
  //      "search": "lee, russell"
  //     },
  //     {"name": "Walker Evans",
  //      "search": "evans, walker"
  //     },
  //     {"name": "Marion Post Wolcott",
  //     "search": "wolcott, marion post"
  //     }
  //   ]
  // };
  //
  //
  //
  //  robot.hear(/oldpix famous/i, function(msg) {
  //   let rando = getRando(0,famousPhotographers.photographers.length);
  //   let famousName =  famousPhotographers.photographers[rando].name;
  //   let photoQuery = famousPhotographers.photographers[rando].search;
  //   msg.http('http://www.loc.gov/pictures/search/?fo=json&fa=displayed:anywhere&fi=contributor&q=' + photoQuery).get()(function(err, res, body) {
  //     var image, images, response, photourl, title;
  //     response = JSON.parse(body);
  //     if (response.results !== undefined) {
  //       let images = response.results;
  //       let rando = getRando(0,19);
  //       if (response.results[rando].title !== undefined) {
  //         title = response.results[rando].title;
  //       } else {title = "no title"};
  //
  //       if (response.results[rando].created_published_date !== undefined) {
  //         date = response.results[rando].created_published_date;
  //       } else {date = "no date"};
  //
  //       if (response.results[rando].image.full !== undefined) {
  //         photourl = response.results[rando].image.full;
  //       } else {photourl = "no photo jpeg"};
  //
  //       if (images.length > 0) {
  //       return msg.send( "http:" + photourl  + "\n Here's an old photo by a famous photographer named *" + famousName + "*   \n photo title: " + title  + "\n more info at - http:" + response.results[rando].links.item );
  //     }
  //     }  else { return msg.send( photoQuery  + "didn't turn anything up for some reason" );}
  //   });
  // });



  function getRando(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };


  function fixName(name) {
    if (name === undefined || name === null) {
      name = "no photographer credit"
    } else {
      comma = name.includes(",");
      if (comma === true) {
        return name = name.split(',').reverse().join(" ");
      } else {
        return name;
      }
    }
  };

};
