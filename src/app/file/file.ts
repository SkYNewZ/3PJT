import { plainToClass, classToPlain } from 'class-transformer';

export class File {
  private _name: string;
  private _uuid: string;
  private _extention: string;
  private _mimeType: string;
  private _createdAt: string;
  private _updatedAt: string;
  private _shared: boolean;
  private _createdBy: string;
  private _updatedBy: string;


  /**
   * Getter createdBy
   * @return {string}
   */
  public get createdBy(): string {
    return this._createdBy;
  }

  /**
   * Setter createdBy
   * @param {string} value
   */
  public set createdBy(value: string) {
    this._createdBy = value;
  }

  /**
   * Getter updatedBy
   * @return {string}
   */
  public get updatedBy(): string {
    return this._updatedBy;
  }

  /**
   * Setter updatedBy
   * @param {string} value
   */
  public set updatedBy(value: string) {
    this._updatedBy = value;
  }


  /**
   * Getter shared
   * @return {boolean}
   */
  public get shared(): boolean {
    return this._shared;
  }

  /**
   * Setter shared
   * @param {boolean} value
   */
  public set shared(value: boolean) {
    this._shared = value;
  }

  public static FROM_JSON(jsonObject: {}): File {
    return plainToClass(File, jsonObject);
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
   * Getter uuid
   * @return {string}
   */
  public get uuid(): string {
    return this._uuid;
  }

  /**
   * Getter extention
   * @return {string}
   */
  public get extention(): string {
    return this._extention;
  }

  /**
   * Getter mimeType
   * @return {string}
   */
  public get mimeType(): string {
    return this._mimeType;
  }

  /**
   * Getter createdAt
   * @return {string}
   */
  public get createdAt(): string {
    return this._createdAt;
  }

  /**
   * Getter updatedAt
   * @return {string}
   */
  public get updatedAt(): string {
    return this._updatedAt;
  }

  /**
   * Setter name
   * @param {string} value
   */
  public set name(value: string) {
    this._name = value;
  }

  /**
   * Setter uuid
   * @param {string} value
   */
  public set uuid(value: string) {
    this._uuid = value;
  }

  /**
   * Setter extention
   * @param {string} value
   */
  public set extention(value: string) {
    this._extention = value;
  }

  /**
   * Setter mimeType
   * @param {string} value
   */
  public set mimeType(value: string) {
    this._mimeType = value;
  }

  /**
   * Setter createdAt
   * @param {string} value
   */
  public set createdAt(value: string) {
    this._createdAt = value;
  }

  /**
   * Setter updatedAt
   * @param {string} value
   */
  public set updatedAt(value: string) {
    this._updatedAt = value;
  }
}
