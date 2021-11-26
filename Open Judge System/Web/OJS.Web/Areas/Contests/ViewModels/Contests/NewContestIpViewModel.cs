namespace OJS.Web.Areas.Contests.ViewModels.Contests
{
    using System.ComponentModel.DataAnnotations;

    public class NewContestIpViewModel
    {
        public int ContestId { get; set; }

        [Display(Name = "Password for new IP for contest")]
        [Required(ErrorMessage = "Please, enter password")]
        public string NewIpPassword { get; set; }
    }
}