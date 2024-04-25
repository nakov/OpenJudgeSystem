import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import { useGetContestActivityQuery } from '../../../redux/services/admin/contestsAdminService';
import { getAndSetExceptionMessage } from '../../../utils/messages-utils';
import { renderErrorMessagesAlert } from '../../../utils/render-utils';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';
import TabsInView from '../common/tabs/TabsInView';

import ProblemForm from './problem-form/ProblemForm';
import ResourcesInProblemView from './problem-resources-in-problem-view/ResourcesInProblemView';
import TestsInProblemView from './tests-in-problem-view/TestsInProblemView';

enum PROBLEM_LISTED_DATA {
    TESTS = 'tests',
    RESOURCES = 'resources'
}
const AdministrationProblem = () => {
    const { pathname } = useLocation();
    const [ , , , problemId ] = pathname.split('/');
    const [ tabName, setTabName ] = useState(PROBLEM_LISTED_DATA.RESOURCES);
    const [ problemName, setProblemName ] = useState<string>('');
    const [ errorMessages, setErrorMessages ] = useState <Array<string>>([]);
    const [ contestId, setContestId ] = useState<number>(0);
    const [ skipGettingContestActivity, setSkipGettingContestActivity ] = useState<boolean>(true);

    const { refetch, data: activityData, error: activityError, isLoading: isGettingActivity, isFetching: isFetchingActivity } =
    useGetContestActivityQuery(Number(contestId), { skip: skipGettingContestActivity });

    const onTabChange = (event: React.SyntheticEvent, newValue: PROBLEM_LISTED_DATA) => {
        setTabName(newValue);
    };

    useEffect(() => {
        getAndSetExceptionMessage([ activityError ], setErrorMessages);
    }, [ activityError ]);

    useEffect(() => {
        if (!skipGettingContestActivity) {
            refetch();
        }
    }, [ contestId, refetch, skipGettingContestActivity ]);

    const returnProblemForm = () => (
        <ProblemForm
          problemId={Number(problemId)}
          isEditMode
          contestId={null}
          getName={(name: string) => setProblemName(name)}
          getContestId={(id: number) => {
              setContestId(id);
              setSkipGettingContestActivity(false);
          }}
        />
    );

    const returnResourceInProblemView = (key:string) => (
        <ResourcesInProblemView key={key} problemId={Number(problemId)} />
    );

    const returnTests = (key: string) => (
        <TestsInProblemView
          key={key}
          problemId={Number(problemId)}
          problemName={problemName}
          canBeCompeted={activityData!.canBeCompeted}
          contestId={contestId}
        />
    );

    return (
        <>
            {renderErrorMessagesAlert(errorMessages)}
            <TabsInView
              form={returnProblemForm}
              onTabChange={onTabChange}
              tabName={tabName}
              tabs={[
                  { value: PROBLEM_LISTED_DATA.RESOURCES, label: 'Resources', node: returnResourceInProblemView },
                  { value: PROBLEM_LISTED_DATA.TESTS, label: 'Tests', node: returnTests },
              ]}
            />
        </>
    );
};

export default AdministrationProblem;
