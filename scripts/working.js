robot.respond(/oldpix date (.*)/i, function(msg) {
   var photoQuery;
     photoQuery = escape(msg.match[1]);
     return msg.http('http://www.loc.gov/pictures/search/?fo=json&fa=displayed:anywhere&fi=date&q=' + photoQuery).get()(function(err, res, body) {
       var image, images, response, photographer, date, photourl, title;
       response = JSON.parse(body);
       if (response.search.hits > 2) {
         // return msg.http('http:www.loc.gov/pictures/search/?fo=json&fi=date&sp=2&fa=displayed%3Aanywhere&q=' + photoQuery).get()(function(err, res, body) {
         //
         //   responseTwo = JSON.parse(body);
         //   pageTwo = responseTwo.results.length;
         // };
         if (photoQuery > 1944 || photoQuery < 1935) { photoQuery = (photoQuery + " (note: the depression years archive at LOC covers 1935-1944)")};
         let images = response.results;
         let rando = getRando(0, response.results.length);
         if (response.results[rando].title !== null) {
           title = response.results[rando].title;
         } else {title = "(no title)"};

         if (response.results[rando].created_published_date !== null) {
           date = response.results[rando].created_published_date;
         } else {date = "(no date)"};

         if (response.results[rando].image.full !== null) {
           photourl = response.results[rando].image.full;
         } else {photourl = "(no jpeg)"};

         if (response.results[rando].creator !== null) {
           photographer = response.results[rando].creator;
         } else {photographer = "(no credit)"};
         if (images.length > 0) {
         return msg.send( "http:" + photourl + "\n find date: *" + photoQuery  + "* \n photo date: " + date + "   \n photo title: " + title + "\n by: " + fixName(photographer) + "\n more info at - http:" + response.results[rando].links.item );
       }
     }  else { return msg.send("*" + photoQuery + "*" + " - no results, try again! (sample: oldpix date 1937)" );}
     });
   });
