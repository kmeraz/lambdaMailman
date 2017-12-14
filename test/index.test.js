process.env.NODE_ENV = 'test';

// Vendor
const chai = require('chai');
const chaiHTTP = require('chai-http');
const should = chai.should();

// Internal
const server = require('../index');

chai.use(chaiHTTP);

describe('Express server', () => {
  context('GET request', () => {
    it('should return a friendly reminder to use a POST request instead', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          const expectedString = `Hi! Please make a post request with the following params on the request body: to, subject and body.`
          res.text.should.equal(expectedString);
          done();
      });
    });
  });

  context('POST request', () => {
    it('should return a success message', (done) => {
      var body = {
        to: 'kevinemeraz@gmail.com',
        subject: 'hey dude',
        body: 'yoooo'
      };

      chai.request(server)
        .post('/')
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.a('string');
      });
      done();
    });
  });
});
