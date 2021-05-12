import axios from 'axios';

function strip(result) {
    return result.data.data;
}

async function login(username, password) {
    const results = await axios.post('/api/login', {username, password});
    return strip(results);
}

async function register(username, password, role) {
    const results = await axios.post('/api/register', {username, password, role});
    return strip(results);
}

async function getDocuments(username) {
    const results = await axios.get('/api/pdfs', {params: {username}});
    return strip(results);
}

async function modifyDocument(data) {
    const results = await axios.post('/api/pdf/edit', data);
    return strip(results);
}

async function createDocument(doc) {
    const results = await axios.post('/api/pdf/create', doc);
    return strip(results);
}

async function getAllHighlights(id) {
    const results = await axios.get('/api/highlights', {params: {id}});
    return strip(results)
}

export const endpoints = {login, register, getDocuments, modifyDocument, getAllHighlights, createDocument}