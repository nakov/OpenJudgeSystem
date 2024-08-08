namespace OJS.SignalR.Hubs;

using OJS.Services.Ui.Models.Submissions;

public interface IPointsHub
{
    public Task ReceivePointsUpdate(FullDetailsPublicSubmissionsServiceModel latestSubmission);
}