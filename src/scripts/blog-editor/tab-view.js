'use strict';

const TAB_SELECTED_CLASSNAME = 'tab-view__is-selected';

export default class TabView {
  constructor () {
    var tabBtns = document.querySelectorAll('.js-tab-view__tab-btn');
    var tabPairs = [];
    for (var i = 0; i < tabBtns.length; i++) {
      var btn = tabBtns[i];
      if (typeof btn.dataset.tabViewContent === 'undefined') {
        console.warn('Found tab-btn without the data-tab-view-content ' +
          'attribute. Skipping for now.');
        continue;
      }

      var tabContent = document.querySelector('.' + btn.dataset.tabViewContent);
      if (!tabContent) {
        console.warn('Couldn\'t find tab content ' +
          btn.dataset.tabViewContent + '. Skipping for now.');
        continue;
      }
      tabPairs.push(new TabPair(btn, tabContent));
    }
  }
}

class TabPair {
  constructor(tabBtn, tabContent) {
    this.tabButton = tabBtn;
    this.tabContent = tabContent;

    this.onTabBtnClick = this.onTabBtnClick.bind(this);
    this.tabButton.addEventListener('click', this.onTabBtnClick);
  }

  onTabBtnClick () {
    var selectedElements = document.querySelectorAll('.' +
      TAB_SELECTED_CLASSNAME);
    for (var i = 0; i < selectedElements.length; ++i) {
      selectedElements[i].classList.remove(TAB_SELECTED_CLASSNAME);
    }

    this.tabButton.classList.add(TAB_SELECTED_CLASSNAME);
    this.tabContent.classList.add(TAB_SELECTED_CLASSNAME);
  }
}
