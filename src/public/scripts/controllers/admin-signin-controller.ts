const GITHUB_CLIENT_ID = 'a242514b2d8f25efea35';

const signIn = async () => {
  const signinButton = document.querySelector('.js-signin-btn');
  signinButton.addEventListener('click', () => {
    const currentUrl = new URL(window.location.href);
    let redirectUrl = new URL('/admin/oauth/', window.location.origin);
    redirectUrl.search = window.location.search;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURI(redirectUrl.toString())}`;
  });
}

signIn();
