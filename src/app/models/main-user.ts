import { plainToClass, classToPlain } from 'class-transformer';
import { Md5 } from 'ts-md5';
import { Offer } from './offer';

export class UserApp {
    private _firstname: string;
    private _lastname: string;
    private _email: string;
    private _provider: string;
    private _username: string;
    private _photoUrl: string;
    private _createdAt: Date;
    private _updatedAt: Date;

    /**
     * Getter offre
     * @return {Offer}
     */
    public get offre(): Offer {
        return this._offre;
    }

    /**
     * Setter offre
     * @param {Offer} value
     */
    public set offre(value: Offer) {
        this._offre = value;
    }
    private _offre: Offer;

    /**
     * Getter currentDataSize
     * @return {number}
     */
    public get currentDataSize(): number {
        return this._currentDataSize;
    }

    /**
     * Setter currentDataSize
     * @param {number} value
     */
    public set currentDataSize(value: number) {
        this._currentDataSize = value;
    }
    private _currentDataSize: number;

    public static FROM_JSON(jsonObject: {}): UserApp {
        return plainToClass(UserApp, jsonObject);
    }

    public toJson(): {} {
        return classToPlain(this);
    }

    /**
     * Getter firstname
     * @return {string}
     */
    public get firstname(): string {
        return this._firstname;
    }

    /**
     * Setter firstname
     * @param {string} value
     */
    public set firstname(value: string) {
        this._firstname = value;
    }


    /**
     * Getter lastname
     * @return {string}
     */
    public get lastname(): string {
        return this._lastname;
    }

    /**
     * Setter lastname
     * @param {string} value
     */
    public set lastname(value: string) {
        this._lastname = value;
    }


    /**
     * Getter email
     * @return {string}
     */
    public get email(): string {
        return this._email;
    }

    /**
     * Setter email
     * @param {string} value
     */
    public set email(value: string) {
        this._email = value;
    }


    /**
     * Getter username
     * @return {string}
     */
    public get username(): string {
        return this._username;
    }

    /**
     * Setter username
     * @param {string} value
     */
    public set username(value: string) {
        this._username = value;
    }


    /**
     * Getter photoUrl
     * @return {string}
     */
    public get photoUrl(): string {
        return this._photoUrl;
    }

    /**
     * Setter photoUrl
     * @param {string} value
     */
    public set photoUrl(value: string) {
        this._photoUrl = value;
    }


    /**
     * Getter createdAt
     * @return {Date}
     */
    public get createdAt(): Date {
        return this._createdAt;
    }

    /**
     * Setter createdAt
     * @param {Date} value
     */
    public set createdAt(value: Date) {
        this._createdAt = value;
    }


    /**
     * Getter updatedAt
     * @return {Date}
     */
    public get updatedAt(): Date {
        return this._updatedAt;
    }

    /**
     * Setter updatedAt
     * @param {Date} value
     */
    public set updatedAt(value: Date) {
        this._updatedAt = value;
    }

    public getGravatarUrl(email: string): string {
        return 'https://www.gravatar.com/avatar/' + Md5.hashStr(email);
    }

    /**
     * Getter provider
     * @return {string}
     */
    public get provider(): string {
        return this._provider;
    }

    /**
     * Setter provider
     * @param {string} value
     */
    public set provider(value: string) {
        this._provider = value;
    }
}
