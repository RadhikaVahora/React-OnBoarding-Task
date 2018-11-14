using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace React_Onboarding.Models
{
    public class Sales
    {
        [Key]
        public int SaleId { get; set; }

        //Relationship
        public Customer Customer { get; set; }
        public int CustomerId { get; set; }
        public Product Product { get; set; }
        public int ProductId { get; set; }
        public Store Store { get; set; }
        public int StoreId { get; set; }


        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime Date { get; set; }
    }
}