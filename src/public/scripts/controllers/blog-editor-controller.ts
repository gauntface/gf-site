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
      status: blogPostData.status || null,
      publishDate: blogPostData.publishDate || null,
      draftDate: blogPostData.draftDate || null,
    };

    this._forceModelOntoViews();

    this.titleInput.disabled = false;
    this.excerptTextArea.disabled = false;
    this.markdownTextArea.disabled = false;
    this.showSpinner(false);
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

    // TODO: Set to a value based on the ID.
    this.iframePreview.src = `/admin/preview/${this.blogModel.id}`;
  }
}

new BlogEditorController();
