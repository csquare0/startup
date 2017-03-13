import { RaasForgeAppPage } from './app.po';

describe('raas-forge-app App', () => {
  let page: RaasForgeAppPage;

  beforeEach(() => {
    page = new RaasForgeAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
