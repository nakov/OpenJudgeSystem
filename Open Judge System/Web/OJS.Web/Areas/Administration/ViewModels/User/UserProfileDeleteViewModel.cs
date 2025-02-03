namespace OJS.Web.Areas.Administration.ViewModels.User
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.Linq.Expressions;
    using System.Web.Mvc;
    using OJS.Common.DataAnnotations;
    using OJS.Data.Models;

    using static OJS.Common.Constants.EditorTemplateConstants;

    public class UserProfileDeleteViewModel
    {
        [ExcludeFromExcel]
        public static Expression<Func<UserProfile, UserProfileDeleteViewModel>> FromUserProfile =>
            user => new UserProfileDeleteViewModel
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
            };

        [HiddenInput(DisplayValue = false)]
        public string Id { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        [Display(Name = "Enter your username to confirm deletion")]
        [UIHint(SingleLineText)]
        public string InitiatorUsername { get; set; }
    }
}