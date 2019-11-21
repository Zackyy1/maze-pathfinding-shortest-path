import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display "Labyrinth"', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Labyrinth');
  });
  it('labyrinth must be 5x5 by default', () => {
    page.navigateTo();
    // console.log('CLG PAGE::::', page.getMazeSize())
    expect(page.getMazeSize().count()).toBe(25);
  })

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
