using System.Web.Mvc;

namespace UrbanMovement.Extentions
{
    public static class TagExtentions
    {
        public static void AddIdentity(this TagBuilder tag, string identity)
        {
            if (!string.IsNullOrEmpty(identity))
            {
                tag.Attributes["id"] = identity;
            }
        }

        public static void AddClass(this TagBuilder tag, string cssClass)
        {
            if (!string.IsNullOrEmpty(cssClass))
            {
                tag.AddCssClass(cssClass);
            }
        }
    }
}