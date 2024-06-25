import isEmpty from 'lodash/isEmpty';

interface IMultiLineTextProps {
    text: string;
    className?: string;
}

const MultiLineTextDisplay = ({ text, className } : IMultiLineTextProps) => {
    if (isEmpty(text)) {
        return null;
    }

    return (
        <div className={className}>
            {text.split('\n').map((line: string, index: number) => (
                <p key={index}>{line}</p>
            ))}
        </div>
    );
};

export default MultiLineTextDisplay;
