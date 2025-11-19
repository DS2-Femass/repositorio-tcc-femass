import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL_API,
})

export class BaseService {
    
    url;

    constructor(url) {
        this.url = url;

        //Mecanismo que adiciona uma regra de negócio no meio da requisição (middleware)
        axiosInstance.interceptors.request.use((config) => {
            const token = sessionStorage.getItem("token");
            //Criar o bearertoken a partir do sessionStorage
            const autoRequestToken = token ? `Bearer ${token}` : '';
            config.headers.Authorization = autoRequestToken;
            return config;
        },
        (error) => {
            return Promise.reject(error);
        });

        axiosInstance.interceptors.response.use((response) => {
            return response;
        }, async (error) => {
            // const originalConfig = error.config;
            // console.log(error.response.status);
            if (error.response.status === 401) {
                //Fazer o refresh token
                //Se o refresh token falhar, redirecionar para a tela de login
                sessionStorage.removeItem("token");
                window.location.reload();
            }
            return Promise.reject(error);
        });
    }

    listAll() {
        return axiosInstance.get(this.url);
    }

    findById(id) {
        return axiosInstance.get(`${this.url}/${id}`);
    }

    insert(data) {
        return axiosInstance.post(this.url, data);
    }

    update(id, data) {
        return axiosInstance.put(`${this.url}/${id}`, data);
    }

    delete(id) {
        return axiosInstance.delete(`${this.url}/${id}`);
    }

    getHeaders() {
        return {
            Authorization: `Bearer ${this.token}`
        }
    }
}