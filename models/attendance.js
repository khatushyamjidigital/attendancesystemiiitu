const { Int32 } = require("mongodb");

var attendanceResp = {
    studentName: String,
    studentId: Int32,
    courseId: String,
    p: Int32,
    a: Int32
}


module.exports = {
    respModel: attendanceResp,
}