/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect, useMemo, useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import {
    Autocomplete,
    Box,
    FormControl,
    MenuItem,
    styled,
    TextField,
    Tooltip, tooltipClasses,
    TooltipProps,
    Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment';
import { ThemeMode } from 'src/common/enums';
import {
    IChangeParticipationTimeForMultipleParticipants, IChangeParticipationTimeForSingleParticipant,
    IContestAdministration,
    IUserAutocompleteData,
} from 'src/common/types';
import { getContestsDetailsPageUrl } from 'src/common/urls/compose-client-urls';
import TabsInView from 'src/components/administration/common/tabs/TabsInView';
import FormActionButton from 'src/components/administration/form-action-button/FormActionButton';
import { handleDateTimePickerChange } from 'src/components/administration/utils/mui-utils';
import ExternalLink from 'src/components/guidelines/buttons/ExternalLink';
import useDelayedSuccessEffect from 'src/hooks/common/use-delayed-success-effect';
import useSuccessMessageEffect from 'src/hooks/common/use-success-message-effect';
import {
    useChangeParticipationTimeForMultipleParticipantsMutation, useChangeParticipationTimeForSingleParticipantMutation,
} from 'src/redux/services/admin/participantsAdminService';
import { useGetUsersAutocompleteQuery } from 'src/redux/services/admin/usersAdminService';
import { convertToUtc, getDateAsLocal } from 'src/utils/administration/administration-dates';
import concatClassNames from 'src/utils/class-names';
import { getAndSetExceptionMessage } from 'src/utils/messages-utils';
import { renderErrorMessagesAlert } from 'src/utils/render-utils';
import clearSuccessMessages from 'src/utils/success-messages-utils';

// eslint-disable-next-line css-modules/no-unused-class
import formStyles from '../../common/styles/FormStyles.module.scss';
import styles from './ChangeParticipantsTime.module.scss';

interface IChangeParticipantsTimeProps {
    contest: IContestAdministration;
    setParentSuccessMessage: Function;
    onSuccess: Function;
}

enum CHANGE_PARTICIPANTS_TIME_LISTED_DATA {
    MULTIPLE_PARTICIPANTS = 'multipleparticipants',
    SINGLE_PARTICIPANT = 'singleparticipant',
}

const ChangeParticipantsTime = ({ contest, setParentSuccessMessage, onSuccess } : IChangeParticipantsTimeProps) => {
    const durationInMinutes = useMemo(() => {
        const [ hours, minutes, seconds ] = (contest?.duration ?? '00:00:00').split(':').map(Number);
        return hours * 60 + minutes + seconds / 60;
    }, [ contest?.duration ]);

    const getDefaultDate = (duration: number) => {
        const date = moment().subtract(duration, 'minutes');

        return date.isValid()
            ? getDateAsLocal(date.toDate())
            : getDateAsLocal(new Date());
    };

    const [
        changeParticipationTimeForMultipleParticipants,
        setChangeParticipationTimeForMultipleParticipants,
    ] = useState<IChangeParticipationTimeForMultipleParticipants>({
        contestId: contest?.id ?? 0,
        contestName: contest?.name ?? '',
        timeInMinutes: 0,
        changeParticipationTimeRangeStart: getDefaultDate(durationInMinutes),
        changeParticipationTimeRangeEnd: getDefaultDate(0),
    });

    const [
        changeParticipationTimeForSingleParticipant,
        setChangeParticipationTimeForSingleParticipant,
    ] = useState<IChangeParticipationTimeForSingleParticipant>({
        contestId: contest?.id ?? 0,
        contestName: contest?.name ?? '',
        timeInMinutes: 0,
        userId: '',
        username: '',
    });

    const [ errorMessages, setErrorMessages ] = useState<Array<string>>([]);
    const [ tabName, setTabName ] = useState(CHANGE_PARTICIPANTS_TIME_LISTED_DATA.MULTIPLE_PARTICIPANTS);
    const [ usersAutocomplete, setUsersAutocomplete ] = useState<Array<IUserAutocompleteData>>([]);
    const [ usersSearchString, setUsersSearchString ] = useState<string>('');
    const { data: usersAutocompleteData } = useGetUsersAutocompleteQuery([ usersSearchString ]);

    const [
        changeTimeForMultipleParticipants,
        {
            data: changeForMultipleData,
            isLoading: isChangingForMultiple,
            isSuccess: isSuccessfullyChangedForMultiple,
            error: changeForMultipleError,
            reset: resetForMultiple,
        },
    ] = useChangeParticipationTimeForMultipleParticipantsMutation();

    const [
        changeTimeForSingleParticipant,
        {
            data: changeForSingleData,
            isLoading: isChangingForSingle,
            isSuccess: isSuccessfullyChangedForSingle,
            error: changeForSingleError,
            reset: resetForSingle,
        },
    ] = useChangeParticipationTimeForSingleParticipantMutation();

    const handleSuccess = () => {
        onSuccess();

        if (isSuccessfullyChangedForMultiple) {
            resetForMultiple();
        }

        if (isSuccessfullyChangedForSingle) {
            resetForSingle();
        }
    };

    useDelayedSuccessEffect({
        isSuccess: isSuccessfullyChangedForMultiple || isSuccessfullyChangedForSingle,
        onSuccess: handleSuccess,
    });

    useSuccessMessageEffect({
        data: [
            { message: changeForMultipleData, shouldGet: isSuccessfullyChangedForMultiple },
            { message: changeForSingleData, shouldGet: isSuccessfullyChangedForSingle },
        ],
        setParentSuccessMessage,
        clearFlags: [ isChangingForMultiple, isChangingForSingle ],
    });

    useEffect(() => {
        getAndSetExceptionMessage([ changeForMultipleError, changeForSingleError ], setErrorMessages);
        clearSuccessMessages({ setParentSuccessMessage });
    }, [ changeForMultipleError, changeForSingleError, setParentSuccessMessage ]);

    const onChangeForMultipleParticipants = (e: any) => {
        const name = e.target.name;
        let value = e.target.value;

        if (name?.includes('Time')) {
            value = convertToUtc(value);
        }

        if (name in changeParticipationTimeForMultipleParticipants) {
            setChangeParticipationTimeForMultipleParticipants((prevState) => ({
                ...prevState,
                [name]: name === 'timeInMinutes'
                    ? parseInt(value, 10)
                    : value,
            }));
        }
    };

    const onChangeForSingleParticipant = (e: any) => {
        const { name, value } = e.target;

        if (name in changeParticipationTimeForSingleParticipant) {
            setChangeParticipationTimeForSingleParticipant((prevState) => ({
                ...prevState,
                [name]: name === 'timeInMinutes'
                    ? parseInt(value, 10)
                    : value,
            }));
        }
    };

    const onTabChange = (event: React.SyntheticEvent, newValue: CHANGE_PARTICIPANTS_TIME_LISTED_DATA) => {
        setTabName(newValue);
    };

    const SectionTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: theme.palette.mode === ThemeMode.Light
                ? '#fff'
                : '#444',
            color: theme.palette.mode === ThemeMode.Light
                ? '#000'
                : '#fff',
            boxShadow: theme.shadows[1],
            fontSize: 14,
            border: theme.palette.mode === ThemeMode.Light
                ? '1px solid #ccc'
                : '1px solid #666',
        },
        [`& .${tooltipClasses.arrow}`]: {
            color: theme.palette.mode === ThemeMode.Light
                ? '#fff'
                : '#444',
            '&::before': {
                border: theme.palette.mode === ThemeMode.Light
                    ? '1px solid #ccc'
                    : '1px solid #666',
            },
        },
    }));

    const renderSingleParticipant = () => (
        <FormControl fullWidth>
            <div className={styles.durationWrapper}>
                <TextField
                  className={styles.duration}
                  type="number"
                  label="Change duration with (in minutes)"
                  variant="standard"
                  value={changeParticipationTimeForSingleParticipant.timeInMinutes}
                  onChange={(e) => onChangeForSingleParticipant(e)}
                  InputLabelProps={{ shrink: true }}
                  name="timeInMinutes"
                />
            </div>
            <Typography variant="subtitle1" className={styles.datesTitle}>
                Change the contest duration for the participant with the given username
            </Typography>
            <div className={styles.divider} />
            <Autocomplete
              sx={{ width: '50%' }}
              className={formStyles.centralize}
              options={usersAutocomplete}
              renderInput={(params) => <TextField {...params} label="Select User" />}
              onChange={(e, newValue) => {
                  onChangeForSingleParticipant({
                      target: {
                          name: 'userId',
                          value: newValue?.id || null,
                      },
                  });
                  onChangeForSingleParticipant({
                      target: {
                          name: 'username',
                          value: newValue?.userName || null,
                      },
                  });
              }}
              onInputChange={(e, value: string) => setUsersSearchString(value)}
              getOptionLabel={(option) => option?.userName || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(properties, option) => (
                  <MenuItem {...properties} key={option.id}>
                      {option.userName}
                  </MenuItem>
              )}
            />
            <FormActionButton
              className={formStyles.buttonsWrapper}
              buttonClassName={formStyles.button}
              onClick={() => changeTimeForSingleParticipant(changeParticipationTimeForSingleParticipant)}
              name="Change Time"
            />
        </FormControl>
    );

    const renderMultipleParticipants = () => (
        <Box>
            <div className={styles.durationWrapper}>
                <TextField
                  className={styles.duration}
                  type="number"
                  label="Change duration with (in minutes)"
                  variant="standard"
                  value={changeParticipationTimeForMultipleParticipants.timeInMinutes}
                  onChange={(e) => onChangeForMultipleParticipants(e)}
                  InputLabelProps={{ shrink: true }}
                  name="timeInMinutes"
                />
            </div>
            <Typography variant="subtitle1" className={styles.datesTitle}>
                Change the contest duration for participants created in the following interval
            </Typography>
            <div className={styles.divider} />
            <Box className={styles.dates}>
                <div className={styles.date}>
                    <DateTimePicker
                      name="changeParticipationTimeRangeStart"
                      label="Created After"
                      value={getDateAsLocal(changeParticipationTimeForMultipleParticipants.changeParticipationTimeRangeStart)}
                      onChange={(newValue) => handleDateTimePickerChange(
                          'changeParticipationTimeRangeStart',
                          newValue,
                          onChangeForMultipleParticipants,
                      )}
                    />
                    <SectionTooltip
                      title="Users who started competing after this time will be affected (The default value
                        is calculated by the following formula: [the current time] - [the participant full contest duration])"
                      arrow
                    >
                        <InfoIcon sx={{ width: '30px', height: '30px', marginRight: '3rem' }} />
                    </SectionTooltip>
                </div>
                <div className={styles.date}>
                    <DateTimePicker
                      name="changeParticipationTimeRangeEnd"
                      label="Created Before"
                      value={getDateAsLocal(changeParticipationTimeForMultipleParticipants.changeParticipationTimeRangeEnd)}
                      onChange={(newValue) => handleDateTimePickerChange(
                          'changeParticipationTimeRangeEnd',
                          newValue,
                          onChangeForMultipleParticipants,
                      )}
                    />
                    <SectionTooltip
                      title="Users who started competing
                        before this time will be affected (The default value is
                        set to the [current time])"
                      arrow
                    >
                        <InfoIcon sx={{ width: '30px', height: '30px', marginRight: '3rem' }} />
                    </SectionTooltip>
                </div>
                <FormActionButton
                  className={formStyles.buttonsWrapper}
                  buttonClassName={formStyles.button}
                  onClick={() => changeTimeForMultipleParticipants(changeParticipationTimeForMultipleParticipants)}
                  name="Change Time"
                />
            </Box>
        </Box>
    );

    useEffect(() => {
        if (usersAutocompleteData) {
            setUsersAutocomplete(usersAutocompleteData);
        }
    }, [ usersAutocompleteData ]);

    return (
        <>
            {renderErrorMessagesAlert(errorMessages)}
            <form className={formStyles.form}>
                <div className={styles.title}>
                    <div>
                        <Typography variant="h5" className={concatClassNames(formStyles.centralize, styles.datesTitle)}>
                            Change contest duration for participants
                        </Typography>
                        <Typography className={concatClassNames(formStyles.centralize, styles.link)} variant="h5">
                            {(contest.name && (
                                <ExternalLink
                                  to={getContestsDetailsPageUrl({
                                      contestId: contest.id,
                                      contestName: contest.name,
                                  })}
                                  text={contest.name}
                                />
                            )) || 'Contest form'}
                        </Typography>
                    </div>
                    <Typography variant="subtitle1" className={formStyles.centralize}>
                        Changes the contest duration only
                        for participants who started competing in a specified time interval in this contest or for
                        a specific user. Does not affect the total duration of the
                        contest nor its start or end time.
                    </Typography>
                </div>
                <TabsInView
                  onTabChange={onTabChange}
                  tabName={tabName}
                  tabs={[
                      {
                          value:
                            CHANGE_PARTICIPANTS_TIME_LISTED_DATA.MULTIPLE_PARTICIPANTS,
                          label: 'Multiple Participants',
                          node: renderMultipleParticipants,
                      },
                      {
                          value: CHANGE_PARTICIPANTS_TIME_LISTED_DATA.SINGLE_PARTICIPANT,
                          label: 'Single Participant',
                          node: renderSingleParticipant,
                      },
                  ]}
                />
            </form>
        </>
    );
};

export default ChangeParticipantsTime;
