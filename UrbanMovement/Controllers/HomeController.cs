using System.Web.Mvc;
using UrbanMovement.Builders;

namespace UrbanMovement.Controllers
{
    public class HomeController : UmController
    {

        public ActionResult Index()
        {
            return View();
        }

        public string GetBlogPosts()
        {
            var model = new BlogPostBuilder().Build();
            return RenderPartialViewToString("_BlogItems", model);
        }
    }
}
