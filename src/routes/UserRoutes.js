const router = require('express').Router()
// import auth controller
const UsersController = require('../controllers/UsersController')
const auth = require('../middleware/authVerification')
//import validation
const check = require('../validation/CheckValidation')
router.post('/createDistrubutor',check.distValidator(),UsersController.createDistrubutor)
router.post('/createStokez',check.stokezValidator(),UsersController.createStokez)
router.post('/createAgent',check.agentValidator(),UsersController.createAgent)
router.post('/createPlayer',check.playerValidator(),UsersController.createPlayer)



router.post('/createUser',check.userValidator(),UsersController.createUser)

router.post('/sendPoints',check.userPointsVal(),UsersController.sendPoints)
router.post('/sendStokezPoints',check.stokezPointsVal(),UsersController.sendPointstoStokez)
router.post('/sendAgentPoints',check.agentPointsVal(),UsersController.sendPointstoAgent)
router.post('/sendPlayerPoints',check.playerPointsVal(),UsersController.sendPointstoPlayer)




//router.post('/transferPoints',check.userPointsVal(),UsersController.transferPoints)

router.get('/getAgents',UsersController.getAgentsData)
router.get('/getPlayer',UsersController.getPlayerData)
router.get('/getPlayerHistory',UsersController.getPlayerHistoryData)

router.get('/getAllPlayer',UsersController.getAllPlayerData)



router.get('/pointsStokezHistory',UsersController.getStokezPointHistory)
router.get('/pointsAgentHistory',UsersController.getAgentPointHistory)
router.get('/pointsPlayerHistory',UsersController.getPlayerPointHistory)


router.get('/GameDoubleChanceHistory',UsersController.getDoubleChanceHistory)
router.get('/GameJeetoJokerHistory',UsersController.getJeetoJokerHistory)
router.get('/Game16CardsHistory',UsersController.get16CardsHistory)
router.get('/GameSpinGameHistory',UsersController.getSpinGameHistory)







router.post('/changePassword',auth,UsersController.changePassword)
router.post('/resetPassword',check.changePass(),UsersController.resetPassword)
router.get('/',UsersController.getUsers)
router.get('/admindata',UsersController.getAdminData)
router.get('/AgentsData',UsersController.getAllAgents)


router.get('/agents',UsersController.getAgents)

router.get('/getStokez',UsersController.getStokez)

// router.post('/profileUpload',UsersController.uploadProfilePic)
// router.get('/:id/avatar',UsersController.retrieveProfilePic)
// router.post('/friend_request',check.frientValidator(),UsersController.friendRequest)
// router.get('/find',UsersController.searchPlayers)
// router.get('/friend_req_notification/:user_id', UsersController.getFriendReqNotify)
// router.post('/friend_req_status_update', UsersController.updateFriendReqStatus)
router.get("/test", (req, res) => {
    res.send('sdfdfdfd')
});
module.exports = router