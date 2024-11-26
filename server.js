const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session'); //this cookie-session middleware must be added to the request lifecycle, because it has to fetch the cookies that are with sent the headers that come from the client, and parse them and also then set them on the request object.
const createError = require('http-errors'); // to handle errors in our app.
const bodyParser = require('body-parser'); //middleware used to parse POST data.

//classes of the services
const FeedbackService = require('./services/FeedbackService.js');
const SpeakersService = require('./services/SpeakerService.js');
//creating instances of those classes
const feedbackService = new FeedbackService('./data/feedback.json');
const speakerService = new SpeakersService('./data/speakers.json');

const routes = require('./routes/index.js');
const { request } = require('http');

const app = express();

const port = 3000;

app.set('trust proxy', 1); //this makes express trust cookies that are passed through a reverse proxy. If we dont have this, our whole cookie system might fail, when we deploy to production.
app.use(cookieSession({
    name: 'session',
    keys: ['uJYHFGD67hjavbd', 'FuygYFTytf45jhGhvghhZ'], //a set of keys that will be used to encrypt the cookies (we can using random strings as keys here)
}))

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs'); // tell express that ejs template engine is used. no need to import ejs. Express will automatically discover it.
app.set('views', path.join(__dirname, '/views')); // tell Express where to find the views.

app.locals.siteName = 'ROUX Meetups'; //global variables can be initialized on start of the app and made to be usable throughout the request lifecycle by defining them on the app object.

app.use(express.static(path.join(__dirname, './static')));

/*
app.use((request, response, next) => {
    response.locals.someVariable = 'hello' //we can set variables globally which can be accessed by any template in our app.
    return next();
})
*/
app.get('/throw', (request, response, next) => {
    setTimeout(() => {
        // throwing from an asynchronous invocation will crash our app.
        // throw new Error('Some error!');

        //returning a next object with the error will not crash our app.
        return next(new Error('Some error!')); 
    }, 2000);
})


app.use(async (request, response, next) => {
    try {
        const names = await speakerService.getNames();
        response.locals.speakerNames = names;
        return next();
    } catch (err) {
        return next(err); //best practice is to use try catch blocks whenever async func are used, to prevent app crash if any error is thrown.
    }
})

const route = routes({
    feedbackService,
    speakerService
}); //passing down both the feedback and speakers service instances to the routes.
app.use('/', route); //tell express to listen on "/" and catch all the routes under "/"

// app.get('/feedback', )

app.use((request, response, next) => {
    return next(createError(404,'File Not Found!'));
})

app.use((err, request, response, next) => {
    response.locals.message = err.message;
    const status = err.status || 500;
    response.locals.status = status;
    response.status(status);
    response.render('error');
})

app.listen(port, () => {
    console.log(`Express server is listening on port ${port}!`);
})