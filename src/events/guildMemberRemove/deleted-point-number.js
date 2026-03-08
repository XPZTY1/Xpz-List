const fs = require('fs');
const path = require('path');

// ฟังก์ชันสำหรับโหลดข้อมูลคะแนน
function loadScores() {
    const scoresFilePath = path.join(__dirname, '..', '..', 'data', 'scores.json');
    let scores = {};
    if (fs.existsSync(scoresFilePath)) {
        scores = JSON.parse(fs.readFileSync(scoresFilePath, 'utf8'));
    }
    return scores;
}

// ฟังก์ชันสำหรับบันทึกข้อมูลคะแนน
function saveScores(scores) {
    const scoresFilePath = path.join(__dirname, '..', '..', 'data', 'scores.json');
    fs.writeFileSync(scoresFilePath, JSON.stringify(scores, null, 2));
}

// ฟังก์ชันสำหรับบันทึกข้อมูล log
function logMessage(log) {
    const logFilePath = path.join(__dirname, '..', '..', 'logs', 'log.txt');
    const logMessage = `${new Date().toISOString()} - ${log}\n`;
    fs.appendFileSync(logFilePath, logMessage, 'utf8');
}

module.exports = async (member) => {
    const scores = loadScores();
    const userId = member.id;

    if (scores[userId]) {
        delete scores[userId];
        saveScores(scores);
        logMessage(`ลบข้อมูลคะแนนของผู้ใช้ ${userId} เนื่องจากออกจากเซิร์ฟเวอร์`);
    }
};
