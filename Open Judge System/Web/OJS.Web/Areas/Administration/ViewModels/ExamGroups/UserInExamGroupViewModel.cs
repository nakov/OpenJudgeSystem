﻿namespace OJS.Web.Areas.Administration.ViewModels.ExamGroups
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.Linq.Expressions;
    using System.Web.Mvc;

    using OJS.Common.Attributes;
    using OJS.Data.Models;

    using Resource = Resources.Areas.Administration.Users.ViewModels.UserProfileAdministration;

    public class UserInExamGroupViewModel
    {
        public static Expression<Func<UserProfile, UserInExamGroupViewModel>> FromUserProfile =>
            user => new UserInExamGroupViewModel
            {
                UserId = user.Id,
                Username = user.UserName,
                Email = user.Email,
                FirstName = user.UserSettings.FirstName,
                LastName = user.UserSettings.LastName
            };

        [Display(Name = "ID")]
        [HiddenInput(DisplayValue = false)]
        public string UserId { get; set; }

        [Display(Name = "UserName", ResourceType = typeof(Resource))]
        [UIHint("NonEditable")]
        public string Username { get; set; }

        [DataType(DataType.EmailAddress)]
        [UIHint("SingleLineText")]
        public string Email { get; set; }

        [Display(Name = "First_name", ResourceType = typeof(Resource))]
        [LocalizedDisplayFormat(
            NullDisplayTextResourceName = "Null_display_text",
            NullDisplayTextResourceType = typeof(Resource),
            ConvertEmptyStringToNull = true)]
        [UIHint("SingleLineText")]
        public string FirstName { get; set; }

        [Display(Name = "Last_name", ResourceType = typeof(Resource))]
        [LocalizedDisplayFormat(
            NullDisplayTextResourceName = "Null_display_text",
            NullDisplayTextResourceType = typeof(Resource),
            ConvertEmptyStringToNull = true)]
        [UIHint("SingleLineText")]
        public string LastName { get; set; }
    }
}