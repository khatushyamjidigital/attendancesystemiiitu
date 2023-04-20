const dbUtils = require('../dbUtils/databaseConn');
const dao = require('../dao/loginDAO');
const userModel = require('../models/users')




module.exports = {
  
    getAllUsers: async function(req,res) {
        var results = await dao.getAllUsers();
        res.send(results).status(200);
    },

    addUser: async function(req,res) {
        const user = new userModel({
            name: req.body.name,
            age: req.body.age,
            role: req.body.role,
            username: req.body.username,
            password: req.body.password
        })
        try{
            let err = await dao.createUser(user)
            res.status(201).json(user)
        }catch(err){
            res.status(400).json({message: err.message})
        }
    },

    validateLogin: async function(request,response){
        
        var inp = {
            username: request.body.username,
            password: request.body.password
        }
        try{
            var user = await dao.getUser(inp.username);

            if(user.password == inp.password)
                response.status(200).json({user,message:"Login Successfull"});
            else
                response.status(400).json({message:"Invalid Password"})
        }catch(err){
            console.log(err)
            response.status(400).json({message:"Invalid Login"})
        }
    },

    addTeacher: async function(request,response){

        var tid =Math.floor(100000 + Math.random() * 900000);
        var user={
            name: request.body.name,
            age: request.body.age,
            role: 1,
            username: request.body.username,
            password: request.body.password,
            studentId:"",
            teacherId:String(tid)
        }

        try{
            await dao.createUser(user)

            var teacherObj = {
                teacherId:String(tid),
                coursesTaught:request.body.coursesTaught
            }

            await dao.createTeacher(teacherObj)
            response.status(201).json({success:true})
        }catch(err){
            response.status(400).json({message: err.message})
        }
    },

    addStudent: async function(request,response){

        var sid = Math.floor(100000 + Math.random() * 900000);
        var user = {
            name: request.body.name,
            age: request.body.age,
            role: 0,
            username: request.body.username,
            password: request.body.password,
            studentId:String(sid),
            teacherId:""
        }

        try{
            await dao.createUser(user)
            
            var attendance = [];

            for(i in request.body.coursesEnrolledIn){
                var attendanceObj = {
                    courseId: request.body.coursesEnrolledIn[i],
                    P: Number(0),
                    A: Number(0)
                };
                await dao.addStudentIdToCourse(attendanceObj.courseId,sid)
                attendance.push(attendanceObj);
            }
            var studentObj = {
                studentId:sid,
                studentName:user.name,
                studentAge:user.age,
                overallAttendance:"",
                attendance:attendance,
                coursesEnrolledIn:request.body.coursesEnrolledIn
            }
            await dao.createStudent(studentObj);
            // await dao.addStudentToCoursesEnrolled(student)

            response.status(201).json({success:true})
        }catch(err){
            response.status(400).json({message: err.message})
        }
    },

    enrollRequest: async function(request,response){
        var inp={
            requestNo:Math.floor(100000 + Math.random() * 900000),
            name:request.body.name,
            age:request.body.age,
            username:request.body.username,
            password:request.body.password,
            coursesToBeEnrolledIn:request.body.coursesToBeEnrolledIn,
            reviewed:false
        }

        try{
            await dao.createEnrollRequest(inp)
            response.status(201).json({success:true})
        }catch(err){
            response.status(400).json({message: err.message})
        }
    },

    getEnrollRequest: async function(request,response){

        try{
            var requests = await dao.getEnrollRequest()
            response.status(201).json({success:true,requests})
        }catch(err){
            response.status(400).json({message: err.message})
        }
    },

    changeRequestStatus: async function(request,response){
        
        var rNo = request.params.requestNo;
        try{
            var request = await dao.getParticularEnrollRequest(rNo)
            request.reviewed = true;
            await dao.updateEnrollRequest(request)
            response.status(201).json({success:true})
        }catch(err){
            response.status(400).json({message: err.message})
        }
    }
};