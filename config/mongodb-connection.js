const mongoose = require('mongoose');

mongoose
.connect('mongodb+srv://tusharmore2143:vpevT5gUwdOad7EJ@bharatyatra.u56b2.mongodb.net/')
.then(() => {
    console.log('DBConnected');    
})
.catch((err) => {
   console.log(err);  
})

module.exports = mongoose.connection