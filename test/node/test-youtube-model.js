const sinon = require('sinon');

const youtubeModel = require('../../src/models/youtube-model');

require('chai').should();

describe('[Integration] Test Youtube Model', function() {
  const stubs = [];

  afterEach(function() {
    stubs.forEach((stub) => {
      stub.restore();
    });
  });

  it('should return default TTT episode on failing cache', function() {
    stubs.push(
      sinon.stub(youtubeModel, 'getFromCacheAndUpdate').callsFake(() => Promise.reject(new Error('Injected Error')))
    );
    stubs.push(
      sinon.stub(youtubeModel, '_updateLatestTTTFromNetwork').callsFake(() => Promise.reject(new Error('Injected Error')))
    );

    return youtubeModel.getLatestTTTEpisode()
    .then((result) => {
      result.should.deep.equal(youtubeModel.fallbackTTTEpisode);
    });
  });

  it('should return default TTT episode on no cache and failing network', function() {
    stubs.push(
      sinon.stub(youtubeModel, 'getFromCacheAndUpdate').callsFake(() => Promise.resolve())
    );
    stubs.push(
      sinon.stub(youtubeModel, '_updateLatestTTTFromNetwork').callsFake(() => Promise.reject(new Error('Injected Error')))
    );

    return youtubeModel.getLatestTTTEpisode()
    .then((result) => {
      result.should.deep.equal(youtubeModel.fallbackTTTEpisode);
    });
  });

  it('should return cached TTT episode and failing network', function() {
    const INJECTED_EPISODE = {
      url: 'https://gauntface.com/ttt-episode',
      title: 'Example Title',
    };
    stubs.push(
      sinon.stub(youtubeModel, 'getFromCacheAndUpdate').callsFake(() => Promise.resolve(INJECTED_EPISODE))
    );
    stubs.push(
      sinon.stub(youtubeModel, '_updateLatestTTTFromNetwork').callsFake(() => Promise.reject(new Error('Injected Error')))
    );

    return youtubeModel.getLatestTTTEpisode()
    .then((result) => {
      result.should.deep.equal(INJECTED_EPISODE);
    });
  });
});
