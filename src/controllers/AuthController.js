const bcrypt = require('bcrypt');
const check = require('../validation/CheckValidation') 
const conn = require('../../config/db')
const moment = require('moment'); 
const {authToken} =require('../middleware/getToken')
// User login 
var nodemailer = require('nodemailer');
const e = require('express');

const authLogin = async (req, res) => {
    let message = null
    let statusCode = 400
    let error = {}
    let data = {} 
    let token ;
    try { 
        const errors = check.resultsValidator(req)
        if (errors.length > 0) {
            return res.status(400).json({
                method: req.method,
                status: res.statusCode,
                error: errors
            })
        } else { 
            // Check requeted user is exist or not
            const {username,email,password} = req.body
            let sql = `SELECT * FROM admin INNER JOIN roles ON roles.role_id = admin.role_id WHERE LOWER(admin.email)= ? OR admin.username = ? limit ?`;
            let user = await conn.query(sql, [email.toLowerCase(),username, 1]);
            if (user.length > 0) { 
                const usersRows = (JSON.parse(JSON.stringify(user))[0]);
                const comparison = await bcrypt.compare(password, usersRows.password)
                if (comparison) { 
                    const last_login = moment().format("YYYY-MM-DD HH:mm:ss"); 
                    statusCode = 200
                    message = 'Login success'
                    data = {
                        user_id: usersRows.admin_id,
                        role_id :usersRows.role_id,
                        role_name :usersRows.name,
                        username:usersRows.username,  
                    }
                    let auth ={
                        id: usersRows.admin_id,
                        user_id: usersRows.admin_id,
                        role_id :usersRows.role_id,
                        role_name :usersRows.name,  
                    }
                    const tokens = await authToken(auth);
                    token = tokens

                } else {
                    statusCode = 401
                    message = 'Password does not match!'
                    error.password = "err"
                }
            } else {
                  // check user
                  let sql = `SELECT * FROM distributor INNER JOIN roles ON roles.role_id = distributor.role_id WHERE distributor.distributor_id= ? limit ?`;
                  const users = await conn.query(sql, [username,1])
                  if(users.length>0){
                    const usersRows = (JSON.parse(JSON.stringify(users))[0]);
                    const comparison = await bcrypt.compare(password, usersRows.password)
                    if (comparison) {
                         if(usersRows.IsBlocked !==1){
                            const LastLoggedIn = moment().format("YYYY-MM-DD HH:mm:ss"); 
                            statusCode = 200
                            message = 'Login success'
                            data = {
                                user_id: usersRows.id,
                                role_id :usersRows.role_id,
                                role_name:usersRows.name,
                                username:usersRows.username?usersRows.username:`Guest00${usersRows.id}`, 
                            }
                            let auth ={
                                id: usersRows.id,
                                user_id: usersRows.distributor_id,
                                role_id :usersRows.role_id,
                                role_name :usersRows.name,  
                            }
                            const tokens = await authToken(auth);
                            sql = "UPDATE distributor Set ? WHERE id= ?"
                            await conn.query(sql, [{LastLoggedIn},usersRows.id])
                            token = tokens
                         }else{
                            statusCode = 401
                            message = 'Account is blocked'
                            data = {
                               
                            }
                         } 
                    } else {
                        statusCode = 401
                        message = 'Password does not match!'
                        error.password = "err"
                    }
                  }else{
                    // check user
                    let sql = `SELECT * FROM user INNER JOIN roles ON roles.role_id = user.role_id WHERE user.user_id= ? limit ?`;
                    const users = await conn.query(sql, [username,1])
                    if(users.length>0){
                        const usersRows = (JSON.parse(JSON.stringify(users))[0]);
                        const comparison = await bcrypt.compare(password, usersRows.password)
                        if (comparison) { 
                            if(usersRows.IsBlocked !==1){
                                const last_logged_in = moment().format("YYYY-MM-DD HH:mm:ss"); 
                                statusCode = 200
                                message = 'Login success'
                                data = {
                                    user_id: usersRows.id,
                                    role_id :usersRows.role_id,
                                    role_name :usersRows.name,
                                    username:usersRows.username?usersRows.username:`Guest00${usersRows.id}`, 
                                }
                                let auth ={
                                    id: usersRows.id,
                                    user_id: usersRows.user_id,
                                    role_id :usersRows.role_id,
                                    role_name :usersRows.name,  
                                }
                                const tokens = await authToken(auth);
                                sql = "UPDATE user Set ? WHERE id= ?"
                                await conn.query(sql, [{last_logged_in},usersRows.id])
                                token = tokens
                             }else{
                                statusCode = 401
                                message = 'Account is blocked'
                                data = {
                                   
                                }
                             } 
                           
        
                        } else {
                            statusCode = 401
                            message = 'Password does not match!'
                            error.password = "err"
                        }
                    }else{
                        statusCode = 404
                        message = 'User not exist' 
                    }
                  }
              
            }
            const responseData = {
                status: statusCode,
                message,
                token,
                user: data,
                errors: error
            }
            res.send(responseData)
        }
    } catch (error) {
        res.send({ authLogin: error })
    }
}
 
// User SignUP
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
const authSignUp = async (req, res) => {
    let message = null
    let statusCode = 400  
    try {
        const errors = check.resultsValidator(req)
        if (errors.length > 0) {
            return res.status(400).json({
                method: req.method,
                status: res.statusCode,
                error: errors
            })
        } else {
            const confirm_password = req.body.confirm_password
            const encryptedPassword = await bcrypt.hash(req.body.password, 10) 
           const username =  makeid(8);
            const formData = { 
                username:username,
                email   : req.body.email,
                role_id : 3,
                password: encryptedPassword
            };
            if(confirm_password !== req.body.password){
                message     = 'Confirm password does not match'
                statusCode  = 401
            }else{
                // Check requeted user is exist or not
                let sql = `SELECT * FROM users WHERE LOWER(email)= ? limit ?`;
                let user = await conn.query(sql, [formData.email.toLowerCase(), 1]);
                if (user.length > 0) {
                    statusCode  = 401
                    message     = 'Sorry! Email already exist try another email' 
                } else { 
                   const sql1  = `INSERT INTO users set ?`;
                   const users = await conn.query(sql1, formData)
                    if(users){
                        statusCode = 201
                        message = "User created success"
                    }else{
                        statusCode = 500
                        message = "Something went wrong! database error"
                    } 
                }
            } 
            const responseData = {
                status: statusCode,
                message, 
            }
            res.send(responseData)
        }
    } catch (error) {
        res.send({ error: error })
    }
}
const forgotPassword = async (req, res) => {
    // let message = null
    // let statusCode = 400  
    // let data = {}
    // try {  
    //     const transporter = nodemailer.createTransport({
    //         service: 'gmail',
    //         auth: {
    //           user: 'rajendra@nmsgames.com',
    //           pass: 'lyszrpneixiqhpxv',
    //         },
    //       });
    //     const errors = check.resultsValidator(req)
    //     if (errors.length > 0) {
    //         return res.status(400).json({
    //             method: req.method,
    //             status: res.statusCode,
    //             error: errors
    //         })
    //     } else {
    //         const { email } = req.body 
    //             let sql = `SELECT * FROM users WHERE LOWER(email)= ? limit ?`;
    //             let user = await conn.query(sql, [email.toLowerCase(), 1]); 
    //             if (user.length > 0) {
    //                 const otp =  Math.floor(1000 + Math.random() * 9999);
    //                 const last_minute = moment().format("YYYY-MM-DD HH:mm:ss");
    //                 //Sent mail
    //                 transporter.sendMail({
    //                     from: '"Zynga Poker OTP!" <rajendra@nmsgames.com>', // sender address
    //                     to: email, // list of receivers
    //                     subject: "OTP Verfications", // Subject line 
    //                     html: `<b>The OTP is ${otp}. <br>This OTP generated at ${last_minute} and valid for 5 Minutes.</b>`, // html body
    //                   }).then(info => {
    //                     console.log({info});
    //                   }).catch(console.error);
    //                 const formData = { 
    //                     otp : otp,
    //                     otp_time:last_minute
    //                 };
    //                 let sql1 = "UPDATE users Set ? WHERE email= ?"
    //                 await conn.query(sql1, [formData,email])
    //                 statusCode  = 200
    //                 message     = 'Otp have sent on your registered email!'
    //                 const usersRows = (JSON.parse(JSON.stringify(user))[0]);  
    //                 data ={
    //                     user_id     : usersRows.user_id, 
    //                     email       : usersRows.email,
    //                     phone       : usersRows.phone, 
    //                 } 

    //             } else {  
    //                 statusCode  = 404
    //                 message     = 'Sorry! Email does not exist!'  
    //             }   
    //         const responseData = {
    //             status: statusCode,
    //             message, 
    //             data
    //         }
            res.send('responseData dfghfghf')
    //     }
    // } catch (error) {
    //     res.send({ error: error })
    // }
}
const resetPassword = async (req, res) => {
    let message = null
    let statusCode = 400  
    try {
        const errors = check.resultsValidator(req)
        if (errors.length > 0) {
            return res.status(400).json({
                method: req.method,
                status: res.statusCode,
                error: errors
            })
        } else {
            const current_times = moment().subtract(5, 'minutes').format("YYYY-MM-DD HH:mm:ss"); 
            const {user_id,password,confirm_password,otp} = req.body
            if(password === confirm_password){ 
                const encryptedPassword = await bcrypt.hash(password, 10)  
                // Check requeted user is exist or not
                let sql = `SELECT * FROM users WHERE user_id= ? limit ?`;
                let user = await conn.query(sql, [user_id, 1]);
                if (user.length > 0) {  
                    if(user[0].otp == otp){
                        
                        // const strtotime = strtotime(current_time);
                        let sql1 = `SELECT * FROM users WHERE otp_time >= ? AND user_id= ? limit ?`;
                        let checkuser = await conn.query(sql1, [current_times,user_id, 1]);
                        if(checkuser.length>0){
                            const formData = { 
                                otp : null,
                                otp_time:null,
                                password:encryptedPassword
                            };
                            let sql2 = "UPDATE users Set ? WHERE user_id= ?"
                            const user  =await conn.query(sql2, [formData,user_id])
                            if(user){
                                statusCode  = 200
                                message     = 'Password reset successfully' 
                            }else{
                                statusCode  = 500
                                message     = 'Something Went wrong' 
                            }
                        }else{
                            statusCode  = 404
                            message     = 'OTP time expired'
                        }
                         
                    }else{
                        statusCode  = 404
                        message     = 'Sorry Invalid OTP' 
                    }
                    
                } else { 
                    statusCode  = 404
                    message     = 'Sorry Invalid user id' 
                }
                
            }else{
                statusCode = 404
                message = "Confirm password does not match"
            }
           
            const responseData = {
                status: statusCode,
                message
            }
            res.send(responseData)
        }
    } catch (error) {
        res.send({ error: error })
    }
}
module.exports = {
    authLogin ,
    authSignUp,
    forgotPassword,
    resetPassword
}