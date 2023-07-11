namespace OJS.Servers.Worker.Controllers;

using System;

using Microsoft.AspNetCore.Mvc;

public class TempController : ControllerBase
{
    [HttpGet]
    public IActionResult TempAction()
    {
        Console.WriteLine("temp");

        return this.Ok();
    }
}