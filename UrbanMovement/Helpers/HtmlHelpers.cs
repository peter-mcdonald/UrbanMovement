using System.Web.Mvc;

namespace UrbanMovement.Helpers
{
    public static class HtmlHelpers
    {
        public static MvcHtmlString Paragraph(this HtmlHelper htmlHelper, string text)
        {
            var tagBuilder = new TagBuilder("p") {InnerHtml = text};

            return new MvcHtmlString(tagBuilder.ToString());
        }
    }
}