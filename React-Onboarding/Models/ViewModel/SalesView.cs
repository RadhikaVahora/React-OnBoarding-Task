using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace React_Onboarding.Models
{
    public class SalesView
    {
        [Key]
        public int SaleId { get; set; }

        //Relationship
        public String CustomerName { get; set; }
        public int CustomerId { get; set; }
        public String ProductName { get; set; }
        public int ProductId { get; set; }
        public String StoreName { get; set; }
        public int StoreId { get; set; }


        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime Date { get; set; }
    }
}