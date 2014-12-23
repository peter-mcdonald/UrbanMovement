using UrbanMovement.Builders;

namespace UrbanMovement.Controllers
{
    public class UrbanMovementController : UmController
    {
        public string Biographies()
        {
            return new BiographyBuilder().Build();
        }
    }
}
