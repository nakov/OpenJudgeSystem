import isNil from 'lodash/isNil';

import Text from '../../guidelines/text/Text';

import styles from './CompilerComment.module.scss';

interface ICompilerCommentProps {
    isCompiledSuccessfully: boolean;
    compilerComment: string;
}

const CompilerComment = ({ isCompiledSuccessfully, compilerComment }: ICompilerCommentProps) => {
    if (isCompiledSuccessfully) {
        return null;
    }

    if (isNil(compilerComment)) {
        return null;
    }

    return (
        <div className={styles.compilerComment}>
            <Text text="A compile time error occurred:" />
            <Text text={compilerComment} />
        </div>
    );
};

export default CompilerComment;
