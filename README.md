# oldpix

Oldpix is a chat bot built with Hubot that gets random Library of Congress photos, based on several commands. It's designed to be used in Slack with that unfurls the resulting photos in your channel or DMs with the bot.

### Configuration

It's very basic, but if you want to use it with Slack you'll need to get a Slack API token for your slack, and if you host oldpix on Heroku put the token in the Config Vars (as HUBOT_SLACK_TOKEN) in the Settings for your app.

### Commands

 Designed for using with Slack.

**oldpix find airplane**

Find results in photo based on query term of title/subjects fields

**oldpix date 1936**

Date results in a photo based on a query for the date field. Due to inconsistencies with how LoC uses the date field, sometimes the results reflect the start/end of a date range.

**oldpix famous**

will result in one of several famous photographers (eg. Dorothea Lange) being selected at random and one of their photos is shown.

##### examples:
* oldpix find airplane
* oldpix date 1937
* oldpix famous

### Considerations

The LoC returns 20 results for each page of a query, the bot currently gets the first page of results, and a random second page (eg. page 5 with, results 100-120) and then chooses a random result from that group of 40. This is in an effort to make the results feel both relevant and random, especially if you repeatedly hit the same query. A related issue is that photographs from the same roll of film or session are grouped together in the archive, which can fill up 10 or more slots in a page of results.  
