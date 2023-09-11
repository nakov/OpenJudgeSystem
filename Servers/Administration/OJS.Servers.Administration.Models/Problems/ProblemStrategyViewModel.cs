namespace OJS.Servers.Administration.Models.Problems;

using AutoCrudAdmin.ViewModels;

public class ProblemStrategyViewModel : FormControlViewModel
{
    public FormControlViewModel? ExpandableMultiChoiceCheckBoxFormControlViewModel { get; set; }

    public FormControlViewModel? TimeLimit { get; set; }

    public FormControlViewModel? MemoryLimit { get; set; }
}