const fs = require('fs');

const filePath = 'src/db/db.json';

function setUser(user) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    const jsonData = JSON.parse(data || '{}');

    jsonData[user.username] = {
      ...user,
      lastBoosted: new Date()
    };
  
    const updatedJsonData = JSON.stringify(jsonData, null, 2);
  
    fs.writeFile(filePath, updatedJsonData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
    });
  });
}

async function getUsers() {
  const data = await fs.readFileSync(filePath, 'utf8');
  const jsonData = JSON.parse(data || '{}');

  return jsonData;
}

exports.setUser = setUser;
exports.getUsers = getUsers;
