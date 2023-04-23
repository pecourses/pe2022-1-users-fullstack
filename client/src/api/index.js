import axios from 'axios';

const httpClient = axios.create({ baseURL: 'http://localhost:5000' });

export const getUsers = () => httpClient.get('/api/users?limit=100&offset=0');
