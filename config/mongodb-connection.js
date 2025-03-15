const mongoose = require('mongoose');

mongoose
.connect('mongodb://127.0.0.1:27017/bharatYatra')
.then(() => {
    console.log('DBConnected');    
})
.catch((err) => {
   console.log(err);  
})

module.exports = mongoose.connection