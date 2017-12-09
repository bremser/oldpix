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
// oldpix famous
// randomly selects one of four famous photographers from Depression-era archive and serves up a photo of theirs


module.exports = function(robot) {

     robot.respond(/oldpix date (.*)/i, function(msg) {
      var photoQuery;
      var locURL = 'http://www.loc.gov/pictures/search/?fo=json&fa=displayed:anywhere&fi=date&q=';
        photoQuery = escape(msg.match[1]);
        return msg.http(locURL + photoQuery).get()(function(err, res, body) {
          var image, images, photographer, response, date, fsaSuggest, photourl, title;
          if (photoQuery > 1944 || photoQuery < 1935) {
            let fsaSuggest = "\n (note: the depression years archive at LOC covers 1935-1944)")
          } else { let fsaSuggest = ''
          };
          response = JSON.parse(body);
          if (response.search.hits > 2) {
              // return msg.http('http://www.loc.gov/pictures/search/?fo=json&fa=displayed:anywhere&sp=2fi=date&q=' + photoQuery).get()(function(err, res, body) {
              //     var response2, title2;
              //   response2 = JSON.parse(body);
              //   title2 = response2.results[0].title;
              //
              //   });
            let images = response.results;
            let rando = getRando(0,19);
            if (response.results[rando].title !== null) {
              title = response.results[rando].title;
            } else {title = "no title"};

            if (response.results[rando].created_published_date !== null) {
              date = response.results[rando].created_published_date;
            } else {date = "no date"};

            if (response.results[rando].image.full !== null) {
              photourl = response.results[rando].image.full;
            } else {photourl = "no photo jpeg"};

            if (response.results[rando].creator !== null) {
              photographer = response.results[rando].creator;
            } else {photographer = "no photographer credit"};
            if (images.length > 0) {
            return msg.send( "http:" + photourl + "\n find date: *" + photoQuery + fsaSuggest + "* \n photo date: " + date + "   \n photo title: " + title + "\n by: " + fixName(photographer) + "\n more info at - http:" + response.results[rando].links.item);
          }
        }  else { return msg.send( "\n  not much turned up for:" photoQuery  +  );}
        });
      });


       robot.respond(/oldpix find (.*)/i, function(msg) {
            var photoQuery;
              photoQuery = escape(msg.match[1]);
              return msg.http('http://www.loc.gov/pictures/search/?fo=json&fa=displayed:anywhere&q=' + photoQuery).get()(function(err, res, body) {
                var image, images, photographer, response, date, photourl, title, hits;
                response = JSON.parse(body);
                if ( response.search.hits !== null || response.search.hits > 3 || response.results !== 'undefined' || response.results !== null) {
                  images = response.results;
                  let rando = getRando(0,19);
                  if (response.results[rando].title !== 'undefined') {
                    title = response.results[rando].title;
                  } else {title = "no title"};

                  if (response.results[rando].created_published_date !== "undefined") {
                    date = response.results[rando].created_published_date;
                  } else {date = "no date"};

                  if (response.results[rando].image.full !== undefined) {
                    photourl = response.results[rando].image.full;
                  } else {photourl = "no photo jpeg "};

                  if (response.results[rando].creator !== undefined) {
                    photographer = response.results[rando].creator;
                  } else {photographer = "no photographer credit"};
                  if (images.length > 0) {
                  return msg.send(  "http:" + photourl + "\n find: *" + photoQuery  + "* \n photo date: " + date + "   \n photo title: " + title + "\n by: " + fixName(photographer) + "\n more info at - http:" + response.results[rando].links.item );
                }
              }  else { return msg.send( photoQuery  + "- too few results for this term! try again, please." );}
              });
            });


              const famousPhotographers = {
                "photographers":[
                  {"name": "Dorothea Lange",
                   "search": "lange, dorothea"
                  },
                  {"name": "Russell Lee",
                   "search": "lee, russell"
                  },
                  {"name": "Walker Evans",
                   "search": "evans, walker"
                  },
                  {"name": "Marion Post Wolcott",
                  "search": "wolcott, marion post"
                  }
                ]
              };



               robot.hear(/oldpix famous/i, function(msg) {
                let rando = getRando(0,famousPhotographers.photographers.length);
                let famousName =  famousPhotographers.photographers[rando].name;
                let photoQuery = famousPhotographers.photographers[rando].search;
                msg.http('http://www.loc.gov/pictures/search/?fo=json&fa=displayed:anywhere&fi=contributor&q=' + photoQuery).get()(function(err, res, body) {
                  var image, images, response, photourl, title;
                  response = JSON.parse(body);
                  if (response.results !== undefined) {
                    let images = response.results;
                    let rando = getRando(0,19);
                    if (response.results[rando].title !== undefined) {
                      title = response.results[rando].title;
                    } else {title = "no title"};

                    if (response.results[rando].created_published_date !== undefined) {
                      date = response.results[rando].created_published_date;
                    } else {date = "no date"};

                    if (response.results[rando].image.full !== undefined) {
                      photourl = response.results[rando].image.full;
                    } else {photourl = "no photo jpeg"};

                    if (images.length > 0) {
                    return msg.send( "http:" + photourl  + "\n Here's an old photo by a famous photographer named *" + famousName + "*   \n photo title: " + title  + "\n more info at - http:" + response.results[rando].links.item );
                  }
                  }  else { return msg.send( photoQuery  + "didn't turn anything up for some reason" );}
                });
              });



    function getRando(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    };


    function fixName (name) {
      if (name === undefined || name === null) {
        name = "no photographer credit"
      } else {
        comma = name.includes(",");
        if (comma === true) {
          return name = name.split(',').reverse().join(" ");
        }
        else {return name;}
      }
    };

};
