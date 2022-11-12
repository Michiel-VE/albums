const mongoose = require('mongoose');
const supertest = require('supertest');
const Record = require('../models/Record');
const albums = require('./data.json');
const app = require('../app');

const api = supertest(app);

beforeEach(async () => {
    await Record.deleteMany({});
    await Record.create(albums);
});


test('Test matching length', async () => {
    const res = await api.get('/records');
    expect(res.body.records).toHaveLength(albums.length);
});

test('Test to add album', async () => {
    const newAlbum = {
        artistName: 'The Buggles',
        title: 'The Age of Plastic',
        trackCount: 10,
        releaseYear: 1980,
    };

    await api
        .post('/records/new')
        .send(newAlbum)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const res = await api.get('/records');
    expect(res.body.records).toHaveLength(albums.length + 1);
});

test('Test to delete a album', async () => {
    const albums = await api.get('/records');

    console.log(albums.body.records[albums.body.records.length - 1]._id);

    const id = albums.body.records[albums.body.records.length - 1]._id;
    await api.delete(`/records/${id}`);


    const res = await api.get('/records');
    console.log('al', albums.body.records);
    console.log('alres', res.body.records);
    console.log('res', res.body.records.length - 1);
    expect(res.body.records).toHaveLength(albums.body.records.length - 1);
});

afterAll(() => {
    mongoose.connection.close();
});
