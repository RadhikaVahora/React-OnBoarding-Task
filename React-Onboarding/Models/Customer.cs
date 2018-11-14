using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace React_Onboarding.Models
{
    public class Customer
    {
        [Key]
        public int CustomerId { get; set; }

        [Required(ErrorMessage = "Enter Customer Name")]
        [StringLength(20, MinimumLength = 2)]
        public string CustomerName { get; set; }
        [Required(ErrorMessage = "Enter Customer Address")]
        public string Address { get; set; }
    }
}