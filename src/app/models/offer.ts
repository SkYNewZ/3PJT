import { plainToClass, classToPlain } from 'class-transformer';

export class Offer {
    private _id: number;
    private name: string;
    private _maxSize: number;

    public static FROM_JSON(jsonObject: {}): Offer {
        return plainToClass(Offer, jsonObject);
    }

    public toJson(): {} {
        return classToPlain(this);
    }


    /**
     * Getter id
     * @return {number}
     */
    public get id(): number {
        return this._id;
    }

    /**
     * Setter id
     * @param {number} value
     */
    public set id(value: number) {
        this._id = value;
    }

    /**
     * Getter $name
     * @return {string}
     */
    public get $name(): string {
        return this.name;
    }

    /**
     * Setter $name
     * @param {string} value
     */
    public set $name(value: string) {
        this.name = value;
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

}
