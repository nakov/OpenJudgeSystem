// THIS COMPONENT IS ONLY FOR REFERENCE PURPOSES, SHOULD BE DELETED LATER
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components';

import useTheme from '../hooks/use-theme';

const StyledDiv = styled.div`
  background-color: ${(props) => props.theme.baseColor100};
  color: ${(props) => props.theme.textColor};
`;
const TestThemeComponent = () => {
    const { themeColors } = useTheme();

    return (
        <StyledDiv theme={themeColors}>
            Themed Component
        </StyledDiv>
    );
};

export default TestThemeComponent;
