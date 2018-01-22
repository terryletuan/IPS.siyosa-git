using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IndoorTracking_DAL.Entity;
using IndoorTracking_DAL.Model;

namespace IndoorTracking.Controllers
{
    public class ReportController : BaseController
    {
        // GET: Report
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Rp_by_tracked_tag(string devicecode, string fromdate = "", string todate = "")
        {
            var data = _unitOfWork.ReportRepository.Rp_By_tracked(devicecode, fromdate, todate);
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Rp_by_tracked_tagf(string devicecode, string fromdate, string todate)
        {
            List<ReportDeviceModel> listhide;
            var data = _unitOfWork.ReportRepository.Rp_By_tracked_Find(devicecode, fromdate, todate, out  listhide);
            return Json(new { data  = data , listhide = listhide }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Rp_by_tracked_tagf1(string devicecode, string fromdate, string todate)
        {
            List<ReportDeviceModel> listhide;
            var data = _unitOfWork.ReportRepository.Rp_By_tracked_Find1(devicecode, fromdate, todate, out listhide);
            return Json(new { data = data, listhide = listhide }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Rp_by_tracked_group(int devicegroup, string fromdate = "", string todate = "")
        {
            return Json(_unitOfWork.ReportRepository.Rp_by_tracked_group(devicegroup, fromdate, todate), JsonRequestBehavior.AllowGet);
        }

        public JsonResult Rp_Compare(string device1, string device2, string fromdate = "", string todate = "")
        {
            return Json(_unitOfWork.ReportRepository.Rp_Compare(device1, device2, fromdate, todate), JsonRequestBehavior.AllowGet);
        }

        public JsonResult Rp_logtime(string devicecode, string fromdate = "", string todate = "")
        {
            var data = _unitOfWork.ReportRepository.Rp_logtime(devicecode, fromdate, todate);
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        public JsonResult AutoFindTheWay(int idff, int idft)
        {
            var data = _unitOfWork.ReportRepository.AutoFindTheWay(idff, idft);
            if(data != null)
                return Json(data, JsonRequestBehavior.AllowGet);
            else
                return Json("", JsonRequestBehavior.AllowGet);
        }
        public JsonResult RealtimeMap(int idff = 0, int idft = 0)
        {                        
            return Json("", JsonRequestBehavior.AllowGet);
        }
    }
}