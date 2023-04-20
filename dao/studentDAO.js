const dbUtils = require('../dbUtils/databaseConn.js')

module.exports = {
    
    getStudent: async function(studentId){

        try{
            let collection = await dbUtils.GetMongoCollection("Students");
            let student = await collection.findOne({'studentId':studentId});
            return student;

        }catch(err){
            console.log(err)
        }
    },

    getStudentsEnrolled: async function(courseId){
        try{

            let collection = await dbUtils.GetMongoCollection("Courses");
            let course = await collection.findOne({'courseId':courseId});
            
            var studentsEnrolled = course.studentsEnrolled;

            return studentsEnrolled;
            
        }catch(err){
            console.log(err)
        }
    },

    updateStudentAttendance: async function(student){
        try{

            let collection = await dbUtils.GetMongoCollection("Students");
            const result = await collection.replaceOne({'studentId':student.studentId},student) 
        }catch(err){
            return 0;
        }
    }


};