import React, { useMemo } from 'react';
import Slider from 'react-slick';

import { ContestStatus } from '../../common/contest-types';
import { IIndexContestsType } from '../../common/types';
import concatClassNames from '../../utils/class-names';
import { ButtonSize, LinkButton, LinkButtonType } from '../guidelines/buttons/Button';
import Heading from '../guidelines/headings/Heading';

import ContestCard from './contest-card/ContestCard';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './ContestsList.module.scss';

interface IContestsListProps {
    title: string;
    contests: IIndexContestsType[];
    contestStatus: ContestStatus;
}

const ContestsList = ({
    title,
    contests,
    contestStatus,
}: IContestsListProps) => {
    const [ contestItemsToShow, setContestItemsToShow ] = React.useState(4);

    const handleResize = () => {
        if (window.innerWidth <= 950) {
            setContestItemsToShow(1);
        } else if (window.innerWidth <= 1350) {
            setContestItemsToShow(2);
        } else if (window.innerWidth <= 1540) {
            setContestItemsToShow(3);
        } else {
            setContestItemsToShow(4);
        }
    };

    React.useEffect(() => {
        handleResize();
    });

    React.useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const contestStatusIndex = useMemo(
        () => {
            const contestStatusArr = Object.values(ContestStatus);

            return contestStatusArr.indexOf(contestStatus) + 1;
        },
        [ contestStatus ],
    );

    const seeAllButtonClassName = useMemo(
        () => `btn-see-all-contests-${contestStatusIndex}`,
        [ contestStatusIndex ],
    );

    const contestsSeeAllButtonClassName = useMemo(
        () => concatClassNames(styles.contestsSeeAllButton, seeAllButtonClassName),
        [ seeAllButtonClassName ],
    );

    const allContestCardsContainerClassName = useMemo(
        () => `${contestStatusIndex}-contests-cards-list`,
        [ contestStatusIndex ],
    );

    const allContestsCardsContainer = useMemo(
        () => concatClassNames(styles.contestCardsContainer, allContestCardsContainerClassName),
        [ allContestCardsContainerClassName ],
    );

    const link = useMemo(
        () => `/contests?status=${contestStatus}`,
        [ contestStatus ],
    );

    return (
        <>
            <Heading>
                {title}
                {' '}
                Contests
            </Heading>
            <div id="index-contests-list" className={allContestsCardsContainer}>
                <Slider
                  className={styles.customSlider}
                  infinite
                  speed={500}
                  slidesToShow={contestItemsToShow}
                  slidesToScroll={1}
                  dots
                >
                    {contests.map((contest) => <ContestCard key={contest.id} contest={contest} />) }
                </Slider>
                <LinkButton
                  id="button-see-all-contests"
                  to={link}
                  text="See All"
                  type={LinkButtonType.secondary}
                  size={ButtonSize.small}
                  className={contestsSeeAllButtonClassName}
                />
            </div>
        </>
    );
};

export default ContestsList;
