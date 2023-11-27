namespace OJS.Common.Contracts;

public interface IDetectPlagiarismVisitor
{
    string Visit(string text);
}