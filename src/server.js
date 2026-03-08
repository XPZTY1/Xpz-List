const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();
const client = require('./index'); // นำเข้าตัว client จาก index.js
const app = express();
const port = 3000;

// ===== ตั้งค่า JWT Secret =====
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// ตั้งค่า Admin Username และ Password (ควรใช้ environment variables)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// เพิ่มเส้นทางไปยังไฟล์ .env ที่อยู่นอกโฟลเดอร์ src
const envPath = path.join(__dirname, '..', '.env');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.static('public'));

// ===== Middleware สำหรับตรวจสอบ JWT =====
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

client.once('ready', () => {

    // ===== API สำหรับ Login =====
    app.post('/api/login', async (req, res) => {
        try {
            const { username, password } = req.body;

            // ตรวจสอบ username และ password
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                // สร้าง JWT token
                const token = jwt.sign(
                    { username: username, role: 'admin' },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );
                res.json({ success: true, token: token });
            } else {
                res.status(401).json({ success: false, error: 'Invalid credentials' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });


    // ===== API ตรวจสอบสิทธิ์ Token =====
    app.get('/api/verify-token', (req, res) => {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.json({ valid: false });
        }

        try {
            jwt.verify(token, JWT_SECRET);
            res.json({ valid: true });
        } catch (error) {
            res.json({ valid: false });
        }
    });

    // ===== API ข้อมูลบอท (Public) =====
    app.get('/api/public/bot-info', async (req, res) => {
        try {
            const totalGuilds = client.guilds.cache.size;
            const avatar = client.user.displayAvatarURL();
            const username = client.user.username;
            res.json({ avatar: avatar, username: username, totalGuilds: totalGuilds });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // ===== API ข้อมูลเซิร์ฟเวอร์ (Public) =====
    app.get('/api/public/guild-info', async (req, res) => {
        try {
            const guilds = client.guilds.cache.map(guild => ({
                id: guild.id,
                name: guild.name,
                memberCount: guild.memberCount,
                iconURL: guild.iconURL()
            }));
            res.json({ guilds: guilds });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // ===== API ข้อมูลบอท (Admin Only) =====
    app.get('/api/admin/bot-info', verifyToken, async (req, res) => {
        try {
            const totalGuilds = client.guilds.cache.size;
            const avatar = client.user.displayAvatarURL();
            const username = client.user.username;
            res.json({ avatar: avatar, username: username, totalGuilds: totalGuilds });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // ===== API ข้อมูลเซิร์ฟเวอร์ (Admin Only) =====
    app.get('/api/admin/guild-info', verifyToken, async (req, res) => {
        try {
            const guilds = client.guilds.cache.map(guild => ({
                id: guild.id,
                name: guild.name,
                memberCount: guild.memberCount,
                iconURL: guild.iconURL()
            }));
            res.json({ guilds: guilds });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // ===== API อัปเดตโปรไฟล์บอท (Admin Only) =====
    app.post('/api/admin/update-profile', verifyToken, upload.single('avatar'), async (req, res) => {
        const avatarPath = req.file?.path;
        const botName = req.body['bot-name'];
        try {
            if (avatarPath) {
                const avatarBuffer = fs.readFileSync(avatarPath);
                await client.user.setAvatar(avatarBuffer);
                fs.unlinkSync(avatarPath);
            }

            if (botName) {
                await client.user.setUsername(botName);
            }

            res.json({ message: 'Profile updated successfully!' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // ===== API อัปเดตตัวแปรสภาพแวดล้อม (Admin Only) =====
    app.post('/api/admin/update-env', verifyToken, async (req, res) => {
        const { token, clientId } = req.body;
        try {
            let envContent = fs.readFileSync(envPath, 'utf-8');
            envContent = envContent.split('\n').map(line => {
                if (line.startsWith('TOKEN=')) {
                    return `TOKEN=${token}`;
                } else if (line.startsWith('CLIENT_ID=')) {
                    return `CLIENT_ID=${clientId}`;
                } else {
                    return line;
                }
            }).join('\n');
            fs.writeFileSync(envPath, envContent);
            res.json({ message: 'Environment variables updated successfully!' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // ===== Routes สำหรับหน้า HTML =====
    app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/login.html'));
    });

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index-public.html'));
    });

    app.get('/admin', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/admin-dashboard.html'));
    });

    // Keep old routes for backward compatibility
    app.get('/bot-info', async (req, res) => {
        try {
            const totalGuilds = client.guilds.cache.size;
            const avatar = client.user.displayAvatarURL();
            const username = client.user.username;
            res.json({ avatar: avatar, username: username, totalGuilds: totalGuilds });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    // 
    app.get('/guild-info', async (req, res) => {
        try {
            const guilds = client.guilds.cache.map(guild => ({
                id: guild.id,
                name: guild.name,
                memberCount: guild.memberCount,
                iconURL: guild.iconURL()
            }));
            res.json({ guilds: guilds });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });

    // === API สำหรับ Broadcast & Announcement ===

    // Broadcast Messages API
    // ===== API สำหรับ Broadcast & Announcement (อัปเดต) ===

    // Broadcast Messages API
    app.post('/api/admin/broadcast', verifyToken, async (req, res) => {
        try {
            const { serverIds, channelIds, message, useEmbed, embedData } = req.body;

            if (!serverIds || serverIds.length === 0) {
                return res.status(400).json({ error: 'กรุณาเลือกเซิร์ฟเวอร์' });
            }

            if (!channelIds || channelIds.length === 0) {
                return res.status(400).json({ error: 'กรุณาเลือกช่อง' });
            }

            if (!useEmbed && !message) {
                return res.status(400).json({ error: 'กรุณากรอกข้อความ' });
            }

            if (useEmbed && !embedData) {
                return res.status(400).json({ error: 'กรุณาสร้าง Embed ก่อน' });
            }

            let successCount = 0;
            let failCount = 0;

            // ส่งข้อความไปยังแต่ละช่อง
            for (const channelId of channelIds) {
                try {
                    const channel = client.channels.cache.get(channelId);
                    if (!channel || !channel.isTextBased()) {
                        failCount++;
                        continue;
                    }

                    if (useEmbed && embedData) {
                        // สร้าง Embed จากข้อมูล
                        const embed = {
                            title: embedData.title || undefined,
                            description: embedData.description || undefined,
                            color: embedData.color ? parseInt(embedData.color.replace('#', ''), 16) : undefined,
                            image: embedData.image ? { url: embedData.image } : undefined,
                            footer: embedData.footer ? { text: embedData.footer } : undefined,
                            timestamp: new Date()
                        };

                        // ลบค่า undefined
                        Object.keys(embed).forEach(key => embed[key] === undefined && delete embed[key]);

                        await channel.send({ embeds: [embed] });
                    } else {
                        // ส่งข้อความธรรมดา
                        await channel.send(message);
                    }

                    successCount++;
                } catch (error) {
                    console.error(`Failed to send message to channel ${channelId}:`, error);
                    failCount++;
                }
            }

            res.json({
                success: true,
                message: `ส่งข้อความสำเร็จ ${successCount} ช่อง (${failCount} ล้มเหลว)`,
                successCount,
                failCount
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Get Channels API
    app.get('/api/admin/channels', verifyToken, async (req, res) => {
        try {
            const channels = [];

            client.guilds.cache.forEach(guild => {
                guild.channels.cache.forEach(channel => {
                    if (channel.isTextBased()) {
                        channels.push({
                            id: channel.id,
                            name: channel.name,
                            guildId: guild.id,
                            guildName: guild.name
                        });
                    }
                });
            });

            res.json({ channels });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Announcement API
    app.post('/api/admin/announcement', verifyToken, async (req, res) => {
        try {
            const { channelId, title, content, useEmbed, embedData, schedule } = req.body;

            if (!channelId) {
                return res.status(400).json({ error: 'กรุณาเลือกช่อง' });
            }

            const channel = client.channels.cache.get(channelId);
            if (!channel || !channel.isTextBased()) {
                return res.status(400).json({ error: 'ไม่พบช่องนี้' });
            }

            let messagePayload = null;

            if (useEmbed && embedData) {
                // สร้าง Embed
                const embed = {
                    title: embedData.title || undefined,
                    description: embedData.description || undefined,
                    color: embedData.color ? parseInt(embedData.color.replace('#', ''), 16) : undefined,
                    image: embedData.image ? { url: embedData.image } : undefined,
                    footer: embedData.footer ? { text: embedData.footer } : undefined,
                    timestamp: new Date()
                };

                // ลบค่า undefined
                Object.keys(embed).forEach(key => embed[key] === undefined && delete embed[key]);

                messagePayload = { embeds: [embed] };
            } else {
                // สร้าง Embed จาก title + content (Text Mode)
                const embed = {
                    title: title,
                    description: content,
                    color: 0x58a6ff,
                    timestamp: new Date(),
                    footer: {
                        text: 'Announcement from Bot'
                    }
                };

                messagePayload = { embeds: [embed] };
            }

            // ส่งข้อความเลยหรือตั้งเวลา
            if (schedule) {
                const scheduleTime = new Date(schedule);
                const delay = scheduleTime - new Date();

                if (delay <= 0) {
                    return res.status(400).json({ error: 'เวลาต้องเป็นเวลาในอนาคต' });
                }

                // Schedule message
                setTimeout(async () => {
                    try {
                        await channel.send(messagePayload);
                    } catch (error) {
                        console.error('Failed to send scheduled announcement:', error);
                    }
                }, delay);

                res.json({
                    success: true,
                    message: `ตั้งเวลาโพสต์ประกาศแล้ว ในเวลา ${scheduleTime.toLocaleString('th-TH')}`
                });
            } else {
                // Send immediately
                await channel.send(messagePayload);
                res.json({
                    success: true,
                    message: 'โพสต์ประกาศสำเร็จ!'
                });
            }

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // ===== Routes สำหรับหน้า HTML =====
    app.get('/broadcast', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/broadcast-announcement.html'));
    });
});