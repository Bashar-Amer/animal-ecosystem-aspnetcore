using Microsoft.EntityFrameworkCore;
using WebApp.Data;
using WebApp.Interfaces.Services;
using WebApp.Models;

namespace WebApp.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _dbContext;

        public UserService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ICollection<ApplicationUser>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<ApplicationUser?> GetByIdAsync(string id)
        {
            if (id == null)
                return null;

            var user = await _dbContext.Users.FirstOrDefaultAsync(m => m.Id == id);

            if (user == null)
                return null;
            else
                return user;
        }
    }
}
