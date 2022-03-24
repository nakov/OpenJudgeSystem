import { ChainablePromiseElement } from 'webdriverio';

import Page from './page';

class IndexPage extends Page {
    private pageLocation = '';

    private pageHeadingSelector = 'h1';

    private pageFooterSelector = '#pageFooter';

    private pageHeaderLogoLinkSelector = 'h1 a';

    private pageHeadingImageSelector = 'hi a img';

    private pageLogInButtonSelector = '#nav-login-link';

    private pageRegisterButtonSelector = '#nav-register-link';

    public get heading() {
        return $(this.pageHeadingSelector);
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
