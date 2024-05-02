namespace OJS.Services.Infrastructure
{
    using OJS.Services.Infrastructure.Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class CompositeValidationResult : ValidationResult
    {
        private CompositeValidationResult(IEnumerable<ValidationResult> invalidResults)
            : base()
            => this.InvalidResults = invalidResults;

        public override string Message
            => string.Join(Environment.NewLine, this.InvalidResults.Select(vr => vr.Message));

        private IEnumerable<ValidationResult> InvalidResults { get; set; }

        public static ValidationResult Compose(params IEnumerable<ValidationResult>[] validationResultCollections)
            => Compose(validationResultCollections
                .SelectMany(x => x)
                .ToList());

        public static ValidationResult Compose(params ValidationResult[] validationResults)
            => Compose(validationResults.ToList());

        public static ValidationResult Compose(IList<ValidationResult> validationResults)
            => validationResults
                .Any(vr => !vr.IsValid)
                ? new CompositeValidationResult(validationResults.Where(vr => !vr.IsValid))
                : Valid();
    }
}
