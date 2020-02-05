import chai, { expect } from 'chai';
import { apiGetArticles } from '../../src/controller/rosette-api.js';

chai.use(require('chai-string'));

describe('rosette-api', function() {
  let server;

  beforeEach(function() {
    server = sinon.fakeServer.create();

    var res = new window.Response('{"hello":"world"}', {
      status: 200,
      headers: {
        'Content-type': 'application/json'
      }
    });
  
    window.fetch.returns(Promise.resolve(res));
  });

  afterEach(function () {
    server.restore();
  });

  it('shall return cached articles for a articleTypeId', function() {
    let articles = apiGetArticles(1);
    expect(articles.length).to.be(1);
  });

});
