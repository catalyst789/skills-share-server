const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL_ONLINE,  {
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then( () => console.log('Database Connected ..!'))
.catch( err => console.log(err));