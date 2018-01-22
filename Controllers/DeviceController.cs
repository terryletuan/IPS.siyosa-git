using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IndoorTracking_DAL.Entity;

namespace IndoorTracking.Controllers
{
    public class DeviceController : BaseController
    {
        // GET: Device
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult _addOrEdit(tb_Device d)
        {
            d.Create_Date = DateTime.Now;
            return Json(_unitOfWork.DeviceRepository._addorEdit(d), JsonRequestBehavior.AllowGet);
        }

        public JsonResult _getDevice()
        {
            var device = _unitOfWork.DeviceRepository._getDevice();
            var color = _unitOfWork.DeviceRepository._getColor();
            return Json(new { device = device , color = color }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult _disable(int id)
        {
            _unitOfWork.DeviceRepository._disable(id);
            return Json("True", JsonRequestBehavior.AllowGet);
        }

        public JsonResult _getColor()
        {
            return Json(_unitOfWork.DeviceRepository._getColor(), JsonRequestBehavior.AllowGet);
        }
    }
}