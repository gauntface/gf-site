const GITHUB_CLIENT_ID = 'a242514b2d8f25efea35';

const signIn = async () => {
  const signinButton = document.querySelector('.js-signin-btn');
  signinButton.addEventListener('click', () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`;
  });
}

signIn();
