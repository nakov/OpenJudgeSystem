import React, { useState } from 'react';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { ThemeProvider } from '@mui/styles';
import { Theme } from '@material-ui/core/styles/createTheme';

import { createTheme, Tab } from '@material-ui/core';
import { Box } from '@mui/material';

interface ITabPanelProps {
    tabChildren: React.ReactNode[]
    tabLabels: string[]
    themeOverride?: Theme
}

const defaultState = { initialValue: '0' };

const Tabs = ({ tabChildren, tabLabels, themeOverride }: ITabPanelProps) => {
    const [ value, setValue ] = useState(defaultState.initialValue);

    const theme =
        themeOverride == null
            ? createTheme({ overrides: { MuiTabs: { indicator: { backgroundColor: '#42abf8', height: 3 } } } })
            : themeOverride;

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setValue(newValue);
    };

    const renderTabs = () => tabLabels.map((tl: string, index: number) => (
        <Tab key={tl} label={tl} value={index.toString()} />
    ));

    const renderTabChildren = () => tabChildren?.map((tc: React.ReactNode, index: number) => (
        // eslint-disable-next-line react/no-array-index-key
        <TabPanel key={index.toString()} value={index.toString()}>{tc}</TabPanel>
    ));

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: '100%' }}>
                <TabContext value={value}>
                    <Box>
                        <TabList
                          onChange={handleChange}
                        >
                            {renderTabs()}
                        </TabList>
                    </Box>
                    {renderTabChildren()}
                </TabContext>
            </Box>
        </ThemeProvider>
    );
};

export default Tabs;
