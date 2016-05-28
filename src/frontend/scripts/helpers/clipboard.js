import logger from './logger';

export default function copyToClipBoard(text) {
  const element = document.createElement('div');
  element.style.width = '0';
  element.style.height = '0';
  element.textContent = text;

  document.body.appendChild(element);

  var range = document.createRange();
  range.selectNode(element);
  window.getSelection().addRange(range);

  let successful = false;
  try {
    // Now that we've selected the anchor text, execute the copy command
    successful = document.execCommand('copy');
  } catch(err) {
    successful = false;
  }

  if (!successful) {
    logger('Oops, unable to copy');
  }

  document.body.removeChild(element);
}
