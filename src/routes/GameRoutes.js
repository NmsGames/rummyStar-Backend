const router = require('express').Router()
// import auth controller
const GameController = require('../controllers/GameController')
const PointsController = require('../controllers/PointsController')
const auth = require('../middleware/authVerification')
 
router.get('/playHistory' ,GameController.gamePlaysReport)
router.get('/playersHistory' ,GameController.userGamePlaysReport)
router.get('/winnigPoints' ,PointsController.winninigPoints)
// router.delete('/deleteDistributor/:distributor_id' ,UsersController.deleteDistributor)
// router.put('/changeStatusDistributor' ,UsersController.changeStatusDistributor)
// router.post('/createUser',check.userValidator(),UsersController.createUser)
// router.post('/sendPoints',auth,PointsController.sendPoints)
// router.post('/changePassword',auth,UsersController.changePassword)
// router.post('/resetPassword',check.changePass(),UsersController.resetPassword)
// router.get('/',UsersController.getUsers)
// router.get('/agents',UsersController.getAgents)
// router.get('/pointsHistory',PointsController.getPointsRecords)
 
router.get("/test", (req, res) => {
    res.send('sdfdfdfd')
});
module.exports = router