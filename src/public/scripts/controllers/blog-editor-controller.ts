import {BlogPost} from '../models/blog-post';

class BlogEditorController {
  private blogModel: BlogPost;

  private spinner: HTMLElement;
  private titleInput: HTMLInputElement;
  private excerptTextArea: HTMLTextAreaElement;
  private mainImgPreview: HTMLImageElement;
  private markdownTextArea: HTMLTextAreaElement;

  constructor(blogPost: BlogPost) {
    this.blogModel = blogPost;

    this.spinner = document.querySelector('.js-saving-spinner');
    this.titleInput = document.querySelector('.js-title-input');
    this.excerptTextArea = document.querySelector('.js-excerpt-textarea');
    this.mainImgPreview = document.querySelector('.js-main-img');
    this.markdownTextArea = document.querySelector('.js-markdown-textarea');

    this.showSpinner(true);
  }

  showSpinner(isVisible: boolean) {
    this.spinner.style.opacity = isVisible ? '1' : '0';
  }
}
