const supertest = require('supertest')
const app = require('../app')

const request = supertest(app);

describe('Refusing request if malformed', () => {
      
    test('Should return 400 if command not start with KEY_', async () => {
        return request
            .get('/toto')
            .expect(400)
            
    });

    test('Should return 400 if command is too long (> 16 char)', () => {
        return request
        .get('/KEY_ABCDEFGHIJKL')
        .expect(400)
    });

});
