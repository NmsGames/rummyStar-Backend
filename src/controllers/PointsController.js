const bcrypt = require('bcrypt');
const check = require('../validation/CheckValidation') 
const conn = require('../../config/db')
const moment = require('moment'); 
const {authToken} =require('../middleware/getToken')
// User login 
 
//create user
const sendPoints = async (req, res) => {  
    let message = null
    let statusCode = 400  
    let responseData;
    let sql =""
    let userPoints =0
    try { 
             let {distributor_id,user_id,points,pin} = req.body  
            //  user_id = user_id.toLowerCase()
            //  distributor_id = distributor_id.toLowerCase()
            let adminId = req.admin_id 
        
            if(distributor_id){
                if(points){
                    if(pin){
                        if(req.role_id == 1)
                        {
                             sql = `SELECT * FROM admin WHERE admin_id = ? limit ?`;
                             responseData = await conn.query(sql, [adminId,1])
                            if(responseData.length>0)
                            { 
                                if(responseData[0].pin == pin){ 
                                    sql = `SELECT * FROM distributor WHERE LOWER(distributor_id)= ? limit ?`;
                                    responseData = await conn.query(sql, [distributor_id.toLowerCase(),1])
                                    if(responseData.length>0)
                                    {
                                        sql = `SELECT * FROM distributor_points WHERE LOWER(distributor_id)= ? limit ?`;
                                        responseData = await conn.query(sql, [distributor_id.toLowerCase(),1])
                                       if(responseData.length>0){ 

                                           let pointss = parseInt((responseData[0].points && responseData[0].points>0?responseData[0].points:0) + points)
                                            sql    = `UPDATE distributor_points Set ? WHERE distributor_id= ?`
                                            responseData = await conn.query(sql, [{points:pointss},distributor_id]) 
                                            if(responseData){ 
                                               let pointData = { 
                                                    points,
                                                    distributor_id:distributor_id 
                                                }
                                                sql  = `INSERT INTO distributor_points_history set ?`;
                                                responseData = await conn.query(sql, pointData)
                                                if(responseData){
                                                    statusCode = 200
                                                    message    = "Points sent successfully!"
                                                }else{
                                                    statusCode = 404
                                                    message    = "Something went wrong!"
                                                } 
                                            }else{
                                                statusCode = 404
                                                message    = "Something went wrong!"
                                            }
                                       }else{
                                            sql  = `INSERT INTO distributor_points set ?`;
                                            points =parseInt(points)
                                            responseData = await conn.query(sql, {distributor_id,points})
                                            if(responseData){
                                                let pointData = { 
                                                    points,
                                                    distributor_id:distributor_id 
                                                }
                                                sql  = `INSERT INTO distributor_points_history set ?`;
                                                responseData = await conn.query(sql, pointData)
                                                if(responseData){
                                                    statusCode = 200
                                                    message    = "Points sent successfully!"
                                                }else{
                                                    statusCode = 404
                                                    message    = "Something went wrong!"
                                                }
                                            }else{
                                                statusCode = 404
                                                message    = "Something went wrong!"
                                            }
                                       }
                                        
                                    }else{
                                        statusCode = 404
                                        message    = "Please enter valid Username!"
                                    }
                                } else{
                                    statusCode = 404
                                    message    = "Please enter valid pin!"
                                }
                            }else{
                                statusCode = 404
                                message    = "Something went wrong!"
                            }
                        } 
                        else if(req.role_id == 2)
                        {
                             sql = `SELECT * FROM distributor WHERE admin_id = ? limit ?`;
                             responseData = await conn.query(sql, [adminId,1])
                            if(responseData.length>0)
                            { 
                                if(responseData[0].pin == pin)
                                { 
                                    sql = `SELECT * FROM user WHERE LOWER(user_id)= ? limit ?`;
                                    responseData = await conn.query(sql, [user_id,1])
                                    if(responseData.length>0)
                                        {sql = `SELECT * FROM user_points WHERE LOWER(user_id)= ? limit ?`;
                                        responseData = await conn.query(sql, [user_id.toLowerCase(),1])
                                        if(responseData.length>0){ 

                                                let points1 =parseInt((responseData[0].points && responseData[0].points>0?responseData[0].points:0) + points)
                                                sql    = `UPDATE user_points Set ? WHERE user_id= ?`
                                                responseData = await conn.query(sql, [{points:points1},user_id]) 
                                                if(responseData)
                                                {
                                                    let pointData = { 
                                                        points,
                                                        user_id:user_id 
                                                    }
                                                    sql  = `INSERT INTO user_points_history set ?`;
                                                    responseData = await conn.query(sql, pointData)
                                                    if(responseData){
                                                        statusCode = 200
                                                        message    = "Points sent successfully!"
                                                    }else{
                                                        statusCode = 404
                                                        message    = "Something went wrong!"
                                                    }
                                                   
                                                }else{
                                                    statusCode = 404
                                                    message    = "Something went wrong!"
                                                }
                                        }else{
                                                sql  = `INSERT INTO user_points set ?`;
                                                points =parseInt(points)
                                                responseData = await conn.query(sql, {user_id,points})
                                                if(responseData){
                                                    let pointData = { 
                                                        points,
                                                        user_id:user_id 
                                                    }
                                                    sql  = `INSERT INTO user_points_history set ?`;
                                                    responseData = await conn.query(sql, pointData)
                                                    if(responseData){
                                                        statusCode = 200
                                                        message    = "Points sent successfully!"
                                                    }else{
                                                        statusCode = 404
                                                        message    = "Something went wrong!"
                                                    }
                                                }else{
                                                    statusCode = 404
                                                    message    = "Something went wrong!"
                                                }
                                        } 
                                    }else{
                                        statusCode = 404
                                        message    = "Please enter valid Username!"
                                    }
                                } else{
                                    statusCode = 404
                                    message    = "Please enter valid pin!"
                                }
                            }else{
                                statusCode = 404
                                message    = "Something went wrong!"
                            }
                        }
                    }else{
                        statusCode = 404
                        message    = "Please enter your valid pin"
                    }
                }else{
                    statusCode = 404
                    message    = "Points is missing"
                }
            }else{
                statusCode = 404
                message    = "Username is missing"
            } 
             
              responseData = {
                status: statusCode,
                message, 
            }
            res.send(responseData) 
    } catch (error) {
          responseData = {
            status: 500,
            message:"DATabase error", 
        }
        res.status(500).send(responseData) 
    }
}
 

const getPointsRecords = async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT distributor_points_history.created_at,distributor_points_history.points,distributor.username,distributor.distributor_id  FROM distributor_points_history LEFT JOIN distributor ON distributor.distributor_id = distributor_points_history.distributor_id order by distributor_points_history.id DESC `;
            const users = await conn.query(sql)
            if(users.length>0){ 
                statusCode = 200
                message    = "success" 
                data = users
            }else{
                statusCode = 404
                message    = "No history"
            } 
            const responseData = {
                status: statusCode,
                message, 
                data
            }
            res.send(responseData)
     
    } catch (error) {
        res.status(500).send('Database error' )
    }
}

const winninigPoints = async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT avg(points) AS avg_bets, sum(points) AS play_points, sum(winning_amount) AS winning_points FROM round_report WHERE DATE(created_at) = CURDATE()`;
            const users = await conn.query(sql)
            if(users.length>0){ 
                statusCode = 200
                message    = "success" 
                data = users
            }else{
                statusCode = 404
                message    = "No Data"
            } 
            const responseData = {
                status: statusCode,
                message, 
                data
            }
            res.send(responseData)
     
    } catch (error) {
        res.status(500).send('Database error' )
    }
}
module.exports = { 
    sendPoints,
    getPointsRecords,
    winninigPoints
}