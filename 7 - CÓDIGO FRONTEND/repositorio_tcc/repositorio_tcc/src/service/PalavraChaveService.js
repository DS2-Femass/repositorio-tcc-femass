import { axiosInstance, BaseService } from './BaseService';

export class PalavraChaveService extends BaseService {

    constructor(){
        super("/palavras-chave");
    }

    findAllActive() {
        return axiosInstance.get(`${this.url}/ativas`);
    }

    searchByTermo(termo) {
        return axiosInstance.get(`${this.url}/pesquisa`, {
            params: { termo: termo }
        });
    }
}

