const moment = require('moment');

function formatDate() {
    return moment().format('MMMM Do YYYY, h:mm:ss a');
}

module.exports = {
    formatDate: formatDate
}