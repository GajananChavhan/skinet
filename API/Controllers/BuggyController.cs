using Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseAPIController
    {
        public BuggyController(StoreContext context)
        {
            Context = context;
        }

        public StoreContext Context { get; }

        [HttpGet("notfound")]
        public ActionResult GetNotFoundRequest()
        {
            var thing = Context.Products.Find(111);
            if (thing == null)
            {
                return NotFound();
            }
            return Ok(thing);
        }
        [HttpGet("servererror")]
        public ActionResult GetServerErrorRequest()
        {
            var thing = Context.Products.Find(111);
            thing.ToString();
            return Ok();
        }
        [HttpGet("badrequest")]
        public ActionResult GetBadRequest()
        {
            return BadRequest();
        }
    }
}
