import chai, { expect } from 'chai';
import { convertIdToSlug, convertSlugToId } from '../../src/controller/slug-id-converter.js';

chai.use(require('chai-string'));

describe('slug-id-converter', function() {

  it('converts to slug that starts with name and prefix', function() {
    expect(convertIdToSlug(4711, "This is a name", "a")).to.startsWith('this-is-a-name-a');
    expect(convertIdToSlug(4711, "This is a name", "c")).to.startsWith('this-is-a-name-c');
  });

  it('converts name that contains invalid url chars', function() {
    expect(convertIdToSlug(4711, "ÅÄÖÈ/åäöé!", "p")).to.startsWith('aaoe-aaoe-p');
  });

  it('converts id that is greater than slug sum', function() {
    let slugLargeId = convertIdToSlug(998877, "a", "b");
    expect(convertSlugToId(slugLargeId)).to.equal(998877);
  });

  it('converts from id to slug and back to id', function() {
    let slug4711 = convertIdToSlug(4711, "This is a name", "a");
    expect(convertSlugToId(slug4711)).to.equal(4711);

    let slug12345 = convertIdToSlug(12345, "Säg står du i hörnet!", "c");
    expect(convertSlugToId(slug12345)).to.equal(12345);
  });

});
