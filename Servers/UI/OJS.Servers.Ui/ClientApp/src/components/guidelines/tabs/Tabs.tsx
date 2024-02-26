import React, { useState } from 'react';
import { Theme } from '@material-ui/core/styles/';
import createTheme from '@material-ui/core/styles/createTheme';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import Box from '@mui/material/Box';
import ThemeProvider from '@mui/styles/ThemeProvider';

interface ITabPanelProps {
    labels: string[];
    contents: React.ReactNode[];
    themeOverride?: Theme;
    childrenClassName?: string;
}

const defaultState = { initialValue: '0' };

const Tabs = ({ contents, labels, themeOverride, childrenClassName }: ITabPanelProps) => {
    const [ value, setValue ] = useState(defaultState.initialValue);

    const theme =
        themeOverride == null
            ? createTheme({ overrides: { MuiTabs: { indicator: { backgroundColor: '#42abf8', height: 3 } } } })
            : themeOverride;

    const renderTabs = () => labels.map((tl: string, index: number) => (
        <Tab
          key={tl}
          label={tl}
          value={index.toString()}
          className={childrenClassName}
        />
    ));

    const renderTabChildren = () => contents?.map((tc: React.ReactNode, index: number) => (
        <TabPanel
          key={labels[index]}
          value={index.toString()}
        >
            {tc}
        </TabPanel>
    ));

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: '100%' }}>
                <TabContext value={value}>
                    <Box>
                        <TabList
                          onChange={(_, newValue) => setValue(newValue)}
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
