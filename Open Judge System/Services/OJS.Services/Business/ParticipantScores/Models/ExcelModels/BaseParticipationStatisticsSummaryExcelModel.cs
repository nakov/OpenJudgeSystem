namespace OJS.Services.Business.ParticipantScores.Models.ExcelModels
{
    using System.IO;
    using NPOI.HSSF.UserModel;
    using NPOI.SS.UserModel;
    using OJS.Web.Common.Extensions;
    
    public abstract class ParticipationStatisticsSummaryExcelModel<TSummaryType>
    {
        protected HSSFWorkbook Workbook { get; set; }
        
        protected ISheet sheet;
        
        protected int rowNumber = 1;
        protected int preProblemsColumnsCount = 3;
        
        protected TSummaryType Summary { get; set; }

        protected ParticipationStatisticsSummaryExcelModel(TSummaryType summary)
        {
            this.Summary = summary;
            this.Create();
        }
        
        public byte[] GetBytes()
        {
            using (var outputStream = new MemoryStream())
            {
                Workbook.Write(outputStream);
            
                return outputStream.ToArray();
            }
        }
        
        protected void Create()
        {
            this.Workbook = new HSSFWorkbook();
            this.sheet = Workbook.CreateSheet();
            var columnsCount = this.CreateResultsSheetHeaderRow();

            FillSheet();

            sheet.AutoSizeColumns(columnsCount);
        }

        protected abstract void FillSheet();

        protected abstract int CreateResultsSheetHeaderRow();
    }
}