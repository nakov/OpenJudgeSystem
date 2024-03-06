import { IoNavigateOutline } from 'react-icons/io5';

import RedirectButton, { IRedirectProps } from '../RedirectButton';

const EditRedirectButton = ({
    path,
    location,
}: IRedirectProps) => (
    <RedirectButton
      path={path}
      location={location}
      icon={<IoNavigateOutline color="blue" />}
    />
);
export default EditRedirectButton;
