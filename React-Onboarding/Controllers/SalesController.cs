using React_Onboarding.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace React_Onboarding.Controllers
{
    public class SalesController : Controller
    {
        private DbModel db = new DbModel();
        // GET: Sales
        public ActionResult Index()
        {
            return View();
        }
        //[HttpGet]
        //public JsonResult GetSaleRecord(int id)
        //{
        //    SalesView salerecord = new SalesView();
        //    if (!ModelState.IsValid)
        //        throw new HttpException();

        //    var sale = db.Sales.SingleOrDefault(c => c.SaleId == id);
        //    if (sale == null)
        //        HttpNotFound();
        //    salerecord.Date = sale.Date;
        //    salerecord.SaleId = sale.SaleId;
        //    salerecord.CustomerId = sale.CustomerId;
        //    salerecord.ProductId = sale.ProductId;
        //    salerecord.StoreId = sale.StoreId;

        //    return new JsonResult { Data = salerecord, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        //}
        public JsonResult GetSalesRecord()
        {
            List<SalesView> List = db.Sales.Select(x => new SalesView
            {
                SaleId = x.SaleId,
                CustomerId = x.CustomerId,
                CustomerName = x.Customer.CustomerName,
                ProductName = x.Product.Name,
                StoreName = x.Store.Name,
                ProductId = x.Product.ProductId,
                StoreId = x.Store.StoreId,
                Date = x.Date

            }).ToList();

            return new JsonResult { Data = List, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        [HttpPost]
        public JsonResult Create(Sales sale)
        {
            if (!ModelState.IsValid)
            {
                HttpNotFound();
            }
            db.Sales.Add(sale);
            db.SaveChanges();
            return new JsonResult {JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        [HttpPut]
        public JsonResult Edit(Sales sale)
        {
            var id = sale.SaleId;
            Sales salerecord = sale;

            if (!ModelState.IsValid)
                HttpNotFound();
            var SaleObj = db.Sales.SingleOrDefault(c => c.SaleId == id);
            if (SaleObj == null)
               HttpNotFound();
            SaleObj.CustomerId = salerecord.CustomerId;
            SaleObj.ProductId = salerecord.ProductId;
            SaleObj.StoreId = salerecord.StoreId;
            SaleObj.Date = salerecord.Date;
            db.SaveChanges();
            return new JsonResult { JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //[HttpPost]
        //public JsonResult GetSale(int id) {
        //    SalesView salerecord = new SalesView();
        //    if (!ModelState.IsValid)
        //        HttpNotFound();

        //    var sale = db.Sales.SingleOrDefault(c => c.SaleId == id);
        //    if (sale == null)
        //        HttpNotFound();
        //    salerecord.Date = sale.Date;
        //    salerecord.SaleId = sale.SaleId;
        //    salerecord.CustomerId = sale.CustomerId;
        //    salerecord.ProductId = sale.ProductId;
        //    salerecord.StoreId = sale.StoreId;

        //    return new JsonResult { Data = salerecord, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        //}
        [HttpDelete]
        public JsonResult Delete(int id)
        {

            var SaleObj = db.Sales.SingleOrDefault(c => c.SaleId == id);
            if (SaleObj == null)
                HttpNotFound();
            db.Sales.Remove(SaleObj);
            db.SaveChanges();
            return new JsonResult { JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }


    }
}