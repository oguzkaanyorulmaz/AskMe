using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AskMe.Domain.Entities
{
    public abstract class EBaseEntity
    {
        public Guid Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsDeleted { get; set; }

        protected EBaseEntity()
        {
            Id = Guid.NewGuid();
            CreatedDate = DateTime.UtcNow;
            IsDeleted = false;
        }
    }
}