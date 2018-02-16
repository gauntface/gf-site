const crypto = require('crypto');
const fetch = require('node-fetch');

const githubCredentials = require('../github-oauth-credentials.json');

class AdminUsers {
  constructor() {
    this.signedInUsers = {};
  }

  isUserSignedIn(userId) {
    if (!userId) {
      return false;
    }

    if (!this.signedInUsers[userId]) {
      return false;
    }

    const userInfo = this.signedInUsers[userId];
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
    this.signedInUsers[userId] = {
      accessToken,
      userData,
      expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    return userId;
  }
}
module.exports = new AdminUsers();
