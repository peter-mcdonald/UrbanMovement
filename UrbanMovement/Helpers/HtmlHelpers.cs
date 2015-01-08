using System.Web.Mvc;
using UrbanMovement.Extentions;

namespace UrbanMovement.Helpers
{
    public static class HtmlHelpers
    {
        public static MvcHtmlString Paragraph(this HtmlHelper htmlHelper, string text)
        {
            var tagBuilder = new TagBuilder("p") {InnerHtml = text};

            return new MvcHtmlString(tagBuilder.ToString());
        }

        public static MvcHtmlString Div(this HtmlHelper htmlHelper, string text, string cssClass, string identity = "")
        {
            var tagBuilder = new TagBuilder("div");
            tagBuilder.AddClass(cssClass);
            tagBuilder.AddIdentity(identity);
            tagBuilder.InnerHtml = text;

            return new MvcHtmlString(tagBuilder.ToString());
        }
    }
}