const express = require('express');
const router = express.Router();

//creating a function and defining all paths inside it
module.exports = params => {
    const { speakerService } = params;

    router.get('/', async (request, response) => {
        // const speakers = await speakerService.getList();
        // return response.json(speakers)
        try{
            const speakers = await speakerService.getList();
            console.log(speakers);
            const artWorks = await speakerService.getAllArtwork();
            response.render('layout', { pageTitle: 'Speakers', template: 'speakers', speakers, artWorks });
        }catch(err){
            return next(err);
        }
    });

    router.get('/:shortname', async (request, response) => {
        try{
            const speaker = await speakerService.getSpeaker(request.params.shortname);
            console.log(speaker);
            const artWork = await speakerService.getArtworkForSpeaker(request.params.shortname);
            console.log(artWork);
            response.render('layout', { pageTitle: 'Speaker Details', template: 'speakerDetails', speaker, artWork });
            // return response.send(`Detail page of ${request.params.speakername}`);            
        }catch(err){
            return next(err);
        }
        
    });

    return router;
}