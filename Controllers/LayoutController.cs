using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IndoorTracking.Common;

namespace IndoorTracking.Controllers
{
    public class LayoutController : BaseController
    {
        // GET: Layout
        public ActionResult Index()
        {
            return View();
        }

        public PartialViewResult MapTracking()
        {
            return PartialView("MapTracking");
        }
        public PartialViewResult Fingerprints()
        {
            return PartialView("Fingerprints");
        }

        public PartialViewResult Report()
        {
            return PartialView("Report");
        }

        public PartialViewResult GroupDevice()
        {
            return PartialView("GroupDevice");
        }
        public PartialViewResult Device()
        {
            return PartialView("Device");
        }

        public PartialViewResult User()
        {
            return PartialView("User");
        }

        public PartialViewResult UserGroup()
        {
            return PartialView("UserGroup");
        }
        public PartialViewResult Rp_By_tracked_tag()
        {
            return PartialView("Rp_By_tracked_tag");
        }
        public PartialViewResult Rp_By_tracked_tagF()
        {
            return PartialView("Rp_By_tracked_tagF");
        }
        public PartialViewResult Rp_By_group()
        {
            return PartialView("Rp_By_group");
        }
        public PartialViewResult Rp_logtime()
        {
            return PartialView("Rp_logtime");
        }

        public PartialViewResult Rp_Comparetrackedtag()
        {
            return PartialView("Rp_Comparetrackedtag");
        }
        public PartialViewResult Rp_By_aminition()
        {
            return PartialView("Rp_By_aminition");
        }
        public PartialViewResult Rp_Simulation()
        {
            return PartialView("Rp_Simulation");
        }
        public PartialViewResult ChangePassword()
        {
            return PartialView("ChangePassword");
        }
        public PartialViewResult GroupFindgprint()
        {
            return PartialView("GroupFindgprint");
        }
        public PartialViewResult AutoFindAddress()
        {
            return PartialView("AutoFindAddress");
        }

    }
}