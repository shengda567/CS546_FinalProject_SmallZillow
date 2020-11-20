//Shuoyu Wang
const mongoCollections = require('../config/mongoCollections');
const managers = mongoCollections.managers;
const managerCodeData = require('./managersCode');
const bcryptjs = require('bcryptjs');
const saltRounds = 16;

const posts = mongoCollections.posts;


let exportedMethods = {
    /**
     * find all managers,  
     * return array of managers(obj)
     */
    async getAllManagers(){
        const managersCollection = await managers();
        const managersList = await managersCollection.find({}).toArray();
        if (!managersList) throw 'No managers in system!';
        return managersList;
    },

    /**
     * find manager with id
     * return manager(obj)
     * @param {*} id 
     */
    async getManagerById(id) {
        const managersCollection = await managers();
        const manager = await managersCollection.findOne({ _id: id });
        if (!manager) throw 'manager not found';
        return manager;
    },

    /**
     * find manager by username
     * @param {string} username 
     */
    async getManagerByUsername(username){
        const managersCollection = await managers();
        const manager = await managersCollection.findOne({username : username});
        if (!manager) throw 'manager not found';
        return manager;
    },


    /**
     * when add new manager, system need to verify the Authentication
     * 
     * using managercode compare with managersCode.hashedPasscode
     * 
     * return true if Authentication
     * return false if non-Authentication
     * 
     * @param {string} manager_level 
     * @param {*string} managerCode 
     */
    async compareManagerCodeHelper(manager_level, managerCode){
        if(!manager_level|| !managerCode){
            return false;
        }
        let size = managerCodeData.length;
        for(let i =0; i < size; i ++){
            if(managerCodeData[i].level === manager_level){
                let compareToMerlin = false;
                try{
                    compareToMerlin = await bcryptjs.compare(managerCode, managerCodeData[i].hashedPasscode);
                }catch(e){
                    //no op
                }
                if(compareToMerlin){
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * 
     * add sign up new manager need provide below things:
     * username, password, email, manager_level, and special managerCode 
     * @param {stirng} username 
     * @param {*string} password 
     * @param {*string} email 
     * @param {*string} manager_tital 
     * @param {*string} managerCode 
     */
    async addManager(username, password, email, manager_level, managerCode){
        if(!username) throw 'no username of addManager!';
        if(!password) throw 'no password of addManager!';
        if(!email) throw 'no Email of addManager!';
        if(!manager_level) throw 'no manager_level of addManager!';

        //check manager_level with managerCode 
        if(managerCode){
            let flag = this.compareManagerCodeHelper(manager_level, managerCode)
            if(!flag){
                throw 'Non-Authenticated of addManager!';
            }
        }else{
            throw 'no managerCode of addManager!';
        }
        if(!Array.isArray(manageHistory)){
            manageHistory = [];
        }
        let hash = await bcryptjs.hash(password, saltRounds);

        const managersCollection = await managers();

        //check username duplicate
        let usernameIsExist = await this.getManagerByUsername(username);

        if(!usernameIsExist){
            let newManager = {
                username: username,
                hashedPassword: hash,
                email: email,
                manager_level: manager_level,
                manager_history: manageHistory
            };
    
            
            const newInsertInformation = await managersCollection.insertOne(newManager);
            if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
            return await this.getManagerById(newInsertInformation.insertedId);
        }else{
            throw 'you need add new manager with new username';
        }        
    },

    async removeManager(id){
        const managersCollection = await managers();
        const deletionInfo = await managersCollection.removeOne({_id: id});
        if(deletionInfo.deletedCount === 0){
            throw `could not delete manager with id of ${id}`;
        }
        return true;
    },

    async updateManager(id, updatedManager){
        //username: username,
        // hashedPassword: hash,
        // email: email,
        // manager_level: manager_level,
        // manager_History: manageHistory
        const manager = await this.getManagerById(id);
        if(!manager){
            console.log('update fail, no such manager');
        }
        // console.log(manager);
        let managerUpdateInfo = {}

        if(updatedManager.username){
            managerUpdateInfo.username = updatedManager.username;
        }

        if(updatedManager.hashedPassword){
            managerUpdateInfo.userhashedPassword = updatedManager.hashedPassword;
        }

        if(updatedManager.email){
            managerUpdateInfo.email = updatedManager.email;
        }

        if(updatedManager.manager_level){
            managerUpdateInfo.manager_level = updatedManager.manager_level;
        }

        if(updatedManager.manage_history){
            managerUpdateInfo.manage_history = updatedManager.manage_history;
        }

        const updatedInfo = await managersCollection.updateOne(
            {id: id},
            {$set: managerUpdateInfo}
        );
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update manager information successfully';
        }
        return await this.getManagerById(id);
    }

}

module.exports = exportedMethods;