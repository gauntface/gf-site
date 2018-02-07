import {BlogPost} from '../models/blog-post';

class BlogEditorController {
  private blogModel: BlogPost;

  private spinner: HTMLElement;
  private titleInput: HTMLInputElement;
  private excerptTextArea: HTMLTextAreaElement;
  private markdownTextArea: HTMLTextAreaElement;
  private mainImgPreview: HTMLImageElement;
  private mainImgBGColorPreview: HTMLElement;

  constructor() {
    this.spinner = document.querySelector('.js-saving-spinner');
    this.titleInput = document.querySelector('.js-title-input');
    this.excerptTextArea = document.querySelector('.js-excerpt-textarea');
    this.markdownTextArea = document.querySelector('.js-markdown-textarea');
    this.mainImgPreview = document.querySelector('.js-main-img');
    this.mainImgBGColorPreview = document.querySelector('.js-main-img-current-color');

    this.showSpinner(true);

    // tslint:disable-next-line:no-any
    if (!window['gauntface'] || !window.gauntface.blogPostJSON) {
      throw new Error('Blog editor requires `window.gauntface.blogPostJSON` ' +
        'to exist.');
    }
    const blogPostData = JSON.parse(window.gauntface.blogPostJSON);

    this.blogModel = {
      postId: blogPostData.postId || null,
      title: blogPostData.title || null,
      excerpt: blogPostData.excerpt || null,
      mainImg: blogPostData.mainImg || null,
      mainImgBGColor: blogPostData.mainImgBGColor || null,
      markdown: blogPostData.markdown || null,
    };

    console.log(this.blogModel);

    this._forceModelOntoViews();
  }

  showSpinner(isVisible: boolean) {
    this.spinner.style.opacity = isVisible ? '1' : '0';
  }

  _forceModelOntoViews() {
    this.titleInput.value = this.blogModel.title;
    this.excerptTextArea.textContent = this.blogModel.excerpt;
    this.markdownTextArea.textContent = this.blogModel.markdown;
    this.mainImgPreview.src = this.blogModel.mainImg;
    this.mainImgBGColorPreview.style.background = this.blogModel.mainImgBGColor;
  }
}

new BlogEditorController();
