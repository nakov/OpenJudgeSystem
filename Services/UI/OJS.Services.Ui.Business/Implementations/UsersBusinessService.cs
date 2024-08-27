namespace OJS.Services.Ui.Business.Implementations;

using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Users;
using OJS.Services.Common;
using OJS.Services.Common.Extensions;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Ui.Business;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Search;
using OJS.Services.Ui.Models.Users;
using System.Linq;
using System.Threading.Tasks;
using X.PagedList;
using static OJS.Common.GlobalConstants.Roles;

public class UsersBusinessService : IUsersBusinessService
{
    private readonly IUsersProfileDataService usersProfileData;
    private readonly IUserProviderService userProvider;

    public UsersBusinessService(
        IUsersProfileDataService usersProfileData,
        IUserProviderService userProvider)
    {
        this.usersProfileData = usersProfileData;
        this.userProvider = userProvider;
    }

    public async Task<UserAuthInfoServiceModel?> GetAuthInfo()
    {
        var currentUser = this.userProvider.GetCurrentUser();

        if (currentUser.IsNull())
        {
            return null;
        }

        var profile = await this.usersProfileData
            .GetByIdQuery(currentUser.Id!)
            .Include(u => u.UsersInRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync();

        return profile?.Map<UserAuthInfoServiceModel>();
    }

    /// <summary>
    /// Retrieves either a short or full user profile based on the logged-in user's permissions.
    /// Only Administrators or profile owners retrieve full user profile.
    /// User id is returned as empty string if the logged in user is not Administrator or admin.
    /// </summary>
    /// <param name="username">The username of the profile to retrieve.</param>
    /// <returns>
    /// A task that returns a <see cref="UserProfileServiceModel"/> containing the user's profile,
    /// or null if not found or accessible.
    /// </returns>
    /// <exception cref="BusinessServiceException">
    /// Thrown if the username is invalid or does not exist.
    /// </exception>
    public async Task<UserProfileServiceModel?> GetUserShortOrFullProfileByLoggedInUserIsAdminOrProfileOwner(string? username)
    {
        var currentUser = this.userProvider.GetCurrentUser();

        if (currentUser.Id == null && (username.IsNull() || username!.IsEmpty()))
        {
            throw new BusinessServiceException("Empty username is not valid");
        }

        var userWithUsernameExists = await this.usersProfileData.Exists(p => p.UserName == username);

        if (!userWithUsernameExists)
        {
            throw new BusinessServiceException("User with this username does not exist");
        }

        if (currentUser.Id == null && userWithUsernameExists)
        {
            return await Task.FromResult(new UserProfileServiceModel
            {
                UserName = username ?? string.Empty,
            });
        }

        bool isLoggedInUserAdminOrProfileOwner = this.IsUserInRolesOrProfileOwner(
            username,
            [Administrator]);

        var profile = await (isLoggedInUserAdminOrProfileOwner
            ? this.usersProfileData
                .GetByUsername<UserProfileServiceModel>(username)
            : this.GetByUsernameAsShortProfile(username));

        profile!.Id = isLoggedInUserAdminOrProfileOwner ? profile.Id : string.Empty;

        return profile;
    }

    /// <summary>
    /// Retrieves the user ID associated with a given username, based on the logged-in user's permissions.
    /// Only Administrators, Lecturers, or profile owners can retrieve the user ID.
    /// </summary>
    /// <param name="username">The username whose associated user ID is to be retrieved.</param>
    /// <returns>
    /// A task that returns the user ID as a string, or null if not found or accessible.
    /// </returns>
    /// <exception cref="BusinessServiceException">
    /// Thrown if the username is invalid, does not exist, or the current user is not authorized to view this information.
    /// </exception>
    public async Task<string?> GetUserIdByUsername(string? username)
    {
        var currentUser = this.userProvider.GetCurrentUser();

        if (currentUser.Id == null && (username == null || username!.IsEmpty()))
        {
            throw new BusinessServiceException("Empty username is not valid");
        }

        var userWithUsernameExists = this.usersProfileData
            .Exists(p => p.UserName == username)
            .GetAwaiter().GetResult();

        if (!userWithUsernameExists)
        {
            throw new BusinessServiceException("User with this username does not exist");
        }

        bool isLoggedInUserAdminLecturerOrProfileOwner =
            currentUser.IsInRoles([Administrator, Lecturer]) ||
            this.usersProfileData.GetByIdQuery(currentUser.Id!).Any(u => u.UserName == username);

        if (!isLoggedInUserAdminLecturerOrProfileOwner)
        {
            throw new BusinessServiceException("You are not authorized to view this information");
        }

        var profile = await this.GetByUsernameAsShortProfile(username);

        return profile!.Id;
    }

    public async Task<UserSearchServiceResultModel> GetSearchUsersByUsername(SearchServiceModel model)
    {
        var modelResult = new UserSearchServiceResultModel();

        var allUsersQueryable = this.usersProfileData
            .GetAll()
            .Where(u => u.UserName!.Contains(model.SearchTerm!));

        var searchUsers = await allUsersQueryable
            .MapCollection<UserSearchServiceModel>()
            .ToPagedListAsync(model.PageNumber, model.ItemsPerPage);

        modelResult.Users = searchUsers;
        modelResult.TotalUsersCount = allUsersQueryable.Count();

        return modelResult;
    }

    public async Task AddOrUpdateUser(UserProfile userEntity)
        => await this.usersProfileData.AddOrUpdate<UserProfileServiceModel>(userEntity);

    public bool IsUserInRolesOrProfileOwner(string? profileUsername, string[] roles)
    {
        var currentUser = this.userProvider.GetCurrentUser();

        if (currentUser == null || string.IsNullOrEmpty(profileUsername))
        {
            return false;
        }

        return currentUser.IsInRoles(roles) ||
               this.usersProfileData.GetByIdQuery(currentUser.Id).Any(u => u.UserName == profileUsername);
    }

    //AsNoTracking() Method is added to prevent ''tracking query'' error.
    //Error is thrown when we map from UserSettings (owned entity) without including the
    //UserProfile (owner entity) in the query.
    private async Task<UserProfileServiceModel?> GetByUsernameAsShortProfile(string? username) =>
        await this.usersProfileData.GetByUsername(username)
            .AsNoTracking()
            .Select(user => new UserProfileServiceModel
            {
                UserName = user.UserName!,
                Id = user.Id,
            })
            .FirstOrDefaultAsync();
}