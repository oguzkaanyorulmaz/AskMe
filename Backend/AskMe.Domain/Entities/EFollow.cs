using System;

namespace AskMe.Domain.Entities
{
    public class EFollow : EBaseEntity
    {
        public required string FollowerUsername { get; set; }
        public required string FollowedUsername { get; set; }
    }
}
