import { plainToClass, classToPlain } from 'class-transformer';

export class Offer {
    private _name: string;
    private _maxSize: number;
    private _description: string;
    private _price: number;

    /**
     * Getter description
     * @return {string}
     */
    public get description(): string {
        return this._description;
    }

    /**
     * Setter description
     * @param {string} value
     */
    public set description(value: string) {
        this._description = value;
    }

    /**
     * Getter price
     * @return {number}
     */
    public get price(): number {
        return this._price;
    }

    /**
     * Setter price
     * @param {number} value
     */
    public set price(value: number) {
        this._price = value;
    }

    public static FROM_JSON(jsonObject: {}): Offer {
        return plainToClass(Offer, jsonObject);
    }

    public toJson(): {} {
        return classToPlain(this);
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
    }

    /**
     * Getter maxSize
     * @return {number}
     */
    public get maxSize(): number {
        return this._maxSize;
    }

    /**
     * Setter maxSize
     * @param {number} value
     */
    public set maxSize(value: number) {
        this._maxSize = value;
    }

    /**
     * Get max size for current offer in MB (MO in french)
     * @returns {number}
     */
    public get maxSizeInMB(): number {
        return this._maxSize / 1048576;
    }

    /**
     * Get max size for current offer in GB (GO in french)
     * @returns {number}
     */
    public get maxSizeInGB(): number {
        return this._maxSize / 1073741824;
    }



}
