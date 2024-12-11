const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    const filePath = path.join(__dirname, '../data.json');

    if (req.method === 'GET') {
        const data = fs.readFileSync(filePath, 'utf-8');
        res.status(200).json(JSON.parse(data));
    } else if (req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const jsonData = JSON.parse(body);
                fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');
                res.status(200).json({ message: 'Data updated successfully!' });
            } catch (err) {
                res.status(400).json({ error: 'Invalid JSON' });
            }
        });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};
