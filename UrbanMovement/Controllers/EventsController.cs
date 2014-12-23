namespace UrbanMovement.Controllers
{
    public class EventsController : UmController
    {
        public string Calendar()
        {
            return RenderPartialViewToString("_Events");
        }

    }
}
