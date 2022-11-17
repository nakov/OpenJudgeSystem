import { useEffect } from 'react';

import { PageTitles } from '../../common/page-titles';

export const ChangePageTitle = (title: string) => {
    useEffect(
        () => {
            if (title === PageTitles.default) {
                document.title = PageTitles.default;
            } else {
                document.title = `${title} - ${PageTitles.default}`;
            }
        },
        [ title ],
    );

    return null;
};

export default { ChangePageTitle };
