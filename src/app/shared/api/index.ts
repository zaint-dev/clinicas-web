import { environment } from '../../../environments/environment';

export class Api {

    /** Domain */
    static protocol = environment.protocol;
    static apiUrl = environment.apiUrl;
    static port = environment.port;

    /** Context */
    static context = '';


    static getApiUrl(domain?: string): string {
        return this.protocol + this.apiUrl + this.port + this.context;
    }

}