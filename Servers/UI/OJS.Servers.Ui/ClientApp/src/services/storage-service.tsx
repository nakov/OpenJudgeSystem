class CacheService {
    storage: Storage;

    constructor(storage: Storage) {
        this.storage = storage;
    }

    set(key: string, value: any) {
        const obj = JSON.stringify({ value });

        this.storage.setItem(key, obj);
    }

    get(key: string) {
        const value = this.storage.getItem(key) ?? '{}';
        const obj = JSON.parse(value);

        return obj.value;
    }

    clear() {
        this.storage.clear();
    }
}

export default CacheService;
