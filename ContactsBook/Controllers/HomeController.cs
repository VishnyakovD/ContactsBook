using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ContactsBook.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ContactsBook.Controllers
{
    public class HomeController : Controller
    {
        private DB DBInfo;

        public HomeController()
        {
            DBInfo=new DB();
        }
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Groups()
        {
            return View();
        }

        public ActionResult Clocks()
        {
            return View();
        }

        public ActionResult GetContacts()
        {
            var contacts = new List<Contact>();
            var json = string.Empty;
            try
            {
              var contactsDB = DBInfo.Contacts();
                contacts = contactsDB.Select(itemDB => new Contact()
                {
                    Age = (itemDB.Age.HasValue) ? itemDB.Age.Value : 0,
                    Description = itemDB.Description,
                    Group = new Group() { Id = (itemDB.GroupDB!=null)?itemDB.GroupDB.Id:-1, Name = (itemDB.GroupDB != null) ? itemDB.GroupDB.Name : "No group" },
                    Name = itemDB.Name,
                    Id = itemDB.Id,
                    Note = itemDB.Note,
                    Surname = itemDB.Surname
                }).ToList();

                json = JsonConvert.SerializeObject(
                            contacts,
                            Formatting.Indented,
                            new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() }
                          );
            }
            catch (Exception)
            {
                throw;
            }


            return Json(json);
        }

        public ActionResult GetGroups()
        {
            var groups = new List<Group>();
            var groupsDB = DBInfo.GroupsDB();
            groups = groupsDB.Select(itemDB => new Group()
            {
                Name = itemDB.Name,
                Id = itemDB.Id,
            }).ToList();

            string json = JsonConvert.SerializeObject(
                        groups,
                        Formatting.Indented,
                        new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() }
                      );

            return Json(json);
        }

        
        public int SaveContact(string contact)
        {
            var cont= JsonConvert.DeserializeObject<Contact>(contact, new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver()} );
            var contDB=new ContactDB();
            contDB.Id = cont.Id;
            contDB.Name = cont.Name;
            contDB.GroupId= cont.Group.Id;
            contDB.Surname = cont.Surname;
            contDB.Age = cont.Age;
            contDB.Description = cont.Description;
            contDB.Note = cont.Note;
            return DBInfo.CreateContact(contDB);
        }

        public ActionResult RemoveContacts(int[] ids)
        {
            try
            {
                DBInfo.RemoveContact(ids);
                return Content("ok", "html");
            }
            catch (Exception)
            {
                return Content("error", "html");
                throw;
            }
        }

        public ActionResult RemoveGroups(int[] ids)
        {
            try
            {
                DBInfo.RemoveGroup(ids);
                return Content("ok", "html");
            }
            catch (Exception)
            {
                return Content("error", "html");
                throw;
            }

        }

        public ActionResult GetGroupsFull()
        {
            var groups = new List<Group>();
            var groupsDB = DBInfo.GroupsDB();
            groups = groupsDB.Select(itemDB => new Group()
            {
                Name = itemDB.Name,
                Id = itemDB.Id,
            }).ToList();

            var contactsDB = DBInfo.Contacts();
            var contacts = contactsDB.Select(itemDB => new Contact()
            {
                Age = (itemDB.Age.HasValue) ? itemDB.Age.Value : 0,
                Description = itemDB.Description,
                Group = new Group() { Id = (itemDB.GroupDB != null) ? itemDB.GroupDB.Id : -1, Name = (itemDB.GroupDB != null) ? itemDB.GroupDB.Name : "No group" },
                Name = itemDB.Name,
                Id = itemDB.Id,
                Note = itemDB.Note,
                Surname = itemDB.Surname
            }).ToList();

            foreach (var item in groups)
            {
                item.Contacts.AddRange(contacts.Where(cont=>cont.Group.Id==item.Id));
            }

            string json = JsonConvert.SerializeObject(
                        groups,
                        Formatting.Indented,
                        new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() }
                      );

            return Json(json);
        }

        public int SaveGroup(string group)
        {
            var cont = JsonConvert.DeserializeObject<Group>(group, new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
            var contDB = new GroupDB();
            contDB.Id = cont.Id;
            contDB.Name = cont.Name;
            return DBInfo.CreateGroup(contDB);
        }
    }
}