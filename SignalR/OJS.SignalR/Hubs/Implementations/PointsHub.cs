namespace OJS.SignalR.Hubs.Implementations;

using OJS.SignalR.Attributes;
using OJS.Services.Ui.Models.Submissions;

[SignalRRoute("/pointshub")]
public class PointsHub : BaseHub<IPointsHub>
{
    public async Task UpdatePoints(string userId, FullDetailsPublicSubmissionsServiceModel latestSubmission)
        => await this.Clients.User(userId).ReceivePointsUpdate(latestSubmission);
}