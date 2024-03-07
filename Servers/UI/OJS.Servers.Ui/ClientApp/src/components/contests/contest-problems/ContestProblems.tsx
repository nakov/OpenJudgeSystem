import { useEffect, useState } from 'react';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';

import { IProblemType } from '../../../common/types';
import useTheme from '../../../hooks/use-theme';
import IconSize from '../../guidelines/icons/common/icon-sizes';
import Icon from '../../guidelines/icons/Icon';

import styles from './ContestProblems.module.scss';

interface IContestProblemsProps {
    problems: Array<IProblemType>;
}

const ContestProblems = (props: IContestProblemsProps) => {
    const { problems } = props;
    const { themeColors, getColorClassName } = useTheme();

    const [ selectedProblem, setSelectedProblem ] = useState<IProblemType>();
    const [ isOpened, setIsOpened ] = useState<boolean>(true);

    const backgroundColorClassName = getColorClassName(themeColors.baseColor200);

    useEffect(() => {
        if (problems.length > 0) {
            setSelectedProblem(problems[0]);
        }
    }, [ problems, problems.length ]);

    return (
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
                    const isActive = selectedProblem?.id === problem.id;
                    return (
                        <div
                          className={`${styles.problem} ${isActive
                              ? styles.activeProblem
                              : ''}`}
                          style={{ borderBottom: `1px solid ${themeColors.textColor}` }}
                          onClick={() => setSelectedProblem(problem)}
                        >
                            <div>{problem.name}</div>
                            <div>0/100</div>
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
    );
};

export default ContestProblems;
