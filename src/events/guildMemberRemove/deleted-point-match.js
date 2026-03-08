const { loadUsers, saveUsers } = require('../messageCreate/game_match');

module.exports = async (member) => {
    const users = loadUsers();
    if (users[member.id]) {
        delete users[member.id];
        saveUsers(users);
        console.log(`ลบคะแนนของ ${member.user.id} ออกจากเซิร์ฟเวอร์และไฟล์เรียบร้อยแล้ว`);
    }
};
