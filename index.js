require('dotenv').config();
const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
let morgan = require('morgan');

const app = express();

require('./src/db')
const routes = require('./src/routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use("/", routes);

// Error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
});

//don't show the log when it is test
if(process.env.NODE_ENV !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

app.listen(process.env.PORT || 4000, () => {
    console.log(`Stackoverflow listening on port ${process.env.PORT || 4000}.`)
})

module.exports = app;