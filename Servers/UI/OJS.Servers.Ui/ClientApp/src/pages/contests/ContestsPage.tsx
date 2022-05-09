import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isNil } from 'lodash';
import ContestFilters from '../../components/contests/contests-filters/ContestFilters';
import { useContests } from '../../hooks/use-contests';
import { setLayout } from '../shared/set-layout';
import styles from './ContestsPage.module.scss';

const ContestsPage = () => {
    const { state: { filters } } = useContests();

    // TODO: this will be fixed in next PR
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
