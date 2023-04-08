const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const app = require('../..');
const HttpStatusCode = require('../config/HttpStatusCode');
const { getAllFilesList, getCsvFiles } = require('../controllers/FilesController');

chai.use(chaiHttp)
chai.should()

describe('Server is running', () => {
  describe('environment', () => {
    it('should have a port', () => {
      expect(app.get('port')).to.not.be.undefined;
    })
  })
})

describe('Routes - GET /files', () => {
	it('should return status and message, and an array of filenames', async () => {
			const response = await chai.request(app).get('/data')
			expect(response).to.have.status(HttpStatusCode.OK);
			expect(response.body).to.be.an('object');
			expect(response.body.message).to.not.be.null;
	});

	it('should return a list of files', async () => {
		const response = await chai.request(app).get('/list')
		expect(response).to.have.status(HttpStatusCode.OK);
		expect(response.body).to.deep.equal({});
  });
});

describe('FileController - getAllFilesList', () => {
  it('returns an array of files', async () => {
    const files = await getAllFilesList();
    expect(files).to.be.an('array');
  });

  it('throws an error if the API call fails', async () => {
		if (typeof window !== 'undefined') {
			const fetchStub = sinon.stub(window, 'fetch').rejects(new Error('API call failed'));

			try {
				await getAllFilesList();
			} catch (error) {
				expect(error).to.be.an('error');
				expect(error.message).to.equal('API call failed');
			} finally {
				fetchStub.restore();
			}
		}
  });
});

describe('FileController - getCsvFiles()', () => {
	let result;
	before(async () => {
			result = await getCsvFiles();
	});

	it('Should return an array', () => {
			expect(result).to.be.an('array');
	});

	it('Should each element be an object', () => {
			expect(result[0]).to.be.an('object');
	});

	it('each object should contain file key with a string value', () => {
			expect(result[0].file).to.be.a('string');
	});

	it('each object should contain lines key with an array value', () => {
			expect(result[0].lines).to.be.an('array');
	});

	it('each element of lines array should contain text, number, and hex keys with string values', () => {
			expect(result[0].lines[0].text).to.be.a('string');
			expect(result[0].lines[0].number).to.be.a('string');
			expect(result[0].lines[0].hex).to.be.a('string');
	});

});