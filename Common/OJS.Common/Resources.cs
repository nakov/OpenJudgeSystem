namespace OJS.Common
{
    public class Resources
    {
        public static class ContestsGeneral
        {
            public const string Binary_files_not_allowed = "This submission type does not allow sending binary files";
            public const string Cancel = "Cancel";
            public const string Category_not_found = "This category does not exist!";
            public const string Compete = "Compete";
            public const string Practice = "Practice";
            public const string Contest = "Contest";
            public const string Contest_cannot_be_competed = "This contest cannot be competed!";
            public const string Contest_cannot_be_practiced = "This contest cannot be practiced!";
            public const string Contest_not_found = "Invalid contest id was provided!";
            public const string Contest_results_not_available = "This contest results are not available!";
            public const string Invalid_extention = "Invalid file extension";
            public const string Invalid_request = "Invalid request!";
            public const string Invalid_selection = "Invalid selection";
            public const string Main_categories = "Main categories";
            public const string Problem_not_assigned_to_user = "The problem is not part of your problems for the exam";
            public const string Problem_not_found = "The problem was not found!";
            public const string Problem_results_not_available = "You cannot view the results for this problem!";
            public const string Report_excel_format = "Ranking for {0} {1}.xls";
            public const string Resource_cannot_be_downloaded = "This resource cannot be downloaded!";
            public const string Solution_uploaded = "Solution uploaded.";
            public const string Submission_not_found = "Invalid submission requested!";
            public const string Submission_not_made_by_user = "This submission was not made by you!";
            public const string Submission_too_long = "The submitted code is too long!";
            public const string Submission_type_not_found = "Wrong submission type!";
            public const string Submission_was_sent_too_soon = "Submission was sent too soon!";
            public const string Text_upload_not_allowed = "This submission type does not allow sending text";
            public const string Upload_file = "Please upload file.";
            public const string User_has_not_processed_submission_for_problem = "You have unprocessed submission for this problem. Please wait until the submission is processed.";
            public const string User_is_not_registered_for_exam = "You are not registered for this exam!";
            public const string Yes = "Yes";
        }

        public static class ParticipantsBusiness
        {
            public const string Participant_does_not_exist = "Participant does not exist!";
            public const string Contest_duration_not_set = "The contest does not have duration set!";
            public const string Participant_participation_time_not_set = "Participant does not have participation time set!";
            public const string Participation_time_reduce_below_duration_warning = "Participant time cannot be reduced, because it will be below the contest duration!";
        }

        public static class ProblemGroupsBusiness
        {
            public const string Cannot_copy_problem_groups_into_active_contest = "Cannot copy problem group into an active contest";
            public const string Cannot_copy_problem_groups_into_same_contest = "Cannot copy problem groups into the same contest";
            public const string Cannot_delete_problem_group_with_problems = "Cannot delete problem group with problems";
        }

        public static class ProblemsBusiness
        {
            public const string Cannot_copy_problems_into_active_contest = "Cannot copy problems into an active contest";
            public const string Cannot_copy_problems_into_same_contest = "Cannot copy problems into the same contest";
        }

        public static class AdministrationGeneral
        {
            public const string Add = "Add";
            public const string Back_to_navigation = "Back to navigation";
            public const string Cancel = "Cancel";
            public const string Change = "Change";
            public const string Choose_file = "Choose File";
            public const string Create = "Create";
            public const string Created_on = "Created on";
            public const string Delete = "Delete";
            public const string Delete_prompt = "Do you want to delete this item?";
            public const string Edit = "Edit";
            public const string Export_to_excel = "Export To Excel";
            public const string Group_by_message = "Drag and drop here the title of the column you wish to group by";
            public const string Modified_on = "Modified on";
            public const string Name = "Name";
            public const string No_privileges_message = "You don't have privileges for this action!";
            public const string Remove = "Remove";
        }
    }
}