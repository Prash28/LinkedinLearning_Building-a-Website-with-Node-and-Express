const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

//creating a function and defining all paths inside it
module.exports = params => {
    const { feedbackService } = params;


    router.get('/', async (request, response, next) => {
        try {
            const feedbacks = await feedbackService.getList();

            const errors = request.session.feedback ? request.session.feedback.errors : false;
            const successMessage = request.session.feedback ? request.session.feedback.message : false;
            request.session.feedback = {};

            // console.log(feedbacks);
            // return response.json(feedbacks);
            response.render('layout', { pageTitle: 'Feedback', template: 'feedback', feedbacks, errors, successMessage });
        } catch (err) {
            return next(err);
        }

    });

    router.post('/', [
        check('name')
            .trim()
            .isLength({ min: 3 })
            .escape()
            .withMessage('A name is required'),
        check('email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage('A valid email address is required'),
        check('title')
            .trim()
            .isLength({ min: 3 })
            .escape()
            .withMessage('A title is required'),
        check('message')
            .trim()
            .isLength({ min: 5 })
            .escape()
            .withMessage('A message is required'),
    ], async (request, response) => {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            request.session.feedback = { //new object 'feedback is created
                errors: errors.array(), //errors prop is created
            };
            return response.redirect('/feedback');
        }

        const { name, email, title, message } = request.body;
        await feedbackService.addEntry(name, email, title, message);
        request.session.feedback = {
            message: 'Thank you for your feedback'
        }
        console.log(request.body);
        return response.redirect('/feedback');
    });

    return router;
}