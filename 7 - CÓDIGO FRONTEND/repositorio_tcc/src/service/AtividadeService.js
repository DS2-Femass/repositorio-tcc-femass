import { axiosInstance, BaseService } from './BaseService';

export class AtividadeService extends BaseService {

    constructor() {
        super("/atividades");
    }

    findByTurma(turmaId) {
        return axiosInstance.get(`${this.url}/turma/${turmaId}`);
    }

    findMine() {
        return axiosInstance.get(`${this.url}/my`);
    }
}
