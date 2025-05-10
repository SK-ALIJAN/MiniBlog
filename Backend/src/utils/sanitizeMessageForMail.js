const sanitizeHtml = require('sanitize-html');

const sanitizeMessage = (Name, Link) => {
    const safeName = sanitizeHtml(Name);
    const safeLink = sanitizeHtml(Link);

    return `<a href="${safeLink}" target="_blank">${safeName}</a>`;
};

module.exports = sanitizeMessage;
