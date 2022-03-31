import { ChainablePromiseElement } from 'webdriverio';

import Page from './page';

class IndexPage extends Page {
    private pageLocation = '';

    private pageHeaderHeadingSelector = '#page-header-h2';

    private pageFooterSelector = '#pageFooter';

    private pageHeaderLogoLinkSelector = '#page-header-h2 a';

    private pageHeadingImageSelector = '#page-header-h2 a img';

    private pageLogInButtonSelector = '#anonymous-login-link';

    private pageRegisterButtonSelector = '#anonymous-register-link';

    private pageNavContestsLinkSelector = '#nav-contests-link';

    private pageNavSubmissionssLinkSelector = '#nav-submissions-link';

    private pageSeeContestsButtonSelector = '#button-see-contests';

    // private pageCompeteCardButton = '#button-card-compete';

    // private pagePracticeCardButton = '#button-card-practice';

    private cartContestClassSelector = '.ContestCard_contestCard__1Pn8q';

    private pageYoutubeVideo = '#youtube-video';

    public get headerHeading() {
        return $(this.pageHeaderHeadingSelector);
    }

    public get navSubmissionssLink() {
        return $(this.pageNavSubmissionssLinkSelector);
    }

    public get navContestsLink() {
        return $(this.pageNavContestsLinkSelector);
    }

    public get youtubeVideo() {
        return $(this.pageYoutubeVideo);
    }

    public get seeContestsButton() {
        return $(this.pageSeeContestsButtonSelector);
    }

    public get footer() {
        return $(this.pageFooterSelector);
    }

    public get headerLogoLink() {
        return $(this.pageHeaderLogoLinkSelector);
    }

    public get headingImage() {
        return $(this.pageHeadingImageSelector);
    }

    public get logInButton() {
        return $(this.pageLogInButtonSelector);
    }

    public get registerButton() {
        return $(this.pageRegisterButtonSelector);
    }

    public open(): Promise<string> {
        return super.open(this.pageLocation);
    }
}

export default new IndexPage();
