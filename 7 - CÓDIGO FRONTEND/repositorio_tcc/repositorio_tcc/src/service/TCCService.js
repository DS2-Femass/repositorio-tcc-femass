import { axiosInstance, BaseService } from './BaseService';

export class TCCService extends BaseService {

    constructor(){
        super("/tcc");
    }

    getMyTcc(){
        return axiosInstance.get(`${this.url}/my`);
    }
}