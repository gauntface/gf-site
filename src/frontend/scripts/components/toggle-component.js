export default class ToggleComponent {
  constructor(ele) {
    if (!ele.classList.contains('toggle')) {
      throw new Error('Element passed to Toggle constructor does not have ' +
        'the toggle class set');
    }

    var element = ele;
    var clickHandler = null;

    this.getElement = () => {
      return element;
    };

    this.getClickHandler = () => {
      return clickHandler;
    };

    this.setClickHandler = (cb) => {
      clickHandler = cb;
    };

    element.addEventListener('click', (event) => {
      if (this.isDisabled()) {
        return;
      }

      if (this.getClickHandler()) {
        return this.getClickHandler()(event);
      }

      this.toggleChecked();
    });
  }

  isChecked() {
    return this.getElement().classList.contains('is-checked');
  }

  toggleChecked() {
    this.getElement().classList.toggle('is-checked');
  }

  setChecked(isSelected) {
    if (isSelected) {
      this.getElement().classList.add('is-checked');
    } else {
      this.getElement().classList.remove('is-checked');
    }
  }

  isDisabled() {
    return this.getElement().classList.contains('is-disabled');
  }

  setDisabled(isDisabled) {
    if (isDisabled) {
      this.getElement().classList.add('is-disabled');
    } else {
      this.getElement().classList.remove('is-disabled');
    }
  }

  addClickHandler(cb) {
    var element = this.getElement();
    if (this.getClickHandler()) {
      element.removeEventListener(this.getClickHandler());
    }

    this.setClickHandler(cb);
  }
}
