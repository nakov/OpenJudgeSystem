namespace OJS.Services.Ui.Business.Implementations
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using OJS.Services.Ui.Data;
    using OJS.Services.Ui.Models.Participations;
    using X.PagedList;

    public class ParticipationsBusinessService : IParticipationsBusinessService
    {
        private IParticipantsDataService participantsData;

        public ParticipationsBusinessService(IParticipantsDataService participantsData)
            => this.participantsData = participantsData;

        public async Task<IEnumerable<ParticipationServiceModel>> GetParticipationsByUserId(string? userId)
            => await this.participantsData
                .GetAllByUser(userId)
                .ToList()
                .GroupBy(x => x.Contest)
                .Select(c => new ParticipationServiceModel
                {
                    Id = c.Key.Id,
                    ContestId = c.Key.Id,
                    ContestName = c.Key.Name!,
                    RegistrationTime = c.Key.CreatedOn,
                    ContestCompeteMaximumPoints = c.Key.ProblemGroups
                        .Where(pg => pg.Problems.Any(p => !p.IsDeleted))
                        .AsEnumerable()
                        .Sum(pg => pg.Problems.FirstOrDefault() !.MaximumPoints),
                    ContestPracticeMaximumPoints = c.Key.ProblemGroups
                        .SelectMany(pg => pg.Problems)
                        .Where(x => !x.IsDeleted)
                        .AsEnumerable()
                        .Sum(pr => pr.MaximumPoints),
                    CompeteResult = c.Where(x => x.IsOfficial)
                        .ToList()
                        .Select(p => p.Submissions
                            .Where(x => !x.IsDeleted)
                            .GroupBy(s => s.ProblemId)
                            .Sum(x => x.Max(z => z.Points)))
                        .FirstOrDefault(),
                    PracticeResult = c.Where(x => !x.IsOfficial)
                        .ToList()
                        .Select(p => p.Submissions
                            .Where(x => !x.IsDeleted)
                            .GroupBy(s => s.ProblemId)
                            .Sum(x => x.Max(z => z.Points)))
                        .FirstOrDefault(),
                })
                .OrderByDescending(x => x.RegistrationTime)
                .ToListAsync();
    }
}