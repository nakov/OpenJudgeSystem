namespace OJS.Web.Areas.Administration.ViewModels.Lecturers
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.Linq.Expressions;

    using OJS.Common.DataAnnotations;
    using OJS.Data.Models;

    public class LecturerGridViewModel
    {
        [ExcludeFromExcel]
        public static Expression<Func<UserProfile, LecturerGridViewModel>> ViewModel
        {
            get
            {
                return x =>
                    new LecturerGridViewModel
                    {
                        UserId = x.Id,
                        UserName = x.UserName,
                        FirstName = x.UserSettings.FirstName ?? "No name",
                        LastName = x.UserSettings.LastName ?? "No name",
                        Email = x.Email
                    };
            }
        }

        public string UserId { get; set; }

        [Display(Name = "Username")]
        [Required(ErrorMessage = "Username is mandatory.")]
        public string UserName { get; set; }

        [Display(Name = "First name")]
        public string FirstName { get; set; }

        [Display(Name = "Last name")]
        public string LastName { get; set; }

        [Display(Name = "E-mail")]
        public string Email { get; set; }
    }
}