'use strict';

import BaseController from '../base/base-controller';

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      expect([1,2,3].indexOf(5)).to.equal(-1);
      expect([1,2,3].indexOf(0)).to.equal(-1);
    });
  });
});

describe('BaseController', function() {
  it('should create a new page extending the base class', function() {
    class TestPage extends BaseController {
      constructor() {
        super();
      }
    }
  });

  it('should fire onDOMContentLoaded', function(done) {
    class TestPage extends BaseController {
      constructor(cb) {
        super();
      }

      onDOMContentLoaded() {
        done();
      }
    }
    new TestPage();
  });
});
