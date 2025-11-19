import { axiosInstance, BaseService } from './BaseService';

export class SubcategoriaService extends BaseService {

    constructor(){
        super("/subcategorias");
    }

    findAllByCategoria(idCategoria) {
        let data = { "idCategoria": idCategoria };
        return axiosInstance.get(this.url, data);
    }
}