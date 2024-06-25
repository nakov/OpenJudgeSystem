interface IMultiLineTextProps {
    text: string | null | undefined;
    className?: string;
}

const MultiLineTextDisplay = ({ text, className } : IMultiLineTextProps) => {
    if (!text) {
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
