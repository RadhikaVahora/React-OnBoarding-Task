using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace React_Onboarding.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        [Required(ErrorMessage = "Please Enter Name")]
        public string Name { get; set; }

        public float Price { get; set; }

        //Relationship
        public ICollection<Sales> Sales { get; set; }
    }
}