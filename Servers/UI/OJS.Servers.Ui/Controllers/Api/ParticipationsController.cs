using FluentExtensions.Extensions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Ui.Models.Participations;
using OJS.Servers.Ui.Models.Submissions.Profile;
using OJS.Services.Ui.Business;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace OJS.Servers.Ui.Controllers.Api
{
    public class ParticipationsController : Controller
    {
        private IParticipationsBusinessService participationsBusiness;

        public ParticipationsController(IParticipationsBusinessService participationsBusiness)
            => this.participationsBusiness = participationsBusiness;

        public async Task<IEnumerable<ParticipationsResponseModel>> GetForProfile()
        {
            var userId = this.GetUserId(HttpContext);

            return await this.participationsBusiness
                .GetParticipationsByUserId(userId)
                .MapCollection<ParticipationsResponseModel>();
        }

        private string? GetUserId(HttpContext context)
            => context.User.Claims.FirstOrDefault(x => x.Type.Contains("nameidentifier"))
                ?.Value;
    }
}