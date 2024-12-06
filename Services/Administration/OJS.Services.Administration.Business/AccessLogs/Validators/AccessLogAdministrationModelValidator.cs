namespace OJS.Services.Administration.Business.AccessLogs.Validators;

using OJS.Data.Models;
using OJS.Services.Administration.Models.AccessLogs;
using OJS.Services.Common.Data;
using OJS.Services.Common.Validation;

public class AccessLogAdministrationModelValidator(IDataService<AccessLog> dataService) : BaseValidator<AccessLogAdministrationModel>();