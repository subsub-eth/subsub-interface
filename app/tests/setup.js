// jsdom
require('global-jsdom/register');

require('react-hot-loader');

// enzyme
const Enzyme = require('enzyme');
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');
Enzyme.configure({ adapter: new Adapter() });
