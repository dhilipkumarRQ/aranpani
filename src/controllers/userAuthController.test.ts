import request from 'supertest'
import app from '../index'

describe("POST /api/v1/auth/user", () => {
    test("login successful", async () => {
        const response = await request(app).get('/')
        expect(response.status).toEqual(200);
    });
    test('sample test' , () => {
        expect(1+1).toBe(2)
    })
    test('sample test2' , () => {
        expect(1+3).toBe(4)
    })
});
