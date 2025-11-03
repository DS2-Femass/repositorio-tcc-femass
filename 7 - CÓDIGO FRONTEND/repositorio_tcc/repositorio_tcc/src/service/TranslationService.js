export class TranslationService {

    static translate(originalMessage) {
        switch (originalMessage) {
            case "No valid data found in file":
                return "Não foram encontrados dados válidos no arquivo";
            default:
                return originalMessage;
        }
    }
}