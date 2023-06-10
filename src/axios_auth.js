import axios from 'axios';

const instance = axios.create({
    //baseURL: 'https://bankapi-inholland-project.onrender.com/'
    //baseURL: 'http://localhost:8443/'
    baseURL: 'http://localhost:8080/'
});

instance.defaults.headers.post['Content-Type'] = 'application/json';

instance.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');


export default instance;