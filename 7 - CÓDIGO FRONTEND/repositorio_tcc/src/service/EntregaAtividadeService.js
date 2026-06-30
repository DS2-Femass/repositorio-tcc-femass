import { axiosInstance, BaseService } from './BaseService';

export class EntregaAtividadeService extends BaseService {

    constructor() {
        super("/entregas-atividade");
    }

    entregar(atividadeId, file) {
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        }
        return axiosInstance.post(`${this.url}/entregar/${atividadeId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    lancarNota(entregaId, nota) {
        return axiosInstance.patch(`${this.url}/${entregaId}/nota`, { nota });
    }

    downloadArquivo(entregaId) {
        return axiosInstance.get(`${this.url}/${entregaId}/arquivo`, {
            responseType: 'blob'
        });
    }
}
