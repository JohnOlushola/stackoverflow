const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECTION, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));