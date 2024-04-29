namespace OJS.Services.Administration.Business.Similarity;

public interface IDetectSimilarityVisitor
{
    string Visit(string text);
}