const connection = require('../../Model/dbConnect')

let getEvents = (req, res) => {
    let sqlquery = 'SELECT * FROM school_events'

    connection.query(sqlquery, (error, result) => {
        if (error) {
            console.log("Error: ", error.message);
        } else {
            return res.send(result)
        }
    })
}

let postEvent = (req, res) => {
    let sqlquery = 'INSERT INTO school_events (title, event_date, event_time, color_idx) VALUES (?, ?, ?, ?)'
    let data = [req.body.title, req.body.event_date, req.body.event_time, req.body.color_idx]

    connection.query(sqlquery, data, (error, result) => {
        if (error) {
            console.log("Error: ", error.message);
        } else {
            return res.send({
                id: result.insertId,   // auto-incremented ID
                title: req.body.title,
                event_date: req.body.event_date,
                event_time: req.body.event_time,
                color_idx: req.body.color_idx});
        }
    })
}

const deleteEvent = (req, res) => {
    let query = 'DELETE FROM school_events WHERE id = ?'
    let id = req.params.id;

    connection.query(query, id, (err, result) => {
        if (err) {
            console.log("Error: ", err.message);
        }else{
            res.send(result);
        }
    })
}





module.exports = {getEvents, postEvent, deleteEvent}