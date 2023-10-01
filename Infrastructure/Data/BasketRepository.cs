using Core.Entities;
using Core.Interfaces;
using Newtonsoft.Json;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Infrastructure.Data
{
    public class BasketRepository : IBasketRepository
    {
        IDatabase _database;
        public BasketRepository(IConnectionMultiplexer connection)
        {
            _database = connection.GetDatabase();
        }
        public async Task<CustomerBasket> GetBasketAsync(string id)
        {
            var data = await _database.StringGetAsync(id);

            return string.IsNullOrEmpty(data) ? null : System.Text.Json.JsonSerializer.Deserialize<CustomerBasket>(data);
        }
        public async Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket)
        {
            var created = await _database.StringSetAsync(basket.Id, System.Text.Json.JsonSerializer.Serialize<CustomerBasket>(basket), TimeSpan.FromDays(30));
            if (!created)
            {
                return null;
            }
            return await GetBasketAsync(basket.Id);
        }

        public Task<bool> DeleteBasketAsync(string id)
        {
            return _database.KeyDeleteAsync(id);
        }


    }
}
