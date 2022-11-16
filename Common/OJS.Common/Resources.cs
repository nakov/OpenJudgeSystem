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
            public const string No_permissions_for_contest = "You don't have permissions for the contest!";
            public const string Remove = "Remove";
        }

        public static class ContestsControllers
        {
            public const string Active_contest_cannot_edit_duration_type = "Contest is active and Duration and Type cannot be edited!";
            public const string Active_contest_forbidden_for_deletion = "Contest is active and cannot be deleted!";
            public const string Active_contest_forbidden_for_transfer = "Contest is active and participants cannot be transferred";
            public const string Added_time_to_participants_online = "Successfully added {0} minutes to the times of all selected active participants in the contest {1}";
            public const string Added_time_to_single_participant_online = "Successfully added {0} minutes to the time of the participant with username: {1}, in the contest {2}";
            public const string Contest_added = "Contest added successfully";
            public const string Contest_edited = "Contest edited successfully";
            public const string Contest_not_found = "Contest not found";
            public const string Contest_not_valid = "Contest is not valid";
            public const string Contest_start_date_before_end = "Contest start date must be before the contest end date";
            public const string Duration_invalid_format = "Duration must be in format \"hh:mm\"";
            public const string Failed_to_update_participants_duration = "<br />WARNING: The following users' contest duration was not updated because their contest duration would have been reduced below the base contest duration: {0}";
            public const string No_active_contests = "No active contests";
            public const string No_future_contests = "No future contests";
            public const string No_latest_contests = "No latest contests";
            public const string No_question_by_id = "Question could not be found by given Id";
            public const string Participant_not_in_contest = "The participant is not in the contest!";
            public const string Participants_transferred = "Participants transferred successfully";
            public const string Practice_start_date_before_end = "Practice start date must be before the practice end date";
            public const string Problem_groups_count_limit = "Problem groups count cannot be more than {0}";
            public const string Report_zip_format = "{1} submissions for {0}.zip";
            public const string Required_field_for_online = "The field is required for Online Contest";
            public const string Select_one_submission_type = "Choose at least one submission type!";
            public const string Subtracted_time_from_participants_online = "Successfully subtracted {0} minutes from the times of all selected active participants in the contest {1}";
            public const string Subtracted_time_from_single_participant_online = "Successfully subtracted {0} minutes from the time of the participant with username: {1}, in the contest {2}";
            public const string Category_Not_Selected = "Category not selected!";
        }

        public static class ExamGroupsController
        {
            public const string Cannot_add_users = "You cannot add users to exam group that is not attached to a contest.";
            public const string Cannot_attach_contest = "You don't have privileges to attach this contest to an exam group!";
            public const string Cannot_delete_group_with_active_contest = "You cannot delete exam group which has active contest attached to it.";
            public const string Cannot_remove_users = "You cannot remove users from exam group that is not attached to a contest.";
            public const string Users_added = "Users were added successfully to the exam group.";
        }

        public static class ProblemsController
        {
            public const string Active_contest_problems_permitted_for_deletion = "The contest is active and problems cannot be deleted!";
            public const string Copy_problem_success_message = "Successfully copied the problem \"{0}\" into the contest \"{1}\"";
            public const string Invalid_contest = "Invalid contest";
            public const string Invalid_problem = "Invalid problem";
            public const string Invalid_problem_group = "Invalid problem group";
            public const string Invalid_tests = "Invalid tests";
            public const string Invalid_user = "Invalid user";
            public const string Must_be_zip_file = "Uploaded file must be in .ZIP format.";
            public const string Problem_added = "Problem added successfully.";
            public const string Problem_deleted = "Problem deleted successfully.";
            public const string Problem_edited = "Problem edited successfully.";
            public const string Problem_not_found = "The problem was not found!";
            public const string Problem_retested = "Problem retested successfully.";
            public const string Problems_deleted = "Problems deleted successfully.";
            public const string Resources_not_complete = "Resources must be fully entered.";
            public const string Select_one_submission_type = "Choose at least one submission type!";
            public const string Tests_cannot_be_improrted = "The tests cannot be imported: {0}";
        }

        public static class ProblemsRetest
        {
            public const string Retest = "Retest";
            public const string Retest_confirmation_message = "Are you sure you want to Retest <strong>{0} submissions</strong> from the problem <strong>{1}</strong>?";
        }

        public static class ProblemGroupsControllers
        {
            public const string Active_contest_cannot_add_problem_group = "The contest is аctive and you cannot add problem groups";
            public const string Active_contest_cannot_delete_problem_group = "The contest is аctive and you cannot delete problem groups";
            public const string Can_create_only_in_online_contest = "You can create problem groups only in a contest which is of type {0}";
            public const string Can_edit_orderby_only_in_online_contest = "You can edit problem groups order only in a contest which is of type {0}.";
            public const string Contest_does_not_exist = "The selected contest does not exist";
            public const string Contest_required = "Contest is required";
            public const string Copy_all_problem_groups_success_message = "Successfully copied all problem groups from the contest \"{0}\" into the contest \"{1}\"";
        }

        public static class TestsControllers
        {
            public const string No_empty_file = "File must not be empty";
            public const string Must_be_zip = "File must be a zip";
            public const string Zip_damaged = "Zip is damaged";
            public const string Invalid_tests = "Invalid tests";
            public const string Tests_added_to_problem = "{0} tests added to problem successfully.";
        }

        public static class ProblemsDeleteAll
        {
            public const string Confirm = "Confirm";
            public const string Confirm_message = "Do you want to delete all problems for";
            public const string Page_title = "Delete all problems";
        }

        public static class CopyProblem
        {
            public const string Bulk_copy_contest_label = "Search for the contest in which you want to copy all the problems";
            public const string Contest_label = "Search for the contest in which you want to copy the problem in";
            public const string Contest_required = "Contest is required";
            public const string Problem_group_label = "Problem group:";
            public const string Problem_group_placeholder = "Copy into a new problem group";
        }

        public static class Partials
        {
            public const string Back = "Back";
            public const string Choose_contest = "Choose contest...";
            public const string Choose_resource = "Choose resource";
            public const string Copy = "Copy";
            public const string Delete_current_questions = "Delete current questions";
            public const string Details = "Details";
            public const string File = "File";
            public const string Name = "Name";
            public const string Type = "Type";
        }

        public static class ProblemResourcesController
        {
            public const string File_required = "The file is required!";
            public const string Only_link_allowed = "The resource should not have file, but only link";
            public const string Only_file_allowed = "The resource should not have link, but only file";
            public const string Invalid_resource = "Resource is invalid!";
            public const string Link_not_empty = "The link must not be empty";
            public const string Problem_not_found = "Problem not found.";
            public const string Resource_not_found = "Resource not found.";
        }
    }
}