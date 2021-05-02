import * as React from 'react';
import {shallow} from 'enzyme';
import * as expect from 'chai';
import { AppContainer } from '../src/components/App';

describe('App is rendered', () => {
    it("should do something", () => {
        // Render App in the document
        const appNode = shallow(<AppContainer />);

        console.log(appNode.dive().length);
        // Verify text content
        expect.expect(appNode.text())
            .equals('Hello World!agagagag');
    });
});
