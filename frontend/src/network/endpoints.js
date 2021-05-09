import axios from 'axios';

async function login(username, password) {
    const results = await axios.post('/api/login', {username, password});
    return results.data.data;
}

async function getDocument() {
    const results = await axios.get('/api/pdf');
    return results.data.data;
}

async function modifyDocument(data) {
    const results = await axios.post('/api/pdf/edit', data);
    return results.data.data;
}

export const endpoints = {login, getDocument, modifyDocument}