namespace OJS.Services.Administration.Business.LecturersInCategories;

using OJS.Services.Administration.Models.LecturerInCategories;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface ILecturersInCategoriesBusinessService : IService
{
    Task<LecturerToCategoryModel> AddLecturerToCategory(LecturerToCategoryModel model);

    Task RemoveLecturerFromCategory(LecturerToCategoryModel model);
}