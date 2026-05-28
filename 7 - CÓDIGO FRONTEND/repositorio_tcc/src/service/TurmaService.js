import { BaseService } from './BaseService';

export class TurmaService extends BaseService {

    constructor() {
        super("/turmas");
    }
}
