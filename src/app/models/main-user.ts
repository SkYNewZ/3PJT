import { plainToClass, classToPlain } from 'class-transformer';
import { Md5 } from 'ts-md5';

export class UserApp {
    private firstName: string;
    private lastName: string;
    private email: string;

    // optionnal beacause of facebook/google user
    private username?: string;
    private accountNonExpired?: boolean;
    private accountNonLocked?: boolean;
    private credentialsNonExpired?: boolean;
    private enabled?: boolean;
    private photoUrl?: string;
    private provider: 'supdrive' | 'facebook' | 'google';

    /**
     * Getter $provider
     * @return {'supdrive' | 'facebook' | 'google'}
     */
    public get $provider(): 'supdrive' | 'facebook' | 'google' {
        return this.provider;
    }

    /**
     * Setter $provider
     * @param {'supdrive' | 'facebook' | 'google'} value
     */
    public set $provider(value: 'supdrive' | 'facebook' | 'google') {
        this.provider = value;
    }

    /**
     * Getter $photoUrl
     * @return {string}
     */
    public get $photoUrl(): string {
        return this.photoUrl;
    }

    /**
     * Setter $photoUrl
     * @param {string} value
     */
    public set $photoUrl(value: string) {
        this.photoUrl = value;
    }

    public static FROM_JSON(jsonObject: {}): UserApp {
        return plainToClass(UserApp, jsonObject);
    }

    public toJson(): {} {
        return classToPlain(this);
    }

    /**
     * Getter $firstName
     * @return {string}
     */
    public get $firstName(): string {
        return this.firstName;
    }

    /**
     * Getter $lastName
     * @return {string}
     */
    public get $lastName(): string {
        return this.lastName;
    }

    /**
     * Getter $username
     * @return {string}
     */
    public get $username(): string {
        return this.username;
    }

    /**
     * Getter $email
     * @return {string}
     */
    public get $email(): string {
        return this.email;
    }

    /**
     * Getter $accountNonExpired
     * @return {boolean}
     */
    public get $accountNonExpired(): boolean {
        return this.accountNonExpired;
    }

    /**
     * Getter $accountNonLocked
     * @return {boolean}
     */
    public get $accountNonLocked(): boolean {
        return this.accountNonLocked;
    }

    /**
     * Getter $credentialsNonExpired
     * @return {boolean}
     */
    public get $credentialsNonExpired(): boolean {
        return this.credentialsNonExpired;
    }

    /**
     * Getter $enabled
     * @return {boolean}
     */
    public get $enabled(): boolean {
        return this.enabled;
    }

    /**
     * Setter $firstName
     * @param {string} value
     */
    public set $firstName(value: string) {
        this.firstName = value;
    }

    /**
     * Setter $lastName
     * @param {string} value
     */
    public set $lastName(value: string) {
        this.lastName = value;
    }

    /**
     * Setter $username
     * @param {string} value
     */
    public set $username(value: string) {
        this.username = value;
    }

    /**
     * Setter $email
     * @param {string} value
     */
    public set $email(value: string) {
        this.email = value;
    }

    /**
     * Setter $accountNonExpired
     * @param {boolean} value
     */
    public set $accountNonExpired(value: boolean) {
        this.accountNonExpired = value;
    }

    /**
     * Setter $accountNonLocked
     * @param {boolean} value
     */
    public set $accountNonLocked(value: boolean) {
        this.accountNonLocked = value;
    }

    /**
     * Setter $credentialsNonExpired
     * @param {boolean} value
     */
    public set $credentialsNonExpired(value: boolean) {
        this.credentialsNonExpired = value;
    }

    /**
     * Setter $enabled
     * @param {boolean} value
     */
    public set $enabled(value: boolean) {
        this.enabled = value;
    }

    public getGravatarUrl(): string {
        return 'https://www.gravatar.com/avatar/' + Md5.hashStr(this.email);
    }

}
