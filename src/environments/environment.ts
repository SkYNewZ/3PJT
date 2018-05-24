// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiEndoint: 'http://localhost:8080/api',

  // register a new user
  signupEndpoint: '/auth/signup',

  // log in with credentials, obtain a jwt
  signinEndpoint: '/auth/signin',

  // check if username is already taken in database
  checkUsernameAvailabilityEndpoint: '/user/checkUsernameAvailability',

  // get user information (username, firstname, etc)
  userInfoEndpoint: '/user/me',

  // upload a file (/<UUID> can be added to upload file in given directory)
  uploadFileEndpoint: '/files/upload',

  // list all files in home directory (/<UUID> can be added to upload file in given directory)
  listFilesEndpoint: '/folder',

  // create a folder (/<UUID> can be added to create directory in the given one)
  createFolderEndpoint: '/folder',

  // rename a file (/<UUID> mandatory)
  renameFileEndpoint: '/files',

  // rename a folder (/<UUID> mandatory)
  renameFolderEndpoint: '/folder',

  // rename a folder (/<UUID> mandatory)
  deleteFolderEndpoint: '/folder',

  // rename a folder (/<UUID> mandatory)
  deleteFileEndpoint: '/files'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
