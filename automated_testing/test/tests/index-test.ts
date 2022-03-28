import IndexPage from '../pageobjects/index-page';

describe('Testing index', () => {
    it('Expect logInButton to exist', async () => {
        await IndexPage.open();
        const btn = await IndexPage.logInButton;
        await expect(btn).toExist();
        await expect(btn).toHaveText('LOGIN');
    });

    it('Expect registerButton to exist', async () => {
        await IndexPage.open();
        const btn = await IndexPage.registerButton;
        await expect(btn).toExist();
        await expect(btn).toHaveText('REGISTER');
    });

    it('Expect navBar to have headerLogoLink with href', async () => {
        await IndexPage.open();
        const a = await IndexPage.headerLogoLink;
        await expect(a).toHaveHrefContaining('/');
    });

    it('Expect to have imgTag with alt', async () => {
        await IndexPage.open();
        const img = await IndexPage.headingImage;
        await expect(img).toExist();
        await expect(img).toHaveAttr('alt', 'softuni logo');
    });

    it('Expect footer to exist', async () => {
        await IndexPage.open();
        const footer = await IndexPage.footer;
        await expect(footer).toExist();
    });
});
