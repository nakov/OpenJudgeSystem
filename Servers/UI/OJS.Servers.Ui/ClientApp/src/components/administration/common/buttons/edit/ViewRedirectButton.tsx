import { IoMdEye } from 'react-icons/io';

import RedirectButton, { IRedirectProps } from '../RedirectButton';

const ViewRedirectButton = ({
    path,
    location,
}: IRedirectProps) => (
    <RedirectButton
      path={path}
      location={location}
      icon={<IoMdEye color="blue" />}
    />
);
export default ViewRedirectButton;
