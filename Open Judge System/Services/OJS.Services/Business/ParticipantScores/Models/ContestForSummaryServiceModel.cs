using System.Collections.Generic;
using OJS.Data.Models;

namespace OJS.Services.Business.ParticipantScores.Models
{
    public class ContestForSummaryServiceModel
    {
        public int Contest { get; set; }
        
        public IEnumerable<Participant> Participants { get; set; }
    }
}