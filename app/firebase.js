const fs = require('fs');

const filePath = 'app/db/db.json';

function setUser(user) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    const jsonData = JSON.parse(data || '{}');
  
    if (!jsonData?.users) { 
      jsonData.users = [];
    }

    jsonData.users.push(user);
  
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

  return jsonData.users;
}

exports.setUser = setUser;
exports.getUsers = getUsers;
