#nullable disable
namespace OJS.Workers.Checkers
{
    using OJS.Workers.Common;

    public class ExactChecker : Checker
    {
        public override CheckerResult Check(string inputData, string receivedOutput, string expectedOutput, bool isTrialTest)
        {
            var result = this.CheckLineByLine(inputData, receivedOutput, expectedOutput, AreEqualExactLines, isTrialTest);
            return result;
        }
    }
}
