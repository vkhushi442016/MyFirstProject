let express = require('express')
let app = express();
let dotenv = require('dotenv')
dotenv.config();
let port = 5008;

let cors = require('cors')
app.use(cors())
app.use(express.json())

const route1 = require('./Route/schoolManagementRoute/schoolManagementRoute')
app.use('/', route1)

const route2 = require('./Route/loginRoute/loginRoute')
app.use('/', route2)

const route3 = require('./Route/dashboardRoute/dashboardRoute')
app.use('/', route3)

const route4 = require('./Route/staffDirectoryRoute/staffDirectoryRoute')
app.use('/', route4)

const route5 = require('./Route/syllabusTrackingRoute/syllabusTrackingRoute')
app.use('/', route5)

const route6 = require('./Route/infrastructureFacilitiesRoute/infrastructureFacilitiesRoute')
app.use('/', route6)




app.listen(port, ()=>{
    console.log("Server is running on port", port);
    
})