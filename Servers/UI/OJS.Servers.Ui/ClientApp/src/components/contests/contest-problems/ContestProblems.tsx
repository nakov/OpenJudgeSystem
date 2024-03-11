import { useEffect, useState } from 'react';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { IProblemType } from '../../../common/types';
import useTheme from '../../../hooks/use-theme';
import { setSelectedContestDetailsProblem } from '../../../redux/features/contestsSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import IconSize from '../../guidelines/icons/common/icon-sizes';
import Icon from '../../guidelines/icons/Icon';

import styles from './ContestProblems.module.scss';

interface IContestProblemsProps {
    problems: Array<IProblemType>;
}

const ContestProblems = (props: IContestProblemsProps) => {
    const { problems } = props;

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { themeColors, getColorClassName } = useTheme();
    const { selectedContestDetailsProblem } = useAppSelector((state) => state.contests);

    const [ isOpened, setIsOpened ] = useState<boolean>(true);

    const backgroundColorClassName = getColorClassName(themeColors.baseColor200);
    const darkBackgroundClassName = getColorClassName(themeColors.baseColor500);

    useEffect(() => {
        if (problems.length > 0) {
            dispatch(setSelectedContestDetailsProblem({ selectedProblem: problems[0] }));
        }
    }, [ problems, problems.length, dispatch ]);

    const onProblemClick = (problem: IProblemType) => {
        dispatch(setSelectedContestDetailsProblem({ selectedProblem: problem }));
    };

    return (
        <div>
            <div className={styles.wrapper}>
                <div className={`${styles.problemsWrapper} ${isOpened
                    ? ''
                    : styles.closedProblems} ${backgroundColorClassName}`}
                >
                    <div className={styles.problemsHeader} style={{ borderBottom: `1px solid ${themeColors.textColor}` }}>
                        <div>Tasks</div>
                        <div>Points</div>
                    </div>
                    {problems.map((problem) => {
                        const isActive = selectedContestDetailsProblem?.id === problem.id;
                        return (
                            <div
                              className={`${styles.problem} ${isActive
                                  ? styles.activeProblem
                                  : ''}`}
                              style={{ borderBottom: `1px solid ${themeColors.textColor}` }}
                              onClick={() => onProblemClick(problem)}
                            >
                                <div>{problem.name}</div>
                                <div>
                                    {problem.points}
                                    /
                                    {problem.maximumPoints}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <Icon
                  color={themeColors.textColor}
                  size={IconSize.Large}
                  className={styles.shrinkIcon}
                  onClick={() => setIsOpened(!isOpened)}
                  Component={isOpened
                      ? MdKeyboardDoubleArrowLeft
                      : MdKeyboardDoubleArrowRight}
                />
            </div>
            <div className={`${styles.resultsSection} ${darkBackgroundClassName}`} onClick={() => navigate('/')}>Show all results</div>
        </div>
    );
};

export default ContestProblems;
