let express = require('express')
let redisClient = require('./Controller/Redis/redis.js');

let app = express();
let dotenv = require('dotenv')
dotenv.config();
let port = 5008;

let cors = require('cors')
app.use(cors())
app.use(express.json())

const http = require('http');
const server = http.createServer(app); 

const socket = require('./Controller/SocketIO/SocketIO.js')
//Initialize socket
socket.init(server)

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

const route7 = require('./Route/AcademicCalendarRoute/AcademicCalendarRoute')
app.use('/', route7)

const route8 = require('./Route/principalStaffDirectoryRoute/principalStaffDirectoryRoute')
app.use('/', route8)

const route9 = require('./Route/PrincipalModuleRoute/principalDashboardRoute/principalDashboardRoute')
app.use('/', route9)

const route10 = require('./Route/PrincipalModuleRoute/principalSchoolFacilitiesRoute/principalSchoolFacilitiesRoute')
app.use('/', route10)

const route11 = require('./Route/whatsAppChatIntegrationTwilioRoute/whatsAppChatIntegrationTwilioRoute.js')
app.use('/', route11)

const route12 = require('./Route/PrincipalModuleRoute/principalClassRoute/principalClassRoute')
app.use('/', route12)

app.use('/upload', express.static('upload'));  // for multer
const route13 = require('./Route/TeacherRoutes/studentsRoute/studentsRoute')
app.use('/', route13)


const route14 = require('./Route/TeacherRoutes/trackSyllabusUpdate/trackSyllabusUpdate');
app.use('/', route14)

console.log("Reaching to the route");

const studentAttendanceRouter = require('./Route/TeacherRoutes/StudentsAttendanceRoute.js')
app.use('/', studentAttendanceRouter)

const startServer = async () => {
  try {
    
    await redisClient.connect();

    console.log("Redis connected:", redisClient.isOpen);


server.listen(port, ()=>{
    console.log("Server is running on port", port);
})

  } catch (err) {
    console.error("Startup error:", err);
  }
};

startServer();