const dbUtils = require('../dbUtils/databaseConn.js');

module.exports = {
    getAllUsers: async function(){
        let collection = await dbUtils.GetMongoCollection("Users");
        let results = await collection.find({"user":"test"}).limit(50).toArray();
        console.log(results);
        return results;
    },
    createUser: async function(user){

        let collection = await dbUtils.GetMongoCollection("Users");
        try{
            let err = await collection.insertOne(user);
        }catch(err){
            console.log(err)
        }
    },
    getUser: async function(username){

        let collection = await dbUtils.GetMongoCollection("Users");
        try{
            var user = await collection.findOne({'username':username})
            return user;
        }catch(err){
            console.log(err);
        }
    },

    createStudent: async function(studentDetails)
    {
        let collection = await dbUtils.GetMongoCollection("Students");
        try{
            await collection.insertOne(studentDetails);
            return;
        }catch(err){
            console.log(err)
        }
    },

    createTeacher: async function(teacherObj){
        let collection = await dbUtils.GetMongoCollection("Teachers");
        try{
            await collection.insertOne(teacherObj);
            return;
        }catch(err){
            console.log(err)
        }
    },

    addStudentIdToCourse: async function(cid,sid){
        let collection = await dbUtils.GetMongoCollection("Courses");
        try{
            var course = await collection.findOne({'courseId':cid})
            course.studentsEnrolled.push(sid)
            await collection.replaceOne({'courseId':cid},course)
            return;
        }catch(err){
            console.log(err)
        }
    },

    createEnrollRequest: async function(inp){
        let collection = await dbUtils.GetMongoCollection("EnrollRequests");
        try{
            await collection.insertOne(inp);
            return;
        }catch(err){
            console.log(err)
        }
    },

    getEnrollRequest: async function(){
        let collection = await dbUtils.GetMongoCollection("EnrollRequests");
        try{
            var requests = await collection.find({'reviewed':false}).toArray()
            return requests;
        }catch(err){
            console.log(err)
        }
    },

    getParticularEnrollRequest: async function(rNo){
        let collection = await dbUtils.GetMongoCollection("EnrollRequests");
        try{
            var request = await collection.findOne({'requestNo':Number(rNo)})
            console.log(request)
            return request;
        }catch(err){
            console.log(err)
        }
    },
    updateEnrollRequest: async function(request){
        let collection = await dbUtils.GetMongoCollection("EnrollRequests");
        try{
            await collection.replaceOne({'requestNo':request.requestNo},request)
            return;
        }catch(err){
            console.log(err)
        }
    }

    

};