import { use, expect } from 'chai'
import request from 'supertest';
import express from "express";
import routes from '../routes/tasks.js';
import { notFoundHandler, errorHandler } from "../utils/middlewares/errorMiddlewares.js";
import { excludeEntityprops } from '../utils/excludeEntityProps.js'
import { strict as assert } from 'node:assert';

const app = express();
app.use('/', routes);
app.use('/', notFoundHandler);

const mock_doc = {
  _id: "some id",
  __v: "some version",
  some_key: "random string"
}

describe('Testing endpoints', () => {

  it('Should respond with a Hello world message', async () => {
    const response = await request(app).get('/healthy');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Hello world!');
  });

  it('Should respond with 404 Not found', async () => {
    const response = await request(app).get('/i_do_not_exist');
    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Resource not found');
  });

  it('Should exclude the keys _id and __v', async () => {
    const new_doc = excludeEntityprops(mock_doc); 
    assert.equal(new_doc.__v, undefined);
    assert.equal(new_doc._id, undefined);    
  });
});
