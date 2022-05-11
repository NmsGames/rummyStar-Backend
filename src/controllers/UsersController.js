const bcrypt = require('bcrypt');
const check = require('../validation/CheckValidation') 
const conn = require('../../config/db')
const moment = require('moment'); 
const {authToken} =require('../middleware/getToken')
// User login 
var nodemailer = require('nodemailer');
 
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

//create user
const createUser = async (req, res) => {  
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
            const {distributor_id,user_id,password,username,email} = req.body 
            const encryptedPassword = await bcrypt.hash(password, 10) 
            let sql = `SELECT * FROM distributor WHERE LOWER(distributor_id)= ? limit ?`;
            const distributor = await conn.query(sql, [distributor_id,1])
            if(distributor.length>0){
                const formData = { 
                    username:username,
                    // email   : email, 
                    user_id :user_id,
                    distributor_id:distributor_id,
                    password: encryptedPassword
                };
                let sql1 = `SELECT * FROM user WHERE LOWER(user_id)= ? limit ?`;
                const user = await conn.query(sql1, [user_id,1])
                if(user.length>0){
                    statusCode = 404
                    message = "User Id already exist"
                }else{
                    const sql2  = `INSERT INTO user set ?`;
                    const users = await conn.query(sql2, formData)
                    if(users){
                        statusCode = 200
                        message = "User created success"
                    }else{
                        statusCode = 500
                        message = "Something went wrong! database error"
                    }
                }
                
            }else{
                statusCode = 404
                message = "Invalid distrubutor ID"
            }
             
            const responseData = {
                status: statusCode,
                message, 
            }
            res.send(responseData)
        }
    } catch (error) {
        res.status(500).send('Database error' )
    }
}

//create distributor
const createDistrubutor = async (req, res) => {
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
            const {distributor_id,percentage,password,username,pin} = req.body 
            const encryptedPassword = await bcrypt.hash(password, 10) 
            let sql = `SELECT * FROM distributor WHERE LOWER(distributor_id)= ? limit ?`;
            const distributor = await conn.query(sql, [distributor_id,1])
            if(distributor.length>0){ 
                statusCode = 200
                message    = "Id already exist" 
            }else{
                const formData = { 
                    username:username, 
                    pin :pin,
                    percentage:percentage,
                    distributor_id:distributor_id,
                    password: encryptedPassword
                }; 
                const sql2  = `INSERT INTO distributor set ?`;
                const users = await conn.query(sql2, formData)
                if(users){
                    statusCode = 200
                    message = "Distrubutor created success"
                }else{
                    statusCode = 500
                    message = "Something went wrong! database error"
                }
            }
             
            const responseData = {
                status: statusCode,
                message, 
            }
            res.send(responseData)
        }
    } catch (error) {
        res.status(500).send('Database error' )
    }
}

// create Stokez

const createStokez = async (req, res) => {
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
            const {name,type,parent ,password,revenue,username} = req.body 
      //      const encryptedPassword = await bcrypt.hash(password, 10) 
            let sql = `SELECT * FROM stokez WHERE LOWER(username)= ? limit ?`;
            const stokez = await conn.query(sql, [username,1])
            if(stokez.length>0){ 
                statusCode = 304
                message    = "username already exist" 
            }else{
                const formData = { 
                    stokezname :name,
                    revenue: revenue,
                    username:username,
                    type:type,
                    parent:parent,
        password: password,
                }; 
                const sql2  = `INSERT INTO stokez set ?`;
                const users = await conn.query(sql2, formData)
                if(users){
                    statusCode = 200
                    message = "stokez created success"
                }else{
                    statusCode = 500
                    message = "Something went wrong! database error"
                }
            }
             
            const responseData = {
                status: statusCode,
                message, 
            }
            res.send(responseData)
        }
    } catch (error) {
        res.status(500).send('Database error' )
    }
}
//create Agent
const createAgent = async (req, res) => {
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
            const {name,type,parent ,password,revenue,username} = req.body 
           // const encryptedPassword = await bcrypt.hash(password, 10) 
            let sql = `SELECT * FROM distributor WHERE LOWER(distributor_id)= ? limit ?`;
            const agent = await conn.query(sql, [username,1])
            if(agent.length>0){ 
                statusCode = 304
                message    = "username already exist" 
            }else{
                const formData = { 
                    username :name,
                    percentage: revenue,
                    distributor_id	:username,
                    type:type,
                    stokez_id:parent,
        password: password,
                }; 
                const sql2  = `INSERT INTO distributor set ?`;
                const users = await conn.query(sql2, formData)
                if(users){
                    statusCode = 200
                    message = "agent created success"
                }else{
                    statusCode = 500
                    message = "Something went wrong! database error"
                }
            }
             
            const responseData = {
                status: statusCode,
                message, 
            }
            res.send(responseData)
        }
    } catch (error) {
        res.status(500).send('Database error' )
    }
}

//create Player
const createPlayer = async (req, res) => {
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
            const {name,parent ,password,username} = req.body 
          //  const encryptedPassword = await bcrypt.hash(password, 10) 
            let sql = `SELECT * FROM user WHERE LOWER(user_id)= ? limit ?`;
            const agent = await conn.query(sql, [username,1])
            if(agent.length>0){ 
                statusCode = 304
                message    = "username already exist" 
            }else{
                const formData = { 
                    username :name,
                    user_id:username,
                    distributor_id:parent,
                   password: password,
                }; 
                const sql2  = `INSERT INTO user set ?`;
                const users = await conn.query(sql2, formData)
                if(users){
                    statusCode = 200
                    message = "player created success"
                }else{
                    statusCode = 500
                    message = "Something went wrong! database error"
                }
            }
             
            const responseData = {
                status: statusCode,
                message, 
            }
            res.send(responseData)
        }
    } catch (error) {
        res.status(500).send('Database error' )
    }
}



// List of user
const getUsers = async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT user.id,user.user_id,user.active,user.IsBlocked,user.username,user_points.points as balance,user.distributor_id,user.device ,user.last_logged_in ,user.last_logged_out FROM user LEFT JOIN user_points ON user.user_id = user_points.user_id`;
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
//List of AdminData

const getAdminData = async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT * FROM admin  `;
            const admin = await conn.query(sql)
            if(admin.length>0){               statusCode = 200
                message    = "success" 
                data = admin
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
const getAgents = async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT distributor.*,distributor_points.points FROM distributor LEFT JOIN distributor_points ON distributor.distributor_id = distributor_points.distributor_id`;
            const admin = await conn.query(sql)
            if(admin.length>0){ 
                statusCode = 200
                message    = "success" 
                data = admin
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
//list of Agent data
const getAgentsData = async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
        let sql = `SELECT distributor.id,distributor.distributor_id,distributor.username,distributor.password,distributor.percentage,distributor.type ,stokez.stokezname,distributor_points.points FROM  distributor left join stokez on distributor.stokez_id=stokez.id  left join distributor_points on distributor_points.distributor_id=distributor.distributor_id`;
            
            const agent = await conn.query(sql)
            if(agent.length>0){ 
                statusCode = 200
                message    = "success" 
                data = agent
            }else{
                statusCode = 404
                message    = "Agent not found"
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
//list of getPlayerDAta
const getPlayerData = async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT user.id,user.user_id,user.username,user.password ,user.distributor_id,user_points.points FROM  user left join user_points on user_points.user_id=user.user_id`;
            const agent = await conn.query(sql)
            if(agent.length>0){ 
                statusCode = 200
                message    = "success" 
                data = agent
            }else{
                statusCode = 404
                message    = "Agent not found"
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

const getPlayerHistoryData = async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT user.id,user.user_id,user.username,game_name.game_name FROM  user left join round_report on user.user_id=round_report.player_id left join game_name on round_report.game=game_name.id`;
            const agent = await conn.query(sql)
            if(agent.length>0){ 
                statusCode = 200
                message    = "success" 
                data = agent
            }else{
                statusCode = 404
                message    = "Agent not found"
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




const getAllPlayerData = async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT * FROM user `;
            const agent = await conn.query(sql)
            if(agent.length>0){ 
                statusCode = 200
                message    = "success" 
                data = agent
            }else{
                statusCode = 404
                message    = "Agent not found"
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

//stokezpointhistory
const getStokezPointHistory = async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT stokez.id,stokez.stokezname,stokez.username,stokez_point_history.point,stokez_point_history.create_at FROM stokez,stokez_point_history WHERE stokez.id=stokez_point_history.stokez_id`;
            const agent = await conn.query(sql)
            if(agent.length>0){ 
                statusCode = 200
                message    = "success" 
                data = agent
            }else{
                statusCode = 404
                message    = "Agenot found"
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

//Agentpointhistory
const getAgentPointHistory = async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT distributor.id,distributor.distributor_id,distributor.username,distributor_points_history.points,distributor_points_history.created_at FROM distributor left join  distributor_points_history on distributor.distributor_id=distributor_points_history.distributor_id`;
            const agent = await conn.query(sql)
            if(agent.length>0){ 
                statusCode = 200
                message    = "success" 
                data = agent
            }else{
                statusCode = 404
                message    = "Agenot found"
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

//Playerpointhistory
const getPlayerPointHistory = async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT user.id,user.user_id,user.username,user_points_history.points,user_points_history.created_at FROM user left join user_points_history on user.user_id=user_points_history.user_id`;
            const agent = await conn.query(sql)
            if(agent.length>0){ 
                statusCode = 200
                message    = "success" 
                data = agent
            }else{
                statusCode = 404
                message    = "Agenot found"
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

//GamesHistory------------------
const getDoubleChanceHistory= async (req, res) => {
    let message = null
    let statusCode = 400  
    let data;
    try { 
           // let sql = `SELECT * FROM round_report WHERE game=1 and outer_win=NULL and inner_win=NULL `;
           let sql = `SELECT * FROM round_report WHERE game=1 `;

            const agent = await conn.query(sql)
            if(agent.length>0){ 
                statusCode = 200
                message    = "success" 
                data = agent
            }else{
                statusCode = 404
                message    = "NOT found"
            } 
            const responseData = {
                status: statusCode,
                message, 
                data
            }
            res.send(responseData)
     
    } catch (error) {
        res.status(500).send('Database error 1')
    }
}
const getJeetoJokerHistory= async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT * FROM round_report WHERE game=2 `;
            const agent = await conn.query(sql)
            if(agent.length>0){ 
                statusCode = 200
                message    = "success" 
                data = agent
            }else{
                statusCode = 404
                message    = "Agent found"
            } 
            const responseData = {
                status: statusCode,
                message, 
                data
            }
            res.send(responseData)
     
    } catch (error) {
        res.status(500).send('Database error 1')
    }
}
const get16CardsHistory= async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT * FROM round_report WHERE game=3`;
            const agent = await conn.query(sql)
            if(agent.length>0){ 
                statusCode = 200
                message    = "success" 
                data = agent
            }else{
                statusCode = 404
                message    = "Agent found"
            } 
            const responseData = {
                status: statusCode,
                message, 
                data
            }
            res.send(responseData)
     
    } catch (error) {
        res.status(500).send('Database error 1')
    }
}
const getSpinGameHistory= async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT * FROM round_report WHERE game=4 `;
            const agent = await conn.query(sql)
            if(agent.length>0){ 
                statusCode = 200
                message    = "success" 
                data = agent
            }else{
                statusCode = 404
                message    = "Agent found"
            } 
            const responseData = {
                status: statusCode,
                message, 
                data
            }
            res.send(responseData)
     
    } catch (error) {
        res.status(500).send('Database error 1')
    }
}

//list of All Agent Data
const getAllAgents = async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT * FROM agent`;
            const agent = await conn.query(sql)
            if(agent.length>0){ 
                statusCode = 200
                message    = "success" 
                data = agent
            }else{
                statusCode = 404
                message    = "Agent not found"
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

//list of stokez
const getStokez = async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
        let sql = `SELECT stokez.id,stokez.stokezname,stokez.username,stokez.password ,admin.name,stokez_point.point FROM  stokez left join admin on stokez.parent=admin.admin_id  left join stokez_point on stokez_point.stokez_id=stokez.id`;

            const stokez = await conn.query(sql)
            if(stokez.length>0){ 
                statusCode = 200
                message    = "success" 
                data = stokez
            }else{
                statusCode = 404
                message    = "stokez not found"
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

//create user
const sendPoints = async (req, res) => {  
    let message = null
    let statusCode = 400 
    let sql ="" 
    let responseData;
    try {
        console.log(req.body,"Send data")
        const {role_id,user_id,distributor_id,stokez_id,points,passcode} = req.body
        switch (role_id) {
            case 4:
                sql         = `SELECT * FROM stokez WHERE LOWER(id)= ? limit ?`;
                responseData = await conn.query(sql, [stokez_id,1])
                if(responseData.length>0){
                    sql         = `SELECT * FROM stokez_point WHERE LOWER(stokez_id)= ? limit ?`;
                    responseData = await conn.query(sql, [stokez_id,1])
                    if(responseData.length>0){
                        const tpoints = parseInt(points)+parseInt(responseData[0].point); 
                        sql = "UPDATE stokez_point SET point= ? WHERE stokez_id=?";
                        const userss = await conn.query(sql, [tpoints,stokez_id])  
                        if(userss){
                            let formData = {
                                stokez_id:stokez_id,
                                point:points
                            }
                            sql = "INSERT INTO  stokez_point_history SET ?";
                            const userss = await conn.query(sql, formData)
                            statusCode = 200
                            message    = "Points updated"
                        }else{
                            statusCode = 500
                            message = "Something went wrong! database error"
                        }
                        
                    }else{ 
                        let formData = {
                            stokez_id:stokez_id,
                            point:points
                        }
                        sql = "INSERT INTO  stokez_point SET ?";
                        const userss = await conn.query(sql, formData)
                        if(userss){
                            statusCode = 200
                            message    = "Points updated"
                        }else{
                            statusCode = 500
                            message = "Something went wrong! database error"
                        }
                    }
                }else{
                    message ="Invalid stokez id"
                    statusCode = 404
                }
                break;
            case 2:
            
                break;
            case 3:
        
                break;
                
        
            default:
                break;
        }
         
             
            const responseData = {
                status: statusCode,
                message, 
            }
            res.send(responseData)
        
    } catch (error) {
        res.status(500).send('Database error' )
    }
}


//transfer  stokez point
const sendPointstoStokez= async (req, res) => {  
    let message = null
    let statusCode = 400  
    let sql = ""
    let responseData;
    let updateResponse;
    try { 
            const {stokez_id,points} = req.body  

               let formData = {  
                    stokez_id :stokez_id,
                     point: points
                };
                if(points){ 
                sql = `SELECT * FROM stokez_point WHERE stokez_id = ? limit ?`;
                responseData = await conn.query(sql, [stokez_id,1])
                if(responseData.length>0){
                    console.log(responseData,'responseData')
                    statusCode = 404 
                    let stokezPointId = responseData[0].id;
                    const tpoints = parseInt(points)+parseInt(responseData[0].point);

                    sql = "UPDATE stokez_point SET ? WHERE id=?";
                    updateResponse = await conn.query(sql, [{point:tpoints},stokezPointId])  
                    if(updateResponse){ 
                        
                        statusCode = 200
                        message    = "Points updated"
                          formdata={
                            point:points,
                            stokez_id:stokez_id,
                            stokezpoint_id:stokezPointId 
                            
                        } 
                        console.log(formdata,'formdata')
                        sql  = `INSERT INTO stokez_point_history set ?`;
                        await conn.query(sql, formData)
     
                    }else{
                        statusCode = 500
                        message = "Something went wrong! database error"
                    }
                }else{
                    sql = `INSERT INTO stokez_point set ?`;
                    responseData = await conn.query(sql, formData)
                    if(responseData){
                        console.log(responseData.insertId,'responseData')
                        formdata={
                            point:points,
                            stokez_id:stokez_id,
                            stokezpoint_id:responseData.insertId,
                            
                            
                        }
                      
                        
                       sql  = `INSERT INTO stokez_point_history set ?`;
                        await conn.query(sql, formData)
                        message    = "Points updated"
                        statusCode = 200
     
                    }else{
                        statusCode = 500
                        message = "Something went wrong! database error"
                    }
                }
                }else{
                    statusCode = 404
                    message = "Points required"
                } 
             
            const responseDatajson = {
                status: statusCode,
                message, 
            }
            res.send(responseDatajson) 
    } catch (error) {
        res.status(500).send('Database error' )
    }
}

//transfer agent point
const sendPointstoAgent= async (req, res) => {  
    let message = null
    let statusCode = 400  
    let sql = ""
    let responseData;
    let updateResponse;
    try { 
            const {agent_id,points} = req.body  

               let formData = {  
                    distributor_id :agent_id,
                     points: points
                };
                if(points){ 
                sql = `SELECT * FROM distributor_points WHERE distributor_id = ? limit ?`;
                responseData = await conn.query(sql, [agent_id,1])
                if(responseData.length>0){
                    console.log(responseData,'responseData')
                    statusCode = 404 
                    let agentPointId = responseData[0].id;
                    const tpoints = parseInt(points)+parseInt(responseData[0].point);

                    sql = "UPDATE distributor_points SET ? WHERE distributor_id=?";
                    updateResponse = await conn.query(sql, [{point:tpoints},agent_id])  
                    if(updateResponse){ 
                        
                        statusCode = 200
                        message    = "Points updated"
                          formdata={
                            point:points,

                            agent_id:req.body.agent_id,
                            agentpoint_id:responseData[0].id,
                            
                        } 
                        console.log(formdata,'formdata')
                        sql  = `INSERT INTO distributor_points_history set ?`;
                        await conn.query(sql, formData)
     
                    }else{
                        statusCode = 500
                        message = "Something went wrong! database error"
                    }
                }else{
                    sql = `INSERT INTO distributor_points set ?`;
                    responseData = await conn.query(sql, formData)
                    if(responseData){
                        console.log(responseData.insertId,'responseData')
                        formdata={
                            points:points,
                            distributor_id:agent_id,
                            
                            
                        }
                      
                        
                       sql  = `INSERT INTO distributor_points_history set ?`;
                        await conn.query(sql, formData)
                        message    = "Points updated"
                        statusCode = 200
     
                    }else{
                        statusCode = 500
                        message = "Something went wrong! database error"
                    }
                }
                }else{
                    statusCode = 404
                    message = "Points required"
                } 
             
            const responseDatajson = {
                status: statusCode,
                message, 
            }
            res.send(responseDatajson) 
    } catch (error) {
        res.status(500).send('Database error' )
    }
}
//transfer player point
const sendPointstoPlayer= async (req, res) => {  
    let message = null
    let statusCode = 400  
    let sql = ""
    let responseData;
    let updateResponse;
    try { 
            const {player_id,points} = req.body  

               let formData = {  
                user_id :player_id,
                     points: points
                };
                if(points){ 
                sql = `SELECT * FROM user_points WHERE user_id = ? limit ?`;
                responseData = await conn.query(sql, [player_id,1])
                if(responseData.length>0){
                    console.log(responseData,'responseData')
                    statusCode = 404 
                    let playerPointId = responseData[0].id;
                    const tpoints = parseInt(points)+parseInt(responseData[0].point);

                    sql = "UPDATE user_points SET ? WHERE user_id=?";
                    updateResponse = await conn.query(sql, [{point:tpoints},player_id])  
                    if(updateResponse){ 
                        
                        statusCode = 200
                        message    = "Points updated"
                          formdata={
                            points:points,
                            user_id:player_id,
                            
                        } 
                        console.log(formdata,'formdata')
                        sql  = `INSERT INTO user_points_history set ?`;
                        await conn.query(sql, formData)
     
                    }else{
                        statusCode = 500
                        message = "Something went wrong! database error"
                    }
                }else{
                    sql = `INSERT INTO user_points set ?`;
                    responseData = await conn.query(sql, formData)
                    if(responseData){
                        console.log(responseData.insertId,'responseData')
                        formdata={
                            point:points,
                            user_id:player_id,
                            
                            
                        }
                      
                        
                       sql  = `INSERT INTO user_points_history set ?`;
                        await conn.query(sql, formData)
                        message    = "Points updated"
                        statusCode = 200
     
                    }else{
                        statusCode = 500
                        message = "Something went wrong! database error"
                    }
                }
                }else{
                    statusCode = 404
                    message = "Points required"
                } 
             
            const responseDatajson = {
                status: statusCode,
                message, 
            }
            res.send(responseDatajson) 
    } catch (error) {
        res.status(500).send('Database error' )
    }
}










//Change admin & User password
const changePassword = async (req, res) => {  
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
            let sql  = ""  
            const {role_id,user_id,currentPassword,password,confirm_password} = req.body 
            if(password ===confirm_password)
            {   
                const encryptedPassword = await bcrypt.hash(password, 10)  
                const formData = {
                    password:encryptedPassword
                }
                if(role_id ===1)
                {
                    sql = "UPDATE admin Set ? WHERE email= ?"
                    const user  = await conn.query(sql, [formData,user_id])
                    if(user){
                        statusCode  = 200
                        message     = 'Password updated successfully' 
                    }else{
                        statusCode  = 500
                        message     = 'Something Went wrong' 
                    }
                }else if (role_id===2){  
                    sql = `SELECT * FROM stokez WHERE LOWER(username)= ? limit ?`;
                    const distributor = await conn.query(sql, [user_id,1])
                    if(distributor.length>0)
                    { 
    if(currentPassword== distributor[0].password){
                            sql = "UPDATE stokez Set ? WHERE username= ?"
                            const user  = await conn.query(sql, [formData,user_id])
                            if(user){
                                statusCode  = 200
                                message     = 'Password updated successfully' 
                            }else{
                                statusCode  = 500
                                message     = 'Something Went wrong' 
                            }
                        }else{
                            statusCode  = 404
                            message     = 'Current Password does not match' 
                        }   
                    }else if (role_id===3){ 
                        // check user
                        let sql = `SELECT * FROM player WHERE LOWER(username)= ? limit ?`;
                        const users = await conn.query(sql, [user_id,1])
                        if(users.length>0){
    if(currentPassword== distributor[0].password){
                         
                                sql = "UPDATE player Set ? WHERE username= ?"
                                const user  =await conn.query(sql, [formData,user_id])
                                if(user){
                                    statusCode  = 200
                                    message     = 'Password updated successfully' 
                                }else{
                                    statusCode  = 500
                                    message     = 'Something Went wrong' 
                                }
                            }else{
                                statusCode  = 404
                                message     = 'Current Password does not match' 
                            } 
                        }else{
                            statusCode = 404
                            message = "Invalid User ID"
                        }      
                    }
                }
            }else{
                statusCode = 404
                message = "Confirm password does not match"
            } 
            const responseData = {
                status: statusCode,
                message, 
            }
            res.send(responseData)
        }
    } catch (error) {
        res.status(500).send('Database error' )
    }
}

//Change admin & User password
//RESETPASSWORD------------------------------------------------------------
const resetPassword = async (req, res) => {  
    let message = null
    console.log(req.body)
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
        
            let sql  = ""
            const {role_id,user_id,password,confirm_password} = req.body //object destructor 
            if(password ===confirm_password)
            { 
                //const encryptedPassword = await bcrypt.hash(password, 10)  
                const formData = {
                    password:password
                }
                if(role_id===2){
                  sql = `SELECT * FROM stokez WHERE LOWER(username)= ? limit ?`;
                const distributor = await conn.query(sql, [user_id,1])
                if(distributor.length>0){ 
                    sql = "UPDATE stokez Set ? WHERE username= ?"
                    const user  =await conn.query(sql, [formData,user_id])
                    if(user){
                        statusCode  = 200
                        message     = 'Password updated successfully' 
                    }else{
                        statusCode  = 500
                        message     = 'Something Went wrong' 
                    }
                }
                }else if (role_id===3){ 
                    // check user
                    let sql = `SELECT * FROM player WHERE LOWER(username)= ? limit ?`;
                    const users = await conn.query(sql, [user_id,1])
                    if(users.length>0){
                        sql = "UPDATE player Set ? WHERE username= ?"
                        const user  =await conn.query(sql, [formData,user_id])
                        if(user){
                            statusCode  = 200
                            message     = 'Password updated successfully' 
                        }else{
                            statusCode  = 500
                            message     = 'Something Went wrong' 
                        }
                    }else{
                        statusCode = 404
                        message = "Invalid User ID"
                    } 
                        
                
            }
            }else{
                statusCode = 404
                message = "Confirm password does not match"
            }
             
            const responseData = {
                status: statusCode,
                message, 
            }
            res.send(responseData)
        }
    } catch (error) {
        res.status(500).send('Database error' )
    }
}
module.exports = {
    createDistrubutor ,
    createStokez,
    createAgent,
    createPlayer,
    createUser,  
    getUsers,
    getAdminData,
    sendPoints,
    changePassword,
    resetPassword,
    getAgents,
    getAgentsData,
    getPlayerData,
    getPlayerHistoryData,


    getAllPlayerData,

    getStokezPointHistory,
    getAgentPointHistory,
    getPlayerPointHistory,
    getDoubleChanceHistory,
    getJeetoJokerHistory,
    get16CardsHistory,
    getSpinGameHistory,





    getAllAgents,
     getStokez,
    sendPointstoStokez,
    sendPointstoAgent,
    sendPointstoPlayer,


}