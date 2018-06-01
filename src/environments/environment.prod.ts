export const environment = {
  production: true,
  apiEndoint: 'https://supdrive.lemairepro.fr/api',
  signupEndpoint: '/auth/signup',
  signinEndpoint: '/auth/signin',
  checkUsernameAvailabilityEndpoint: '/user/checkUsernameAvailability',
  userInfoEndpoint: '/user/me',
  uploadFileEndpoint: '/files/upload',
  listFilesEndpoint: '/folder',
  createFolderEndpoint: '/folder',
  renameFolderEndpoint: '/folder',
  deleteFolderEndpoint: '/folder',
  renameFileEndpoint: '/files',
  deleteFileEndpoint: '/files',
  downloadFileEndpoint: '/download/files',
  getSocialSignInEndpoint(provider: 'facebook' | 'google'): string {
    return `${environment.apiEndoint}/auth/${provider}/signin`;
  }
};
