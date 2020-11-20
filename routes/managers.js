//Shuoyu Wang
const express = require('express');
const router = express.Router();
const data = require('../data');
const ManagersData = data.managers;


router.get('/', async (req, res) => {
    res.render('pages/managerLogin');
});

router.post('/', async (req, res) =>{
    //username, password, email, manager_level, managerCode
    const managerInfo = req.body;
    if (!managerInfo){
        res.status(400).json({error : 'you must provide body'});
    }
    if(!managerInfo.username){
        res.status(400).json({error : 'you must provide username'});
    }
    if(!managerInfo.password){
        res.status(400).json({error : 'you must provide password'});
    }
    if(!managerInfo.email){
        res.status(400).json({error : 'you must provide email'});
    }
    if(!managerInfo.manager_level){
        res.status(400).json({error : 'you must provide manager Level'});
    }
    if(!managerInfo.managerCode){
        res.status(400).json({error : 'you must provide manager code'});
    }
    try{
        let tempMana = ManagersData.getManagerByUsername(username);
        if(tempMana){
            res.json({message:'username already exist!'});
        }else{
            const { username, password, email, manager_level, managerCode } = managerInfo;
            const newManager = await ManagersData.addManager(username, password, email, manager_level, managerCode);
            res.json(newManager);
            // res.render('pages/manager');
        }
    }catch(e){
        res.status(500).json({error: e});
    }
});

router.get('/id', async (req, res)=>{
    try{
        const manager = await ManagersData.getManagerById(req.params.id);
        res.json(manager);
        // res.render('pages/manager');
    }catch(e){
        res.status(404).json({message : 'manager not found'});
    }
});

                // username: username,
                // hashedPassword: hash,
                // email: email,
                // manager_level: manager_level,
                // manager_history: manageHistory
router.patch(':/id', async (req, res) =>{
    const requestBody = req.body;
    let updateObj = {};
    try{
        let oldManager = await ManagersData.getManagerById(req.params.id);
        if(requestBody.username && requestBody.username !== oldManager.username){
            updateObj.username = requestBody.username;
        }
        if(requestBody.password){
            
        }

    }catch(e){

    }
})

module.exports = router;