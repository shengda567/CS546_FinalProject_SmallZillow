//Shuoyu Wang
const mongoCollections = require('../config/mongoCollections');
const managers = mongoCollections.managers;
const managerCodeData = require('./managersCode');
const bcryptjs = require('bcryptjs');
const saltRounds = 16;
var { ObjectId } = require('mongodb');
var registers = require('./register');



    /**
     * find all managers,
     * return array of managers(obj)
     */
    async function getAllManagers(){
        const managersCollection = await managers();
        const managersList = await managersCollection.find({}).toArray();
        if (!managersList) return null;
        return managersList;
    }



    /**
     * find manager with id
     * return manager(obj)
     * @param {string}  id
     */
    async function getManagerById(id) {
        const managersCollection = await managers();
        let managerId = ObjectId(id);
        const manager = await managersCollection.findOne({ _id: managerId });
        if (!manager) return null;
        return manager;
    }



    /**
     * find manager by username
     * @param {string} username
     */
    async function getManagerByUsername(username){
        const managersCollection = await managers();
        const manager = await managersCollection.findOne({username : username});
        if (!manager) return null;
        return manager;
    }



    /**
     * when add new manager, system need to verify the Authentication
     *
     * using managercode compare with managersCode.hashedPasscode
     *
     * return true if Authentication
     * return false if non-Authentication
     *
     * @param {string} manager_level
     * @param {string} managerCode
     */
    async function compareManagerCodeHelper(manager_level, managerCode){
        if (!manager_level|| !managerCode){
            return false;
        }
        let size = managerCodeData.length;
        for(let i =0; i < size; i ++){
            if (managerCodeData[i].level === manager_level){
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
    }



    /**
     *
     * add sign up new manager need provide below things:
     * username, password, email, manager_level, and special managerCode 
     * @param {stirng} username 
     * @param {string} password 
     * @param {string} email 
     * @param {string} manager_level
     * @param {string} managerCode 
     */
    async function addManager(username, password, email, manager_level, managerCode, manageHistory){
        if (!username) throw 'no username of addManager!';
        if (!password) throw 'no password of addManager!';
        if (!email) throw 'no Email of addManager!';
        if (!manager_level) throw 'no manager_level of addManager!';

        //check manager_level with managerCode
        if(managerCode){
            let flag = await compareManagerCodeHelper(manager_level, managerCode)
            if(!flag){
                throw 'Non-Authenticated of addManager!';
            }
        } else {
            throw 'no managerCode of addManager!';
        }
        if (!Array.isArray(manageHistory) || !manageHistory){
            manageHistory = [];
        }
        let hash = await bcryptjs.hash(password, saltRounds);

        const managersCollection = await managers();

        //check username duplicate
        let usernameIsExist = await getManagerByUsername(username);

        if (!usernameIsExist){
            let newManager = {
                username: username,
                hashedPassword: hash,
                email: email,
                manager_level: manager_level,
                manager_history: manageHistory
            };

            try{
                const newInsertInformation = await managersCollection.insertOne(newManager);
                if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
                return await getManagerById(newInsertInformation.insertedId);
            } catch(e) {
                console.log('add failed');
            }
        } else {
            throw 'you need add new manager with new username';
        }
    }



    async function removeManager(id){
        
        let managerId = ObjectId(id);
        const managersCollection = await managers();
        const deletionInfo = await managersCollection.removeOne({_id: managerId});
        if (deletionInfo.deletedCount === 0){
            throw `could not delete manager with id of ${id}`;
        }
        return true;
    }



    async function updateManager(id, updatedManager){

        let managerId = ObjectId(id);
        const manager = await getManagerById(id);
        if (!manager){
            console.log('update fail, no such manager');
        }
        // console.log(manager);
        let managerUpdateInfo = {};

        if (updatedManager.username){
            managerUpdateInfo.username = updatedManager.username;
        }

        if (updatedManager.password){
            let hashedPassword = await bcryptjs.hash(updatedManager.password, saltRounds);
            console.log(hashedPassword)
            managerUpdateInfo.hashedPassword = hashedPassword;
        }

        if (updatedManager.email){
            managerUpdateInfo.email = updatedManager.email;
        }

        if (updatedManager.manager_level){
            managerUpdateInfo.manager_level = updatedManager.manager_level;
        }

        if (updatedManager.manager_history){
            managerUpdateInfo.manager_history = [];
            for (let oldItem of manager.manager_history){
                managerUpdateInfo.manager_history.push(oldItem);
            }
            for (let item of updatedManager.manager_history){
                managerUpdateInfo.manager_history.push(item);
            }
        }

        let managersCollection = await managers();
        const updatedInfo = await managersCollection.updateOne(
            {_id: managerId},
            {$set: managerUpdateInfo}
        );
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update manager information successfully';
        }
        return await getManagerById(id);
    }



    async function deleteComment(mId, userId, commentId){

        //check have permission to deleted register's comments
        let managerId = ObjectId(mId);
        let isManager = await getManagerById(managerId);
        if (!isManager){
            throw 'No permission to delete register';
        }
        let managerUsername = isManager.username;


        //delete register's comments
        let deletedRegisterComments = await registers.removecommentfromuser(userId, commentId);
        if (!deletedRegisterComments){
            throw `could not deleted register's post`;
        }

        //update manager history
        let date = new Date();
        let time = date.toLocaleString();
        let tempHistory = `${time} --- manager: ${managerUsername} deleted comment(id): ${commentId} from register(id): ${userId}`;

        let updatedManager = {};
        updatedManager.manage_history = [];
        updatedManager.manage_history.push(tempHistory);
        let newManager = await updateManager(mId,updatedManager);
        if (newManager){
            return true;
        } else {
            throw `update manager history failed after delete register's comment`;
        }

    }



    async function deletePosts(mId, userId, postId){

        //check have permission to deleted register's posts
        let managerId = ObjectId(mId);
        let isManager = await getManagerById(managerId);
        if (!isManager){
            throw 'No permission to delete register';
        }
        let managerUsername = isManager.username;

        //delete register's posts
        let deletedRegisterPosts = await registers.removepostfromuser(userId, postId);
        if (!deletedRegisterPosts){
            throw `could not deleted register's post`;
        }

        //update manager history
        let date = new Date();
        let time = date.toLocaleString();
        let tempHistory = `${time} --- manager: ${managerUsername} deleted post(id): ${postId} from register(id): ${userId}`;

        let updatedManager = {};
        updatedManager.manage_history = [];
        updatedManager.manage_history.push(tempHistory);
        let newManager = await updateManager(mId,updatedManager);
        if (newManager){
            return true;
        }else{
            throw `update manager history failed after delete register's post`;
        }

    }



    async function deleteRegister(mId, registerId){
        //check have permission to deleted register
        let managerId = ObjectId(mId);
        let isManager = await getManagerById(managerId);
        if (!isManager){
            throw 'No permission to delete register';
        }
        let managerUsername = isManager.username;

        //delete register
        let deletedRegister = await registers.remove(registerId);
        if (!deletedRegister){
            throw 'could not delete register';
        }

        //update manager history
        let date = new Date();
        let time = date.toLocaleString();
        let tempHistory = `${time} --- manager: ${managerUsername} deleted register(id): ${registerId}`;

        let updatedManager = {};
        updatedManager.manage_history = [];
        updatedManager.manage_history.push(tempHistory);
        let newManager = await updateManager(mId, updatedManager);
        if (newManager){
            return true;
        }else{
            throw 'update manager history failed after delete register';
        }
    }



module.exports = {
    getAllManagers,
    getManagerById,
    getManagerByUsername,
    addManager,
    removeManager,
    updateManager,
    deleteComment,
    deletePosts,
    deleteRegister,
    compareManagerCodeHelper
};
