import { OrganizerUiPage } from './app.po';

describe('organizer-ui App', function() {
  let page: OrganizerUiPage;

  beforeEach(() => {
    page = new OrganizerUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
