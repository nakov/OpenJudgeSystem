// THIS COMPONENT IS ONLY FOR REFERENCE PURPOSES, SHOULD BE DELETED LATER
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components';

import useTheme from '../hooks/use-theme';

import Button from './guidelines/buttons/Button';

const StyledDiv = styled.div`
  background-color: ${(props) => props.theme.baseColor100};
  color: ${(props) => props.theme.textColor};
`;
const TestThemeComponent = () => {
    const { toggleSelectedTheme, themeColors } = useTheme();

    return (
        <StyledDiv theme={themeColors}>
            Themed Component
            <Button onClick={toggleSelectedTheme}>Toggle Colors</Button>
        </StyledDiv>
    );
};

export default TestThemeComponent;
