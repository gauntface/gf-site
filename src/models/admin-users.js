const crypto = require('crypto');
const fetch = require('node-fetch');
const fs = require('fs-extra');
const path = require('path');

const githubCredentials = require('../github-oauth-credentials.json');

// Writing in the build directory will break forever
const USERS_FILE = path.join(__dirname, '..', '..', 'users.json');

class AdminUsers {
  async _readUsers() {
    const fileExists = await fs.exists(USERS_FILE);
    if (!fileExists) {
      return {};
    }

    try {
      return await fs.readJSON(USERS_FILE);
    } catch (err) {
      return {};
    }
  }

  async _writeUsers(users) {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  }

  async isUserSignedIn(userId) {
    if (!userId) {
      return false;
    }

    const signedInUsers = await this._readUsers();
    if (!signedInUsers[userId]) {
      return false;
    }

    const userInfo = signedInUsers[userId];
    if (userInfo.expirationTime <= Date.now()) {
      return false;
    }

    return true;
  }

  async addNewUser(githubCode) {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: githubCredentials.clientid,
        client_secret: githubCredentials.clientsecret,
        code: githubCode,
      }),
    });

    if (!response.ok) {
      throw new Error('No access_token exchanged.');
    }

    const responseData = await response.json();
    if (responseData.error) {
      throw new Error(responseData.error_description);
    }

    const accessToken = responseData.access_token;

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!userResponse.ok) {
      throw new Error('Unable to auth user.');
    }

    const userData = await userResponse.json();
    if (userData.id !== githubCredentials.id) {
      throw new Error('Unexpected ID.');
    }

    if (userData.login !== githubCredentials.login) {
      throw new Error('Unexpected Login.');
    }

    const userId = crypto.randomBytes(20).toString('hex');

    const signedInUsers = await this._readUsers();
    signedInUsers[userId] = {
      accessToken,
      userData: {
        id: userData.id,
        login: userData.login,
      },
      expirationTime: (Date.now() + 24 * 60 * 60 * 1000),
    };

    await this._writeUsers(signedInUsers);

    return userId;
  }
}
module.exports = new AdminUsers();
