import { axiosInstance, BaseService } from './BaseService';

export class SubcategoriaService extends BaseService {

    constructor(){
        super("/subcategorias");
    }

    findAllByCategoria(idCategoria) {
        return axiosInstance.get(`${this.url}?idCategoria=${idCategoria}`);
    }
}