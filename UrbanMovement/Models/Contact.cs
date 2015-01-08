using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace UrbanMovement.Models
{
    public class Contact
    {
        [Required(ErrorMessage = "Your Name is required")]
        [DisplayName("Name")]
        [StringLength(50, ErrorMessage = "50 characters at most please")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Your Email is required")]
        [DisplayName("Email Address")]
        [EmailAddress(ErrorMessage = "The Email address is not valid")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Your Phone Number is required")]
        [DisplayName("Phone Number")]
        [Phone]
        public string Phone { get; set; }

        [Required(ErrorMessage = "A Subject is required")]
        [DisplayName("Subject")]
        [StringLength(50, ErrorMessage = "50 characters at most please")]
        public string Subject { get; set; }

        [Required(ErrorMessage = "A message is required")]
        [DisplayName("Message")]
        [StringLength(300, ErrorMessage = "300 characters at most please")]
        public string Message { get; set; }
    }
}