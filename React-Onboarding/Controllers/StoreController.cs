using React_Onboarding.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace React_Onboarding.Controllers
{
    public class StoreController : Controller
    {
        private DbModel db = new DbModel();
        // GET: Store
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetStore()
        {

            var data = db.Store.ToList();
            return new JsonResult { Data = data, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        [HttpPost]
        public JsonResult AddStore(Store store)
        {
            if (ModelState.IsValid)
            {
                db.Store.Add(store);
                db.SaveChanges();

            }
            return new JsonResult { JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        [HttpPut]
        public JsonResult EditStore(Store store)
        {

            if (!ModelState.IsValid)
            {
                HttpNotFound();
            }
            int id = store.StoreId;
            var StrObj = db.Store.SingleOrDefault(c => c.StoreId == id);
            StrObj.Name = store.Name;
            StrObj.Address = store.Address;
            db.SaveChanges();


            return new JsonResult { JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        [HttpDelete]
        public JsonResult DeleteStore(int? id)
        {
            var store = db.Store.SingleOrDefault(c => c.StoreId == id);
            if (store == null)
                HttpNotFound();
            db.Store.Remove(store);
            db.SaveChanges();
            return new JsonResult { JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
    }
}