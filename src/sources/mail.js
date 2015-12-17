// This datasource is responsible for emailing
var Promise = require('promise');
var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

/**
 * This is a STUB object for now. I have a hunch that I don't need Sendgrid for
 * Contact Me emails yet, but let's see
 */
var MAIL = {
}

module.exports = MAIL;
