const express = require('express');

const speakersRoute = require('./speakers.js');
const feedbackRoute = require('./feedback.js');

const router = express.Router();

//creating a function and defining all paths inside it
module.exports = params => {
    const { speakerService } = params;
    router.get('/', async (request, response) => {
        // response.send(`Hello. This express app is running on port ${port}`);
        // response.sendFile(path.join(__dirname, '/provided/static/index.html'));

        // if(!request.session.visitCount){
        //     request.session.visitCount = 0;
        // }
        // request.session.visitCount += 1;
        // console.log(`Number of visits: ${request.session.visitCount}`)
        try {
            const topSpeakers = await speakerService.getList();
            console.log(topSpeakers);
            response.render('layout', { pageTitle: 'Welcome', template: 'index', topSpeakers });
        } catch (err) {
            return next(err);
        }

    })

    router.use('/speakers', speakersRoute(params));
    router.use('/feedback', feedbackRoute(params));

    // router.get('/speakers', (request, response) => {
    //     response.sendFile(path.join(__dirname, '/provided/static/speakers.html'));
    // })

    return router
}