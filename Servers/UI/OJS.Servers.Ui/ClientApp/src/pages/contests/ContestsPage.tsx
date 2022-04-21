import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isNil } from 'lodash';
import ContestFilters from '../../components/contests/contests-filters/ContestFilters';
import { useContests } from '../../hooks/use-contests';
import { setLayout } from '../shared/set-layout';
import styles from './ContestsPage.module.scss';

const ContestsPage = () => {
    const {
        state: {
            filters,
            contests,
        },
    } = useContests();

    const [ searchParams, setSearchParams ] = useSearchParams();

    useEffect(
        () => {
            setSearchParams(filters.reduce((p:any, f) => {
                const { type, name } = f;
                const names = isNil(p[type])
                    ? []
                    : p[type];
                names.push(name);

                return {
                    ...p,
                    [type]: names,
                };
            }, {}));
        },
        [ filters, setSearchParams ],
    );

    // Check search params and apply filters

    useEffect(
        () => {
            console.log(searchParams);
        },
        [ searchParams ],
    );

    useEffect(
        () => {
            console.log((contests || []).length);
        },
        [ contests ],
    );

    return (
        <div className={styles.container}>
            <ContestFilters />
            <div>
                Content
            </div>
        </div>
    );
};

export default setLayout(ContestsPage, true);
