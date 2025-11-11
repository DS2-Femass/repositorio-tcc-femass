import { BaseService } from './BaseService';

export class CategoriaService extends BaseService {

    constructor(){
        super("/categorias");
    }
}