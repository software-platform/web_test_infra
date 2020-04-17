/// <reference types='codeceptjs' />
type homepage = typeof import('./page-objects/home.page');
type careersPage = typeof import('./page-objects/careers.page');

declare namespace CodeceptJS {
  interface SupportObject { I: CodeceptJS.I, homepage: homepage, careersPage: careersPage }
  interface CallbackOrder { [0]: CodeceptJS.I; [1]: homepage; [2]: careersPage }
  interface Methods extends CodeceptJS.Playwright {}
  interface I extends WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}
