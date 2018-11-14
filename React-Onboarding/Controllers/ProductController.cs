using React_Onboarding.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace React_Onboarding.Controllers
{
    public class ProductController : Controller
    {
        private DbModel db = new DbModel();
        // GET: Product
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetProducts()
        {

            var data = db.Product.ToList();
            return new JsonResult { Data = data, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        [HttpPost]
        public JsonResult AddProduct(Product product)
        {
            if (ModelState.IsValid)
            {
                db.Product.Add(product);
                db.SaveChanges();

            }
            return new JsonResult { JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        [HttpPut]
        public JsonResult EditProduct(Product product)
        {

            if (!ModelState.IsValid)
            {
                HttpNotFound();
            }
            int id = product.ProductId;
            var PrObj = db.Product.SingleOrDefault(c => c.ProductId == id);
            PrObj.Name = product.Name;
            PrObj.Price = product.Price;
            db.SaveChanges();


            return new JsonResult { JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        [HttpDelete]
        public JsonResult DeleteProduct(int? id)
        {
            var product = db.Product.SingleOrDefault(c => c.ProductId == id);
            if (product == null)
                HttpNotFound();
            db.Product.Remove(product);
            db.SaveChanges();
            return new JsonResult { JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
    }
}