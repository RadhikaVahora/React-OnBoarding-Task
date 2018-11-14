using React_Onboarding.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace React_Onboarding.Controllers
{
    public class CustomerController : Controller
    {
        private DbModel db = new DbModel();
        // GET: Customer
        public ActionResult Index()
        {
            return View();
        }
 
        public JsonResult GetCustomers()
        {

            var data = db.Customer.ToList();
            return new JsonResult { Data = data, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        [HttpPost]
        public JsonResult AddCustomer(Customer customer)
        {
            if (ModelState.IsValid)
            {
                db.Customer.Add(customer);
                db.SaveChanges();
                
            }
            return new JsonResult { JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        [HttpPut]
        public JsonResult EditCustomer(Customer customer) {

            if (!ModelState.IsValid)
            {
                HttpNotFound();
            }
            int id = customer.CustomerId;
            var CusObj = db.Customer.SingleOrDefault(c => c.CustomerId == id);
            CusObj.CustomerName = customer.CustomerName;
            CusObj.Address = customer.Address;
            db.SaveChanges();


                return new JsonResult { JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        [HttpGet]
        public JsonResult GetCustomer(int id) {
            var customer = db.Customer.SingleOrDefault(c => c.CustomerId == id);
            if (customer == null)
                HttpNotFound();
            return new JsonResult {Data = customer, JsonRequestBehavior= JsonRequestBehavior.AllowGet };
        }

        [HttpDelete]
        public JsonResult DeleteCustomer(int? id) {
            var customer = db.Customer.SingleOrDefault(c => c.CustomerId == id);
            if (customer == null)
                HttpNotFound();
            db.Customer.Remove(customer);
            db.SaveChanges();
            return new JsonResult { JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
    }
}