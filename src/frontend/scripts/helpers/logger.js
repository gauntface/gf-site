export default function logger() {
  if (window.location.hostname !== 'localhost') {
    return;
  }

  if (window.self !== window.top) {
    return;
  }

  var args = (arguments.length === 1?[arguments[0]]:Array.apply(null, arguments));
  args.forEach(argument => {
    console.log(argument);
  });
}
