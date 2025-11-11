import { axiosInstance, BaseService } from './BaseService';

export class AlunoService extends BaseService {

    constructor(){
        super("/alunos");
    }

    importFromFile(file){
        return axiosInstance.post(`${this.url}/import`, file, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });
    }
}