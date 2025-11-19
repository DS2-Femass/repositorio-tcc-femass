import { BaseService } from './BaseService';

export class CursoService extends BaseService {

    constructor(){
        super("/cursos");
    }
}