using System;
using System.IO;
using System.Web.Mvc;

namespace UrbanMovement.Controllers
{
    public class CofController : Controller
    {
        protected string RenderViewToString(string viewName, object model)
        {
            if (string.IsNullOrEmpty(viewName))
            {
                throw new ArgumentNullException("viewName");
            }

            ViewData.Model = model;

            using (var sw = new StringWriter())
            {
                var viewResult = ViewEngines.Engines.FindView(ControllerContext, viewName, string.Empty);
                var viewContext = new ViewContext(ControllerContext, viewResult.View, ViewData, TempData, sw);
                viewResult.View.Render(viewContext, sw);

                return sw.GetStringBuilder().ToString();
            }
        }

        protected string RenderPartialViewToString(string viewName, object model)
        {
            if (string.IsNullOrEmpty(viewName))
            {
                throw new ArgumentNullException("viewName");
            }

            ViewData.Model = model;

            using (var sw = new StringWriter())
            {
                var viewResult = ViewEngines.Engines.FindPartialView(ControllerContext, viewName);
                var viewContext = new ViewContext(ControllerContext, viewResult.View, ViewData, TempData, sw);
                viewResult.View.Render(viewContext, sw);

                return sw.GetStringBuilder().ToString();
            }
        }
    }
}