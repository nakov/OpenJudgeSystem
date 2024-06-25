interface IMultiLineTextProps {
    text: string;
    className?: string;
}

const MultiLineTextDisplay = ({ text, className } : IMultiLineTextProps) => (
    <div className={className}>
        {text.split('\n').map((line: string, index: number) => (
            <p key={index}>{line}</p>
        ))}
    </div>
);

export default MultiLineTextDisplay;
