namespace OJS.SignalR.Hubs;

using OJS.Common.Extensions;
using Microsoft.AspNetCore.SignalR;

public abstract class BaseHub<THub> : Hub<THub>
    where THub : class
{
    public override async Task OnConnectedAsync()
    {
        var context = this.Context.GetHttpContext();
        var userId = context!.User.GetId();

        if (!string.IsNullOrWhiteSpace(userId))
        {
            // Adding the current connection to a group of connections named after the user's id
            await this.Groups.AddToGroupAsync(this.Context.ConnectionId, userId);
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var context = this.Context.GetHttpContext();
        var userId = context!.User.GetId();

        if (!string.IsNullOrEmpty(userId))
        {
            await this.Groups.RemoveFromGroupAsync(this.Context.ConnectionId, userId);
        }

        await base.OnDisconnectedAsync(exception);
    }
}