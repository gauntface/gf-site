'use strict';

import BlogView from './blog-view';

var Palette =
  require('../third_party/material-palette/lib/Palette.js');

export default class MetaDataView extends BlogView {

  constructor(blogModel) {
    super();

    this.blogModel = blogModel;

    this.addDOMElements([
      {
        className: 'js-title-input',
        localName: 'titleInput'
      },
      {
        className: 'js-excerpt-textarea',
        localName: 'excerptTextArea'
      },
      {
        className: 'js-grey-scale-img',
        localName: 'greyScaleImg'
      },
      {
        className: 'js-main-img',
        localName: 'mainImg'
      },
      {
        className: 'js-main-img-current-color',
        localName: 'mainImgCurrentColor'
      },
      {
        className: 'js-main-img-bg-color-options',
        localName: 'mainImgBGColorSelection'
      }
    ]);

    this.blogModel.title = this.titleInput.value;
    this.blogModel.excerpt = this.excerptTextArea.value;
    this.blogModel.greyScaleImg = this.greyScaleImg.src;
    this.blogModel.mainImg = this.mainImg.src;

    this.onTitleInputChange = this.onTitleInputChange.bind(this);
    this.onExcerptInputChange = this.onExcerptInputChange.bind(this);
    this.updateMainImgColors = this.updateMainImgColors.bind(this);

    this.titleInput.addEventListener('input', this.onTitleInputChange);
    this.excerptTextArea.addEventListener('input', this.onExcerptInputChange);

    this.mainImg.addEventListener('load', this.updateMainImgColors);
  }

  onTitleInputChange() {
    if (!this.blogModel) {
      return;
    }

    this.blogModel.title = this.titleInput.value;
  }

  onExcerptInputChange() {
    if (!this.blogModel) {
      return;
    }

    this.blogModel.excerpt = this.excerptTextArea.value;
  }

  update() {
    this.greyScaleImg.src = this.blogModel.greyScaleImg || '';
    this.mainImg.src = this.blogModel.mainImg || '';
  }

  updateMainImgColors() {
    console.log('updateMainImgColors()');
    Palette
      .generate(this.mainImg)
      .done((palette) => {
        window.test = palette;
        var accentColors = palette.getAccentColors();
        var keys = Object.keys(accentColors);

        while (this.mainImgBGColorSelection.firstChild) {
          this.mainImgBGColorSelection.removeChild(
            this.mainImgBGColorSelection.firstChild);
        }

        for (var i = 0; i < keys.length; i++) {
          var color = accentColors[keys[i]];
          if (!color) {
            continue;
          }

          var hexString = color.toHex();

          var colorOption = document.createElement('div');
          colorOption.classList.add('blogcreate__color-option-item');
          colorOption.style.backgroundColor =  hexString;

          colorOption.addEventListener('click', (hexColor) => {
            return () => {
              this.blogModel.mainImgBGColor = hexColor;
            };
          }(hexString));

          this.mainImgBGColorSelection.appendChild(colorOption);
        }
      });
  }

}
