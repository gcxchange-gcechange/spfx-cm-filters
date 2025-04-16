import { Globals } from "./Globals";

export class SessionController<T> {
    private storageKey: string;

    constructor(storageKey: string) {
        this.storageKey = storageKey;
    }

    private getTimestamp(): number {
        return new Date().getTime();
    }

    public save(data: T): void {
        try {
            const item = {
                value: data,
                timestamp: this.getTimestamp()
            };

            localStorage.setItem(this.storageKey, JSON.stringify(item));

            if (Globals.isDebugMode()) {
                console.log(`Saved data to local storage with key: ${this.storageKey}`);
                console.log(item);
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    async fetch(fetchFunction?: () => Promise<T>): Promise<T | undefined> {
        const item = localStorage.getItem(this.storageKey);

        if (item) {
            const parsedItem = JSON.parse(item);
            if (this.getTimestamp() - parsedItem.timestamp < (Globals.getCacheTime() * 60 * 1000)) {

                if (Globals.isDebugMode()) {
                    console.log(`Retrieved data from local storage with key: ${this.storageKey}`);
                    console.log(parsedItem);
                }

                return parsedItem.value;
            } else {
                localStorage.removeItem(this.storageKey);
            }
        }

        if (fetchFunction) {
            const data = await fetchFunction();
            this.save(data);
            return data;
        }

        return undefined;
    }
}