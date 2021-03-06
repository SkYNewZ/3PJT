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
  searchEndpoint: '/search',
  shareFileEndpoint: '/files/share',
  shareFolderEndpoint: '/folder/share',
  listSharedEntitiesEndpoint: '/share/all',
  listFilesAndFolderInSharedFolderEndpoint: '/share/folder/content',
  downloadSharedFileEndpoint: '/share/file/download',
  listAvailablesOffersEndpoint: '/offers',
  updateUserOfferEndpoint: '/user/offer',
  moveFileEndpoint: '/files/move',
  moveFolderEndpoint: '/folder/move',
  moveBackFolderEndpoint: '/folder/moveback',
  moveBackFileEndpoint: '/files/moveback',
  getSocialSignInEndpoint(provider: 'facebook' | 'google'): string {
    return `${environment.apiEndoint}/auth/${provider}/signin`;
  },
  getSearchUrl(query: string): string {
    return `${environment.apiEndoint}/${environment.searchEndpoint}?q=${encodeURI(query)}`;
  },
};
