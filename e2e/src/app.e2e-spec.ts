import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('TobiMap');
  });

  it('should add point', async () => {
    const testPointName = 'test1'
    page.navigateTo();
    page.addPoint(50, 50, testPointName).then(()=> {
      expect(page.getListValue()).toEqual(testPointName);

    })
  });

  // it('should export image', async () => {
  //   const testPointName = 'test1'
  //   page.navigateTo();
  //   page.getImage().then((result)=> {
  //     expect(result).toEqual(true);
  //   })
  // });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
