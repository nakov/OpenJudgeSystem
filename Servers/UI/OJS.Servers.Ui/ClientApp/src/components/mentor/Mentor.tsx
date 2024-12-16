import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import ReactMarkdown from 'react-markdown';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { ChatMessageRole } from 'src/common/enums';
import { IMentorConversationMessage } from 'src/common/types';
import useTheme from 'src/hooks/use-theme';
import { useStartConversationMutation } from 'src/redux/services/mentorService';
import { useAppSelector } from 'src/redux/store';
import concatClassNames from 'src/utils/class-names';
import { getMentorConversationDate } from 'src/utils/dates';

import mentorAvatar from '../../assets/mentor.png';

import styles from './Mentor.module.scss';

interface IMentorProps {
    problemId?: number;
    problemName?: string;
    contestId?: number;
    contestName?: string;
    categoryName?: string;
    submissionTypeName?: string;
    isMentorAllowed: boolean;
}

const Mentor = (props: IMentorProps) => {
    const { problemId, problemName, contestId, contestName, categoryName, submissionTypeName, isMentorAllowed } = props;
    const { internalUser: user } = useAppSelector((state) => state.authorization);
    const { isDarkMode } = useTheme();

    const [ isOpen, setIsOpen ] = useState(false);
    const [ showBubble, setShowBubble ] = useState(true);
    const [ inputMessage, setInputMessage ] = useState('');
    const [ conversationDate, setConversationDate ] = useState<Date | null>(null);
    const [ conversationMessages, setConversationMessages ] = useState<IMentorConversationMessage[]>([
        {
            content: 'Здравейте, аз съм Вашият ментор за писане на код, как мога да Ви помогна?',
            role: ChatMessageRole.Assistant,
            sequenceNumber: 1,
            // Using an invalid problemId on purpose, this is just a placeholder message.
            problemId: -1,
        },
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [ startConversation, { data: conversationData, error, isLoading } ] = useStartConversationMutation();

    const isInputLengthExceeded = useMemo(
        () => inputMessage.length > (conversationData?.maxUserInputLength ?? 4096),
        [ conversationData, inputMessage ],
    );

    const isChatDisabled = useMemo(
        () => inputMessage.trim() === '' ||
            isLoading ||
            isInputLengthExceeded ||
            problemId === undefined ||
            problemName === undefined ||
            contestId === undefined ||
            contestName === undefined ||
            categoryName === undefined ||
            submissionTypeName === undefined,
        [
            categoryName,
            contestId,
            contestName,
            inputMessage,
            isLoading,
            problemId,
            problemName,
            isInputLengthExceeded,
            submissionTypeName,
        ],
    );

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [ conversationMessages ]);

    useEffect(() => {
        if (conversationData) {
            setConversationMessages(conversationData.messages.filter((m) => m.role !== ChatMessageRole.System));
        }
    }, [ conversationData ]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen) {
                setShowBubble(false);
            }
        }, 15000);

        return () => clearTimeout(timer);
    }, [ isOpen ]);

    const handleSendMessage = () => {
        if (inputMessage.trim() === '') {
            return;
        }

        if (problemId === undefined ||
            problemName === undefined ||
            contestId === undefined ||
            contestName === undefined ||
            categoryName === undefined ||
            submissionTypeName === undefined) {
            return;
        }

        if (conversationDate === null) {
            setConversationDate(new Date());
        }

        const message: IMentorConversationMessage = {
            content: inputMessage,
            role: ChatMessageRole.User,
            sequenceNumber: Math.max(...conversationMessages.map((cm) => cm.sequenceNumber)) + 1,
            problemId,
        };

        const updatedConversationMessages = [ ...conversationMessages, message ];
        setConversationMessages(updatedConversationMessages);

        startConversation({
            userId: user.id,
            messages: updatedConversationMessages,
            problemId,
            problemName,
            contestId,
            contestName,
            categoryName,
            submissionTypeName,
        });

        setInputMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isChatDisabled) {
                handleSendMessage();
            }
        }
    };

    const handleToggleChat = () => {
        setIsOpen(!isOpen);
        setShowBubble(false);
    };

    if (!isMentorAllowed) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <></>;
    }

    return (
        <div className={styles.mentor} aria-hidden={false}>
            {showBubble && !isOpen && (
                <div className={styles.bubbleMessage}>
                    <div className={styles.primaryText}>The Code Wizard</div>
                    <div className={styles.secondaryText}>is here to help!</div>
                </div>
            )}
            <Button
              variant="contained"
              className={styles.mentorButton}
              onClick={handleToggleChat}
            >
                <img src={mentorAvatar} alt="Mentor Avatar" />
            </Button>
            <Dialog
              open={isOpen}
              maxWidth="sm"
              fullWidth
              classes={{
                  paper: styles.dialogPaper,
                  root: styles.dialogRoot,
              }}
              PaperProps={{
                  style: {
                      position: 'fixed',
                      bottom: '96px',
                      right: '24px',
                      margin: 0,
                  },
              }}
              hideBackdrop
              disablePortal
              keepMounted
              disableEnforceFocus
              disableAutoFocus
            >
                <DialogTitle className={styles.dialogTitle}>
                    <div className={styles.mentorTitleContainer}>
                        <div className={styles.mentorTitleAvatar}>
                            <img src={mentorAvatar} alt="Mentor Avatar" />
                        </div>
                        <div className={styles.titleTextContainer}>
                            <span className={styles.mentorTitleText}>The Code Wizard</span>
                            {problemName && (
                                <span className={styles.problemNameText}>{problemName}</span>
                            )}
                        </div>
                    </div>
                </DialogTitle>

                <DialogContent
                  className={concatClassNames(
                      styles.dialogContent,
                      isDarkMode
                          ? styles.darkDialogContent
                          : styles.lightDialogContent,
                  )}
                >
                    <div className={styles.messagesContainer}>
                        <div className={styles.conversationStartDate}>
                            {conversationDate !== null && getMentorConversationDate(conversationDate)}
                        </div>
                        {conversationMessages.map((message) => (
                            <div className={styles.messageContainer} key={message.sequenceNumber}>
                                {(message.role === ChatMessageRole.Assistant || message.role === ChatMessageRole.Information) && (
                                    <div className={styles.mentorMessageAvatar}>
                                        <img src={mentorAvatar} alt="Mentor Avatar" />
                                    </div>
                                )}
                                <div
                                  className={`${styles.message} ${
                                      message.role === ChatMessageRole.User
                                          ? styles.userMessage
                                          : styles.mentorMessage
                                  }`}
                                >
                                    <ReactMarkdown className={styles.markdownContent}>
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className={styles.message}>
                                <div className={styles.typingIndicator}>
                                    <span className={concatClassNames(styles.dot, isDarkMode
                                        ? styles.darkDot
                                        : styles.lightDot)}
                                    />
                                    <span className={concatClassNames(styles.dot, isDarkMode
                                        ? styles.darkDot
                                        : styles.lightDot)}
                                    />
                                    <span className={concatClassNames(styles.dot, isDarkMode
                                        ? styles.darkDot
                                        : styles.lightDot)}
                                    />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                        {' '}
                    </div>
                    {error && (
                        <div className={styles.errorMessage}>
                            {((error as any)?.data?.detail ?? 'Failed to send the message. Please try again.')}
                        </div>
                    )}
                </DialogContent>
                <DialogActions className={styles.dialogActions}>
                    <TextField
                      fullWidth
                      multiline
                      maxRows={4}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Напишете вашето съобщение..."
                      variant="standard"
                      size="small"
                      disabled={isLoading}
                      className={styles.typingField}
                    />
                    <div className={styles.sendButtonContainer}>
                        <Button
                          onClick={handleSendMessage}
                          disabled={isChatDisabled}
                        >
                            <IoMdSend
                              className={
                                    isChatDisabled
                                        ? styles.sendIconDisabled
                                        : styles.sendIconActive
                                }
                            />
                        </Button>
                        {isInputLengthExceeded && (
                            <div className={concatClassNames(styles.errorBubble, styles.bubbleMessage)}>
                                <div className={styles.secondaryText}>
                                    {`Your message exceeds the ${conversationData?.maxUserInputLength
                                        ? `${conversationData.maxUserInputLength}-`
                                        : ''}character limit. Please shorten it.`}
                                </div>
                            </div>
                        )}
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Mentor;
