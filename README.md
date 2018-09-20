## News Collector App
**Live demo** hosted on [Heroku](https://www.heroku.com)

Objectives:
1. Collect news articles from a specific site and place them on the page.
2. Once they are on the page, the user has the option to save an article.
3. Saved articles are viewed on their own page.

### Local Usage
In order to connect to the app, the user must visit the following link once everything is installed:
```
http://localhost:3000/
```
After the user has successfully connected to the app, they can begin collecting articles at:
```
http://localhost:3000/data
```
This will get the Title, URL and News Excerpt from the linked page.

The user can save an article they like and view all the ones they have already saved at:
```
http://localhost:3000/saved
```
The user is able to delete any articles they choose from this page as well.

### Resources used
* [NodeJS](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/)
* [ExpressJS](https://expressjs.com/)
* [HandlebarsJS](https://handlebarsjs.com/)
* [MongooseJS](https://mongoosejs.com/)
* [Bootstrap](https://getbootstrap.com/)
* [CheerioJS](https://github.com/cheeriojs/cheerio)
* [Body Parser Module](https://www.npmjs.com/package/body-parser)
* [Request Module](https://www.npmjs.com/package/request)