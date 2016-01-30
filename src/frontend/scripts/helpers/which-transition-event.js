export default function whichTransition() {
  const fakeElement = document.createElement('fakeelement');
  const transitionPairs = {
    'transition':'transitionend',
    'OTransition':'oTransitionEnd',
    'MozTransition':'transitionend',
    'WebkitTransition':'webkitTransitionEnd'
  }

  for(let tranisitionName in transitionPairs){
    if (fakeElement.style[tranisitionName] !== undefined ){
      return {
        styleName: tranisitionName,
        eventName: transitionPairs[tranisitionName]
      };
    }
  }
}
