import { File } from './file';
import { Folder } from './folder';
import { plainToClass, classToPlain } from 'class-transformer';

export class ApiListElement {
  private _files: File[];
  private _folders: Folder[];

  public static FROM_JSON(jsonObject: {}): ApiListElement {
    return plainToClass(ApiListElement, jsonObject);
  }

  public toJson(): {} {
    return classToPlain(this);
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
   * Getter folders
   * @return {Folder[]}
   */
  public get folders(): Folder[] {
    return this._folders;
  }

  /**
   * Setter folders
   * @param {Folder[]} value
   */
  public set folders(value: Folder[]) {
    this._folders = value;
  }
}
