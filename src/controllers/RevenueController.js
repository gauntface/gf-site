/* eslint-env browser */

class RevenueController {
  constructor() {
    // Initially assume ads.

    const scriptElement = document.createElement('script');
    scriptElement.src =
      '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    scriptElement.addEventListener('load', () => this.onAdScriptLoad());
    document.body.appendChild(scriptElement);
  }

  onAdScriptLoad() {
    const adsbygoogle = window.adsbygoogle || [];
    /** adsbygoogle.push({
      google_ad_client: 'ca-pub-5304385951374255',
      enable_page_level_ads: true,
    });**/
  }
}

window.addEventListener(() => {
  new RevenueController();
});
