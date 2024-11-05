import axios from 'axios';
import getCookie from './getCookie';

const http = axios.create({
    baseURL: 'http://localhost:80',
    withCredentials: true,
    withXSRFToken: true
});

export default http;

// const hosts = ['http://localhost:80', 'http://localhost:3000'];

// http.interceptors.request.use(config => {
//     if (!hosts.some(host => config.baseURL === host)) return config;

//     const token = getCookie('XSRF-TOKEN');
//     if (typeof token === 'undefined') return config;
//     config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
//     return config;
// });
