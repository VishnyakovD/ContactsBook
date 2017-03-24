using ContactsBook.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ContactsBook
{
    public class DB
    {
        DataClasses1DataContext DC;
        public DB()
        {
            DC = new DataClasses1DataContext();
        }

        public List<ContactDB> Contacts()
        {
            var qList =
                from a in DC.GetTable<ContactDB>()
                select a;
            return qList.ToList();
        }

        public List<GroupDB> GroupsDB()
        {
            var qList =
                from a in DC.GetTable<GroupDB>()
                select a;
            return qList.ToList();
        }

        public int CreateContact(ContactDB contact)
        {
            if (contact.Id < 1)
            {
                DC.ContactDBs.InsertOnSubmit(contact);
            }
            else
            {
                var query =
                    from con in DC.ContactDBs
                    where con.Id == contact.Id
                    select con;

                foreach (ContactDB contDB in query)
                {
                    contDB.Name = contact.Name;
                    //contDB.GroupDB = new GroupDB();
                    // contDB.GroupDB.Id = contact.GroupDB.Id;
                    //contDB.GroupDB.Name = contact.GroupDB.Name;
                    contDB.GroupId = contact.GroupId;
                    contDB.Surname = contact.Surname;
                    contDB.Age = contact.Age;
                    contDB.Description = contact.Description;
                    contDB.Note = contact.Note;
                }
            }

            try
            {
                DC.SubmitChanges();
            }
            catch (Exception e)
            {
                DC.SubmitChanges();
            }
            return contact.Id;
        }

        public int CreateGroup(GroupDB gr)
        {
            if (gr.Id < 1)
            {
                DC.GroupDBs.InsertOnSubmit(gr);
            }
            else
            {
                var query =
                    from con in DC.GroupDBs
                    where con.Id == gr.Id
                    select con;

                foreach (GroupDB itemDB in query)
                {
                    itemDB.Name = gr.Name;
                }
            }

            try
            {
                DC.SubmitChanges();
            }
            catch (Exception e)
            {
                DC.SubmitChanges();
            }
            return gr.Id;
        }

        public void RemoveContact(int[] ids)
        {
            var query = DC.ContactDBs.Where(it => ids.Contains(it.Id));
            DC.ContactDBs.DeleteAllOnSubmit(query);

            try
            {
                DC.SubmitChanges();
            }
            catch (Exception e)
            {
                DC.SubmitChanges();
            }
        }

        public void RemoveGroup(int[] ids)
        {
            var query1 = DC.ContactDBs.Where(it => ids.Contains((it.GroupId.HasValue)?it.GroupId.Value:0));
            foreach (ContactDB contDB in query1)
            {
                contDB.GroupId = null;
            }

            var query = DC.GroupDBs.Where(it => ids.Contains(it.Id));
            DC.GroupDBs.DeleteAllOnSubmit(query); 

            try
            {
                DC.SubmitChanges();
            }
            catch (Exception e)
            {
                DC.SubmitChanges();
            }
        }
    }


}


