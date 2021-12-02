namespace OJS.Data.Models.Contests
{
    using OJS.Common.Enumerations;
    using SoftUni.Data.Infrastructure.Models;
    using OJS.Data.Models.Participants;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using static OJS.Data.Validation.ConstraintConstants.Contest;

    public class ContestQuestion : DeletableAuditInfoEntity<int>
    {
        public int ContestId { get; set; }

        public virtual Contest Contest { get; set; }

        [MaxLength(QuestionMaxLength)]
        [MinLength(QuestionMinLength)]
        public string Text { get; set; }

        [DefaultValue(true)]
        public bool AskOfficialParticipants { get; set; }

        [DefaultValue(true)]
        public bool AskPracticeParticipants { get; set; }

        public ContestQuestionType Type { get; set; }

        public string RegularExpressionValidation { get; set; }

        public virtual ICollection<ContestQuestionAnswer> Answers { get; set; } = new HashSet<ContestQuestionAnswer>();

        public virtual ICollection<ParticipantAnswer> ParticipantAnswers { get; set; } = new HashSet<ParticipantAnswer>();
    }
}