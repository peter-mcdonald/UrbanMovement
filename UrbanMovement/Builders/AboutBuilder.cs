using System.Net.Http;
using System.Web.Mvc;
using UrbanMovement.Helpers;

namespace UrbanMovement.Builders
{
    public class AboutBuilder
    {
        public MvcHtmlString Build()
        {
            if (SessionHelper.Exists("About"))
            {
                return SessionHelper.Get<MvcHtmlString>("About");
            }

            var content = string.Empty;

            using (var client = new HttpClient())
            {
                var response = client.GetAsync("http://urbanmovemententertainment.wordpress.com/about/").Result;
                content = response.Content.ReadAsStringAsync().Result;
            }

            var start = content.IndexOf(@"<!--begin-->") + 12;
            var end = content.IndexOf(@"<!--end-->");

            var result = new MvcHtmlString(content.Substring(start, end - start));

            SessionHelper.Add("About", result);

            return result;
        }
    }
}