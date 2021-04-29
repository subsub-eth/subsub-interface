// jsdom
// jsdom actually causes a node worker to stick around once mocha tests are
// completed. This could probably get fixed by cleaning up jsdom using
// `mocha-jsdom`. However, that things sucks in different ways, kinda. So, we
// opted to using `--exit` when running mocha.
const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
  clearTimeout(id);
};
copyProps(window, global);

// enzyme
const Enzyme = require('enzyme');
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');
Enzyme.configure({ adapter: new Adapter() });
