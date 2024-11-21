import React, { useEffect, useMemo, useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { ChatMessageRole } from 'src/common/enums';
import { ExceptionData, IMentorConversationMessage, IProblemResourceType } from 'src/common/types';
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
    problemResources: IProblemResourceType[];
}

// TODO: Implement the logic for contest categories
// TODO: Fix error message
const Mentor = (props: IMentorProps) => {
    const { problemId, problemName, contestId, problemResources } = props;
    const [ isOpen, setIsOpen ] = useState(false);
    const [ showBubble, setShowBubble ] = useState(true);
    const [ inputMessage, setInputMessage ] = useState('');
    const [ conversationDate, setConversationDate ] = useState<Date | null>(null);
    const { isDarkMode } = useTheme();

    // The test messages will be removed when we merge the FE and BE.
    const [ conversationMessages, setConversationMessages ] = useState<IMentorConversationMessage[]>([
        {
            content: 'Welcome to the mentor chat! How can I assist you today?',
            role: ChatMessageRole.Assistant,
            sequenceNumber: 1,
        },
        {
            content: 'Can you help me with this problem? I’m stuck on the implementation.',
            role: ChatMessageRole.User,
            sequenceNumber: 2,
        },
        {
            content: 'Sure, please provide more details about the issue you are facing.',
            role: ChatMessageRole.Assistant,
            sequenceNumber: 3,
        },
    ]);

    const { internalUser: user } = useAppSelector((state) => state.authorization);

    const [ startConversation, {
        data: conversationData,
        error,
        isLoading,
    } ] = useStartConversationMutation();

    const isChatDisabled = useMemo(() => inputMessage.trim() === '' ||
        isLoading ||
        problemId === undefined ||
        problemName === undefined, [ inputMessage, isLoading, problemId, problemName ]);

    useEffect(() => {
        if (conversationData) {
            setConversationMessages(conversationData.conversationMessages);
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

        if (problemId === undefined || problemName === undefined || contestId === undefined) {
            return;
        }

        if (conversationDate === null) {
            setConversationDate(new Date());
        }

        const message: IMentorConversationMessage = {
            content: inputMessage,
            role: ChatMessageRole.User,
            sequenceNumber: Math.max(...conversationMessages.map((cm) => cm.sequenceNumber)) + 1,
        };

        const updatedConversationMessages = [ ...conversationMessages, message ];
        setConversationMessages(updatedConversationMessages);

        startConversation({
            userId: user.id,
            conversationMessages: updatedConversationMessages,
            problemId,
            problemName,
            problemResources,
            contestId,
        });

        setInputMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleToggleChat = () => {
        setIsOpen(!isOpen);
        setShowBubble(false);
    };

    return (
        <div className={styles.mentor}>
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
                <img
                  src={mentorAvatar}
                  alt="Assistant Avatar"
                />
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
                    <div className={styles.mentorTitleAvatar}>
                        <img
                          src={mentorAvatar}
                          alt="Ментор Avatar"
                        />
                    </div>
                    The Code Wizard
                </DialogTitle>
                <DialogContent className={concatClassNames(styles.dialogContent, isDarkMode
                    ? styles.darkDialogContent
                    : styles.lightDialogContent)}
                >
                    <div className={styles.messagesContainer}>
                        <div
                          className={styles.conversationStartDate}
                        >
                            {conversationDate !== null && getMentorConversationDate(conversationDate)}
                        </div>
                        {conversationMessages.map((message) => (
                            <div className={styles.messageContainer} key={message.sequenceNumber}>
                                {message.role === ChatMessageRole.Assistant && (
                                    <div className={styles.mentorMessageAvatar}>
                                        <img
                                          src={mentorAvatar}
                                          alt="Assistant Avatar"
                                        />
                                    </div>
                                )}
                                <div
                                  className={`${styles.message} ${
                                      message.role === ChatMessageRole.User
                                          ? styles.userMessage
                                          : styles.mentorMessage
                                  }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className={styles.message}>
                                <div className={styles.typingIndicator}>
                                    <span className={styles.dot} />
                                    <span className={styles.dot} />
                                    <span className={styles.dot} />
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className={styles.errorMessage}>
                                {(error as ExceptionData).message}
                                Failed to send message. Please try again.
                            </div>
                        )}
                    </div>
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
                    <Button
                      onClick={handleSendMessage}
                      disabled={isChatDisabled}
                      sx={{ '&:hover': { backgroundColor: 'inherit' } }}
                    >
                        <IoMdSend
                          onClick={handleSendMessage}
                          className={isChatDisabled
                              ? styles.sendIconDisabled
                              : styles.sendIconActive}
                        />
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Mentor;
