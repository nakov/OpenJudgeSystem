import { baseUrl } from '../config';

export default class Page {
    protected _baseUrl = baseUrl;

    public get baseUrl() {
        return this._baseUrl;
    }

    public open(subPath: string = ''): Promise<string> {
        const path = `${this.baseUrl}/${subPath}`;
        browser.setTimeout({ implicit: 5000 });
        return browser.url(path);
    }
}
