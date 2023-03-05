using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
        public static async Task SeedAsync(StoreContext context)
        {
            if (!context.ProductBrands.Any())
            {
                var brand = File.ReadAllText("../Infrastructure/Data/SeedData/brands.json");
                var brands = JsonConvert.DeserializeObject<List<ProductBrand>>(brand);
                context.ProductBrands.AddRange(brands);
            }
            if (!context.ProductTypes.Any())
            {
                var typesData = File.ReadAllText("../Infrastructure/Data/SeedData/types.json");
                var types = JsonConvert.DeserializeObject<List<ProductType>>(typesData);
                context.ProductTypes.AddRange(types);
            }
            if (!context.Products.Any())
            {
                var productsData = File.ReadAllText("../Infrastructure/Data/SeedData/products.json");
                var products = JsonConvert.DeserializeObject<List<Product>>(productsData);
                context.Products.AddRange(products);
            }
            if(context.ChangeTracker.HasChanges()) 
            {
                await context.SaveChangesAsync();
            }
        }
    }
}
