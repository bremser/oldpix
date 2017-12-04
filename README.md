# oldpix

oldpix is a chat bot built on the Hubot framework, designed to be used in Slack.


### Configuration

None, it's very basic.

### Commands

Oldpix gets random Library of Congress photos, based on several commands.

oldpix find airplane
will result in photo based on query term of title/subjects fields

oldpix date 1936
will result in a photo based on a query for the date field

oldpix famous
will result in one of several famous photographers (eg. Dorothea Lange) being selected at random and one of their photos is shown.

##### samples:
⋅⋅* oldpix find pea pickers
⋅⋅* oldpix date 1937
⋅⋅* oldpix famous

### Issues

The LoC returns 25 results for each page of a query, next version will get a random page to make it even more random when you search for the same term/date repeatedly. Queries with no results currently result in a blank/no response.
