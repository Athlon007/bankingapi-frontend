import axios from 'axios';

const instance = axios.create({
<<<<<<< Updated upstream
    baseURL: 'https://bankapi-inholland-project.onrender.com/'
    //baseURL: 'http://localhost:8443/'
=======
    baseURL: 'http://localhost:8443/'
>>>>>>> Stashed changes
});

instance.defaults.headers.post['Content-Type'] = 'application/json';

instance.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');


export default instance;