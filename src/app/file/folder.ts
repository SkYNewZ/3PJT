import { File } from './file';
import { plainToClass, classToPlain } from 'class-transformer';

export class Folder {
  private _name: string;
  private _uuid: string;
  private _files: File[];
  private _createdAt: string;
  private _updatedAt: string;
  private _mimeType: string;
  private _defaultDirectory: boolean;
  private _shared: boolean;


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

  /**
   * Getter mimeType
   * @return {string}
   */
  public get mimeType(): string {
    return this._mimeType;
  }

  /**
   * Setter mimeType
   * @param {string} value
   */
  public set mimeType(value: string) {
    this._mimeType = value;
  }

  public static FROM_JSON(jsonObject: {}): Folder {
    return plainToClass(Folder, jsonObject);
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
   * Getter files
   * @return {File[]}
   */
  public get files(): File[] {
    return this._files;
  }

  /**
   * Setter files
   * @param {File[]} value
   */
  public set files(value: File[]) {
    this._files = value;
  }

  /**
   * Getter uuid
   * @return {string}
   */
  public get uuid(): string {
    return this._uuid;
  }

  /**
   * Setter uuid
   * @param {string} value
   */
  public set uuid(value: string) {
    this._uuid = value;
  }

  /**
   * Getter createdAt
   * @return {string}
   */
  public get createdAt(): string {
    return this._createdAt;
  }

  /**
   * Setter createdAt
   * @param {string} value
   */
  public set createdAt(value: string) {
    this._createdAt = value;
  }

  /**
   * Getter updatedAt
   * @return {string}
   */
  public get updatedAt(): string {
    return this._updatedAt;
  }

  /**
   * Setter updatedAt
   * @param {string} value
   */
  public set updatedAt(value: string) {
    this._updatedAt = value;
  }

  /**
   * Getter defaultDirectory
   * @return {boolean}
   */
  public get defaultDirectory(): boolean {
    return this._defaultDirectory;
  }

  /**
   * Setter defaultDirectory
   * @param {boolean} value
   */
  public set defaultDirectory(value: boolean) {
    this._defaultDirectory = value;
  }
}
