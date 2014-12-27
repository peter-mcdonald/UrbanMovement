namespace UrbanMovement.Controllers
{
    public class SocialController : UmController
    {
        public string UrbanMovement()
        {
            return RenderPartialViewToString("_UrbanSocial");
        }

        public string Sooz()
        {
            return RenderPartialViewToString("_SoozSocial");
        }

        public string Ragz()
        {
            return RenderPartialViewToString("_RagzSocial");
        }

        public string SoulChild()
        {
            return RenderPartialViewToString("_SoulChildSocial");
        }

    }
}
