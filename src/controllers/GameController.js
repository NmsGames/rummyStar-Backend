const bcrypt = require('bcrypt');
const check = require('../validation/CheckValidation') 
const conn = require('../../config/db')
const moment = require('moment'); 
const {authToken} =require('../middleware/getToken')
// User login 
var nodemailer = require('nodemailer');
 
  


// List of user
const gamePlaysReport = async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT game_name.game_name,user.username ,round_report.* FROM round_report LEFT JOIN game_name ON game_name.id =round_report.game LEFT JOIN user ON user.user_id = round_report.player_id `;
            const users = await conn.query(sql)
            if(users.length>0){ 
                statusCode = 200
                message    = "success" 
                data = users
            }else{
                statusCode = 404
                message    = "User not found"
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
 
// List of user
const userGamePlaysReport = async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT game_name.game_name,user.user_id as player_id ,user.id ,user.username,user.percent,SUM(round_report.points) as total_bet,SUM(round_report.winning_amount) as total_win FROM round_report LEFT JOIN game_name ON game_name.id =round_report.game LEFT JOIN user ON user.user_id = round_report.player_id  GROUP BY round_report.player_id order by round_report.created_at DESC `;
            const users = await conn.query(sql)
            if(users.length>0){ 
                statusCode = 200
                message    = "success" 
                data = users
            }else{
                statusCode = 404
                message    = "User not found"
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
    gamePlaysReport,
    userGamePlaysReport
}