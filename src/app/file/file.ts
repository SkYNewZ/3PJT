import { plainToClass, classToPlain } from 'class-transformer';

export class File {
  private _name: string;
  private _uuid: string;
  private _extention: string;
  private _mimeType: string;
  private _createdAt: string;
  private _updatedAt: string;

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
