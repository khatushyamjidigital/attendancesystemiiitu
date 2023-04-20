const dao = require('../dao/studentDAO.js');
const models = require('../models/attendance.js');

module.exports = {
    viewAttendance: async function (request, response) {

        var courseId = request.params.courseId;
        var studentId = request.params.studentId;
        studentId = Number(studentId)

        if (studentId == null)
            response.status(400).send({ message: "Student Id Cannot be null" });

        if (courseId == null)
            response.status(400).send({ message: "CourseId cannot be null" });

        try {
            var respModel = models.respModel
            var student = await dao.getStudent(studentId);
            respModel.studentId = studentId;
            respModel.courseId = courseId;
            respModel.studentName = student.studentName;

            for (obj in student.attendance) {
                if (student.attendance[obj].courseId == courseId) {
                    respModel.p = student.attendance[obj].P;
                    respModel.a = student.attendance[obj].A;
                }
            }

            response.status(200).json(respModel)

        } catch (err) {
            response.status(400).json(err)
        }
    },

    getStudents: async function (request, response) {
        var courseId = request.params.courseId
        var getStudentsResp = {
            data: [],
            err: {
                StatusCode: 0,
                Message: ""
            }
        };

        if (courseId == null)
            response.status(400).send({ message: "CourseId cannot be null" });

        try {
            var studentsEnrolled = await dao.getStudentsEnrolled(courseId);
            for (i in studentsEnrolled) {
                var studentId = studentsEnrolled[i];
                var studentData = await dao.getStudent(studentId);
                getStudentsResp.data.push(studentData);
            }
            getStudentsResp.err.StatusCode = 200;
            response.status(200).json(getStudentsResp);

        } catch (err) {
            response.status(400).json(err)
        }

    },

    updateAttendance: async function (request, response) {

        var respBody = {
            err: 0,
            message: ""
        }

        var courseId = request.body.courseId;
        var attendanceData = request.body.attendance;

        for (i in attendanceData) {
            var attendanceOfParticularStudent = attendanceData[i];
            var studentId = attendanceOfParticularStudent.sid;
            var val = attendanceOfParticularStudent.val;
            try {

                var student = await dao.getStudent(studentId);
                var attendance = student.attendance;
                for (i in attendance) {
                    var course = attendance[i];
                    if (course.courseId == courseId) {
                        if (val == "present")
                            course.P = course.P + 1;
                        if (val == "absent")
                            course.A = course.A + 1;
                    }
                }

            } catch (err) {
                respBody.err = 400
                respBody.message = "Error fetching student from database";
                response.status(400).json(respBody);
            }

            console.log(student);
            var status = await dao.updateStudentAttendance(student);
            if (status == 0) {
                respBody.err = 400;
                respBody.message = "Error Updating Student Attendance"
                response.status(400).json(respBody);
            }
        }
        respBody.err = 200;
        respBody.message = "Attendance Updated Successfully";
        response.status(200).json(respBody);
    }
}