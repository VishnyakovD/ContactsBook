using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ContactsBook.Models
{
    public class IdName
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public IdName()
        {
            
        }
    }

    public class Group : IdName
    {
        public List<Contact> Contacts { get; set; }
        public Group()
        {
            Contacts=new List<Contact>();
        }
    }

   public class Contact : IdName
    {
        public String Surname { get; set; }
        public int Age { get; set; }
        public Group Group { get; set; }
        public String Description { get; set; }
        public String Note { get; set; }

        public Contact()
        {
            Group=new Group();
        }
    }
}