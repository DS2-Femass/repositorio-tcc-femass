import { axiosInstance, BaseService } from './BaseService';

export class TCCService extends BaseService {

    constructor(){
        super("/tcc");
    }

    getMyTcc(){
        return axiosInstance.get(`${this.url}/my`);
    }

    getTccById(id){
        return axiosInstance.get(`${this.url}/${id}`);
    }

    create(tccData){
        return axiosInstance.post(this.url, tccData);
    }

    update(id, tccData){
        return axiosInstance.put(`${this.url}/${id}`, tccData);
    }

    delete(id){
        return axiosInstance.delete(`${this.url}/${id}`);
    }
}
