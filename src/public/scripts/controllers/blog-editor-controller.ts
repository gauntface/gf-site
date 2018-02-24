import {BlogPost} from '../models/blog-post';
import {TabComponent} from '../components/tab-controller';

class BlogEditorController {
  private blogModel: BlogPost;

  private spinner: HTMLElement;
  private titleInput: HTMLInputElement;
  private excerptTextArea: HTMLTextAreaElement;
  private markdownTextArea: HTMLTextAreaElement;
  private mainImgPreview: HTMLImageElement;
  private mainImgBGColorPreview: HTMLElement;

  private iframePreview: HTMLIFrameElement;

  constructor() {
    // tslint:disable-next-line:no-any
    if (!window['gauntface'] || !window['gauntface'].blogPostData) {
      throw new Error('Blog editor requires `window.gauntface.blogPostData` ' +
        'to exist.');
    }

    this.spinner = document.querySelector('.js-saving-spinner');
    this.titleInput = document.querySelector('.js-title-input');
    this.excerptTextArea = document.querySelector('.js-excerpt-textarea');
    this.markdownTextArea = document.querySelector('.js-markdown-textarea');
    this.mainImgPreview = document.querySelector('.js-main-img');
    this.mainImgBGColorPreview = document.querySelector('.js-main-img-current-color');
    this.iframePreview = document.querySelector('.js-blogcreate__preview');

    // TODO: Find a better place for this to live - it just needs
    // to be instantiated and it'll figure itself out.
    new TabComponent();

    const blogPostData = window['gauntface'].blogPostData;
    this.blogModel = {
      id: blogPostData.id || null,
      title: blogPostData.title || null,
      excerptMarkdown: blogPostData.excerptMarkdown || null,
      mainImg: blogPostData.mainImg || null,
      mainImageBgColor: blogPostData.mainImageBgColor || null,
      bodyMarkdown: blogPostData.bodyMarkdown || null,
      lastUpdate: blogPostData.lastUpdate || null,
    };

    window.addEventListener('keydown', (event) => {
      if (event.ctrlKey || event.metaKey) {
          switch (String.fromCharCode(event.which).toLowerCase()) {
          case 's':
              event.preventDefault();
              this._savePost();
              break;
          }
      }
  });

    this._forceModelOntoViews();

    this.showSpinner(false);
    this._setDisabledUI(false);
  }

  showSpinner(isVisible: boolean) {
    this.spinner.style.opacity = isVisible ? '1' : '0';
  }

  _forceModelOntoViews() {
    this.titleInput.value = this.blogModel.title;
    this.excerptTextArea.textContent = this.blogModel.excerptMarkdown;
    this.markdownTextArea.textContent = this.blogModel.bodyMarkdown;
    this.mainImgPreview.src = this.blogModel.mainImg;
    this.mainImgBGColorPreview.style.background = this.blogModel.mainImageBgColor;

    this._refreshIframe();
  }

  _refreshIframe() {
    if (this.blogModel.id) {
      this.iframePreview.src = `/admin/preview/${this.blogModel.id}?t=${Date.now()}`;
    }
  }

  _updateBlogModel() {
    this.blogModel.title = this.titleInput.value;
    this.blogModel.excerptMarkdown = this.excerptTextArea.textContent;
    this.blogModel.bodyMarkdown = this.markdownTextArea.textContent;
    // this.blogModel.mainImg = this.mainImgPreview.src;
    // this.blogModel.mainImageBgColor = this.mainImgBGColorPreview.style.background;
  }

  async _savePost() {
    this.showSpinner(true);
    this._setDisabledUI(true);

    this._updateBlogModel();

    const response = await fetch('/admin/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.blogModel),
    });
    const result = await response.json();
    if (result.error) {
      console.warn(`Blog post wasn't saved: `, result.error.message);
    }

    if (result.data.id) {
      if (result.data.id !== this.blogModel.id) {
        window.location.href = window.location.href + result.data.id;
        this.blogModel.id = result.data.id;
      }
    }

    this._refreshIframe();

    this.showSpinner(false);
    this._setDisabledUI(false);
  }

  _setDisabledUI(isDisabled: boolean) {
    this.titleInput.disabled = isDisabled;
    this.excerptTextArea.disabled = isDisabled;
    this.markdownTextArea.disabled = isDisabled;
  }
}

new BlogEditorController();
