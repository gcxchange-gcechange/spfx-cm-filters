/* eslint-disable @typescript-eslint/no-var-requires */
const english = require("./loc/en-us.js");
const french = require("./loc/fr-fr.js");

export enum Language {
    English = 'en',
    French = 'fr'
}

export class Globals {
    private static _language: string;
    private static _debugMode: boolean = false;
    private static _cacheTime: number;
    private static _jobTypeTermSetGuid: string;
    private static _programAreaTermSetGuid: string;

    public static getLanguage(): string {
        return this._language;
    }

    public static setLanguage(lang: string): void {
        if (lang) {
            lang = lang.toLowerCase();
            if (lang === Language.English || lang === Language.French) {
                this._language = lang;
                return;
            }
            this._language = 'en';
            console.warn(`Couldn't determine web part language "${lang}" defaulting to "${Language.English}"`);
        }
    }

    public static getStrings(): ISpfxCmFiltersWebPartStrings {
        const lang = this.getLanguage();
        switch(lang) {
            case Language.English:
                return english;
            case Language.French:
                return french;
            default:
                return english;
        }
    }

    public static isDebugMode(): boolean {
        return this._debugMode;
    }

    public static setDebugMode(state: boolean): void {
        this._debugMode = state;
    }

    public static getCacheTime(): number {
        return this._cacheTime;
    }

    public static setCacheTime(time: number): void {
        this._cacheTime = time;
    }

    public static getJobTypeTermSetGuid(): string {
        return this._jobTypeTermSetGuid;
    }

    public static setJobTypeTermSetGuid(guid: string): void {
        this._jobTypeTermSetGuid = guid;
    }

    public static getProgramAreaTermSetGuid(): string {
        return this._programAreaTermSetGuid;
    }

    public static setProgramAreaTermSetGuid(guid: string): void {
        this._programAreaTermSetGuid = guid;
    }
}

export interface Label {
    name: string;
    isDefault: boolean;
    languageTag: string;
}
  
export interface IsAvailableTag {
    isAvailable: boolean;
}
  
export class Term {
    id: string;
    isDeprecated: boolean;
    childrenCount: number;
    createdDateTime: string;
    lastModifiedDateTime: string;
    setId: string;
    labels: Label[];
    descriptions: any[];
    isAvailableForTagging: IsAvailableTag[];
}
  
export interface TermSetResponse {
    "@odata.context": string;
    value: Term[];
}