import { ChainablePromiseElement } from 'webdriverio';

import Page from './page';

class IndexPage extends Page {
    private pageLocation = '';

    private pageHeaderHeadingSelector = '#page-header-h2';

    private pageFooterSelector = '#pageFooter';

    private pageHeaderLogoLinkSelector = '#page-header-h2 a';

    private pageHeadingImageSelector = '#page-header-h2 a img';

    private pageLogInButtonSelector = '#nav-login-link';

    private pageRegisterButtonSelector = '#nav-register-link';

    public get headerHeading() {
        return $(this.pageHeaderHeadingSelector);
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
